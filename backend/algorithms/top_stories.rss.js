// Google News RSS Feed - replaces Puppeteer scraping for top stories
// Uses free Google News RSS feeds for reliable, fast news fetching

import Parser from "rss-parser";
import { db } from "../config/firebase.js";
import { batchSaveProviders } from "../utils/providerCache.js";

const topStoriesCol = db.collection('topStories');

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
 * Convert to relative time string
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
 * Fetch top stories from Google News RSS
 */
const Scrap = async (searchby) => {
  try {
    const country = searchby.country || "IN";

    // Google News Top Stories RSS feed
    const rssUrl = `https://news.google.com/rss?hl=en-${country}&gl=${country}&ceid=${country}:en`;

    console.log(`Fetching Top Stories RSS feed for ${country}: ${rssUrl}`);

    const feed = await parser.parseURL(rssUrl);

    const articles = feed.items.map((item) => {
      const providerName = extractProviderName(item);

      return {
        title: getCleanTitle(item.title),
        link: item.link || "",
        time: getRelativeTime(item.pubDate),
        providerImg: getProviderLogo(providerName, item.link),
        providerName: providerName,
      };
    }).filter(
      (article) =>
        article.title && article.link && article.time && article.providerImg,
    );

    console.log(`Found ${articles.length} top stories via RSS`);
    return articles;
  } catch (err) {
    console.error("RSS Scraping error:", err.message);
    return [];
  }
};

/**
 * Express route handler for top stories
 */
const ScrapTop_stories = async (req, res) => {
  const FETCH_INTERVAL = 1000 * 60 * 20; // 20 minutes

  let lastFetchTime = 0;
  const lastDocSnap = await topStoriesCol.orderBy('createdAt', 'desc').limit(1).get();
  if (!lastDocSnap.empty) {
    const createdAt = lastDocSnap.docs[0].data().createdAt;
    if (createdAt) {
      lastFetchTime = createdAt.toMillis ? createdAt.toMillis() : new Date(createdAt).getTime();
    }
  }

  const currentTime = new Date().getTime();

  const countSnap = await topStoriesCol.get();
  const Documentcount = countSnap.size;

  if (currentTime - lastFetchTime > FETCH_INTERVAL || Documentcount < 30) {
    console.log("Fetching new top stories via RSS...");
    const articles = await Scrap({
      country: "IN",
    });

    // If RSS feed returned no articles, try to return cached data
    if (!articles || articles.length === 0) {
      console.log("RSS returned no articles, checking cache...");
      const cachedSnap = await topStoriesCol.get();
      if (cachedSnap.size > 0) {
        const cached = cachedSnap.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
        return res
          .status(202)
          .json({ success: true, articles: cached, source: "cache" });
      }
      return res.status(210).json({
        success: false,
        articles: [],
        message: "Could not fetch articles and no cache available",
      });
    }

    try {
      const existingSnap = await topStoriesCol.get();
      const batch = db.batch();
      existingSnap.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    } catch (err) {
      return res.status(210).json({
        success: false,
        articles:
          "An error occurred while deleting the data from the database",
      });
    }

    try {
      console.log("Saving", articles.length, "articles to database...");

      // Save articles sequentially
      for (const article of articles) {
        if (article) {
          await topStoriesCol.add({
            title: article.title,
            link: article.link,
            time: article.time,
            providerImg: article.providerImg || "",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // Save news providers to database (efficient batch upsert)
      batchSaveProviders(articles).catch((err) =>
        console.error("Error batch saving providers:", err.message)
      );

      res.status(202).json({ success: true, articles: articles });
    } catch (err) {
      console.log(err);
      res.status(210).json({
        success: false,
        articles: "An error occurred while saving the data to the database",
      });
    }
  } else {
    try {
      const snapshot = await topStoriesCol.get();
      const top_stories = snapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
      res.status(202).json({ success: true, articles: top_stories });
    } catch (error) {
      res.status(210).json({ success: false, message: error });
    }
  }
};

export { ScrapTop_stories };
