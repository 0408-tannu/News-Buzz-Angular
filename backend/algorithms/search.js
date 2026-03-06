// Google News RSS Feed - replaces Puppeteer scraping for search
// Uses shared rssUtils for image fetching and provider logos

import {
  createParser,
  extractProviderName,
  getCleanTitle,
  extractTextFromContent,
  getProviderLogo,
  getRelativeTime,
} from "./rssUtils.js";
import { addSearchLocation } from "../controllers/csearchLocation.js";
import { newsProvidermodel } from "../models/mnewsProvider.js";
import mute_model from "../models/mmute.js";

const parser = createParser();

/**
 * Get the base URL of a news provider from article link
 */
const getProviderBaseURL = (link) => {
  try {
    const url = new URL(link);
    return `${url.protocol}//${url.hostname}`;
  } catch {
    return null;
  }
};

/**
 * Fetch news via Google News RSS for a search query
 */
const Scrap = async ({
  searchText,
  site,
  tbs,
  gl,
  location,
  page,
  mutedSite,
}) => {
  try {
    // Build search query
    let query = searchText || "news";
    if (site) query += ` site:${site}`;
    if (location) query += ` ${location}`;

    const encodedQuery = encodeURIComponent(query);

    // Map gl parameter to Google News country/language codes
    const country = gl || "IN";
    const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-${country}&gl=${country}&ceid=${country}:en`;

    console.log(`[Search RSS] Fetching: ${rssUrl}`);

    const feed = await parser.parseURL(rssUrl);

    // Get muted site domains for filtering
    let mutedDomains = [];
    if (mutedSite) {
      mutedDomains = mutedSite
        .split("-site:")
        .map((s) => s.replace("%20", "").trim())
        .filter(Boolean);
    }

    // Paginate: each page = 10 articles
    const pageNum = parseInt(page) || 0;
    const pageSize = 10;
    const startIndex = pageNum * pageSize;

    let articles = feed.items
      .map((item) => {
        const providerName = extractProviderName(item);
        const articleLink = item.link || "";
        const someText = extractTextFromContent(
          item.content || item.contentSnippet || "",
        );

        return {
          title: getCleanTitle(item.title),
          someText: someText || item.contentSnippet || "Read more...",
          link: articleLink,
          imgURL: null,
          time: getRelativeTime(item.pubDate),
          providerImg: getProviderLogo(providerName, articleLink),
          providerName: providerName,
        };
      })
      .filter((article) => {
        // Filter out articles from muted sites
        if (mutedDomains.length > 0) {
          const articleDomain = getProviderBaseURL(article.link);
          if (
            articleDomain &&
            mutedDomains.some((muted) => articleDomain.includes(muted))
          ) {
            return false;
          }
        }
        return (
          article.title && article.link && article.time && article.providerName
        );
      })
      .slice(startIndex, startIndex + pageSize);

    console.log(`[Search RSS] Found ${articles.length} articles for "${query}"`);
    return articles;
  } catch (error) {
    console.error("[Search RSS] Error:", error.message);
    return [];
  }
};

/**
 * Express route handler for search
 */
const scrapSearch = async (req, res) => {
  let searchText = req?.query.q || "news";
  let site = req.query?.site || "";
  let tbs = req.query?.tbs || "";
  let gl = req.query?.gl || "";
  let location = req.query?.location || "";
  let page = req.params?.page;

  // Get muted sites
  let mutedSiteString = "";
  try {
    let mutedSitesObject = await mute_model
      .findOne({ user: req.user.id })
      .select("mutedURL -_id");

    let mutedSitesArray = mutedSitesObject?.mutedURL;
    if (mutedSitesArray) {
      mutedSiteString = mutedSitesArray
        .map((url) => `-site:${url}`)
        .join(" ");
    }
  } catch (err) {
    console.log("No muted sites found or error:", err.message);
  }

  const articles = await Scrap({
    searchText,
    site,
    tbs,
    gl,
    location,
    page,
    mutedSite: mutedSiteString,
  });

  if (articles.length) {
    let Text = location !== "" ? location : searchText;
    await addSearchLocation(req, res, Text);
  }

  // Save news providers to database
  for (const article of articles) {
    const ProviderBaseURL = getProviderBaseURL(article.link);
    if (ProviderBaseURL) {
      try {
        const provider = await newsProvidermodel.findOne({
          baseURL: ProviderBaseURL,
        });
        if (!provider) {
          await newsProvidermodel.create({
            name: article.providerName,
            baseURL: ProviderBaseURL,
            logo: article.providerImg,
          });
          console.log(`Provider ${article.providerName} created.`);
        }
      } catch (err) {
        console.error("Error processing provider:", err.message);
      }
    }
  }

  res.status(202).json({ success: true, articles: articles });
};

export { scrapSearch, Scrap };
