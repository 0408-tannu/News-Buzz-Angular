// Google News RSS Feed - replaces Puppeteer scraping for search
// Uses free Google News RSS feeds for reliable, fast news fetching

import Parser from "rss-parser";
import { addSearchLocation } from "../controllers/csearchLocation.js";
import { batchSaveProviders, getProviderBaseURL } from "../utils/providerCache.js";
import { db } from "../config/firebase.js";

const mutesCol = db.collection('mutes');

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["source", "source"],
    ],
  },
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  timeout: 15000,
});

/**
 * Extract image URL from RSS item content/description HTML
 */
const extractImageFromContent = (content) => {
  if (!content) return null;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
};

/**
 * Extract description text from RSS item content HTML
 */
const extractTextFromContent = (content) => {
  if (!content) return null;
  let text = content
    .replace(/<img[^>]*>/gi, "")
    .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text || null;
};

/**
 * Extract provider/source name from RSS item
 */
const extractProviderName = (item) => {
  if (item.source && typeof item.source === "object" && item.source._) {
    return item.source._;
  }
  if (item.source && typeof item.source === "string") {
    return item.source;
  }
  if (item.title) {
    const parts = item.title.split(" - ");
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
  }
  return "Google News";
};

/**
 * Generate a provider logo URL using Google's favicon service
 */
const getProviderLogo = (link) => {
  try {
    const url = new URL(link);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
  } catch {
    return `https://www.google.com/s2/favicons?domain=news.google.com&sz=64`;
  }
};

/**
/**
 * Get clean title (remove source suffix that Google adds)
 */
const getCleanTitle = (title) => {
  if (!title) return "";
  const parts = title.split(" - ");
  if (parts.length > 1) {
    parts.pop();
    return parts.join(" - ").trim();
  }
  return title.trim();
};

/**
 * Convert relative time string from RSS pubDate
 */
const getRelativeTime = (pubDate) => {
  if (!pubDate) return "Recently";
  const now = new Date();
  const published = new Date(pubDate);
  const diffMs = now - published;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return published.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

    console.log(`Fetching RSS feed: ${rssUrl}`);

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

    const articles = feed.items
      .map((item) => {
        const providerName = extractProviderName(item);
        const articleLink = item.link || "";
        const imgURL = extractImageFromContent(item.content || item["content:encoded"] || "");
        const someText = extractTextFromContent(item.content || item["content:encoded"] || item.contentSnippet || "");

        return {
          title: getCleanTitle(item.title),
          someText: someText || item.contentSnippet || "Read more...",
          link: articleLink,
          imgURL: imgURL || `https://placehold.co/300x200?text=${encodeURIComponent(providerName)}`,
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

    console.log(`Found ${articles.length} articles via RSS for "${query}"`);
    return articles;
  } catch (error) {
    console.error("Error fetching RSS feed:", error.message);
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
    const snapshot = await mutesCol.where('user', '==', req.user.id).limit(1).get();

    if (!snapshot.empty) {
      const mutedSitesArray = snapshot.docs[0].data().mutedURL;
      if (mutedSitesArray) {
        mutedSiteString = mutedSitesArray
          .map((url) => `-site:${url}`)
          .join(" ");
      }
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

  // Save news providers to database (efficient batch upsert)
  batchSaveProviders(articles).catch((err) =>
    console.error("Error batch saving providers:", err.message)
  );

  res.status(202).json({ success: true, articles: articles });
};

export { scrapSearch, Scrap };
