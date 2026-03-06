// Google News RSS Feed - replaces Puppeteer scraping for Feed
// Uses shared rssUtils for image fetching and provider logos

import {
  createParser,
  extractProviderName,
  getCleanTitle,
  extractTextFromContent,
  getProviderLogo,
  getRelativeTime,
} from "./rssUtils.js";

const parser = createParser();

/**
 * Fetch news articles from Google News RSS feed for given search terms.
 * Replaces the old Puppeteer-based ScrapForFeed.
 */
const ScrapForFeed = async (SearchTexts) => {
  if (!SearchTexts || SearchTexts.length === 0) {
    SearchTexts = ["news"];
  }

  let allArticles = [];

  for (const searchText of SearchTexts) {
    if (!searchText) continue;

    try {
      const encodedQuery = encodeURIComponent(searchText);
      const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-IN&gl=IN&ceid=IN:en`;

      console.log(`[Feed RSS] Fetching: ${searchText}`);

      const feed = await parser.parseURL(rssUrl);

      const articles = feed.items
        .map((item) => {
          const providerName = extractProviderName(item);
          const someText = extractTextFromContent(
            item.content || item.contentSnippet || "",
          );

          return {
            title: getCleanTitle(item.title),
            someText: someText || item.contentSnippet || "Read more...",
            link: item.link || "",
            imgURL: null,
            time: getRelativeTime(item.pubDate),
            providerImg: getProviderLogo(providerName, item.link),
            providerName: providerName,
          };
        })
        .filter(
          (article) =>
            article.title &&
            article.link &&
            article.time &&
            article.providerName,
        );

      console.log(
        `[Feed RSS] Found ${articles.length} articles for "${searchText}"`,
      );
      allArticles = [...allArticles, ...articles];
    } catch (error) {
      console.error(
        `[Feed RSS] Error for "${searchText}":`,
        error.message,
      );
    }
  }

  console.log(`[Feed RSS] Total articles: ${allArticles.length}`);
  return allArticles;
};

export { ScrapForFeed };
