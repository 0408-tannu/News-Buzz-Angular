// Google News RSS Feed - replaces Puppeteer scraping for top stories
// Uses shared rssUtils for image fetching and provider logos

import {
  createParser,
  extractProviderName,
  getCleanTitle,
  getProviderLogo,
  getRelativeTime,
} from "./rssUtils.js";
import { db } from "../config/firebase.js";
import { batchSaveProviders } from "../utils/providerCache.js";

const topStoriesCol = db.collection('topStories');

const parser = createParser();

/**
 * Fetch top stories from Google News RSS
 */
const Scrap = async (searchby) => {
  try {
    const country = searchby.country || "IN";

    // Google News Top Stories RSS feed
    const rssUrl = `https://news.google.com/rss?hl=en-${country}&gl=${country}&ceid=${country}:en`;

    console.log(`[Top Stories RSS] Fetching for ${country}: ${rssUrl}`);

    const feed = await parser.parseURL(rssUrl);

    let articles = feed.items
      .map((item) => {
        const providerName = extractProviderName(item);

        return {
          title: getCleanTitle(item.title),
          link: item.link || "",
          time: getRelativeTime(item.pubDate),
          providerImg: getProviderLogo(providerName, item.link),
          providerName: providerName,
        };
      })
      .filter(
        (article) =>
          article.title && article.link && article.time && article.providerImg,
      );

    console.log(`[Top Stories RSS] Found ${articles.length} top stories`);
    return articles;
  } catch (err) {
    console.error("[Top Stories RSS] Error:", err.message);
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
      // Delete all existing top stories
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

      for (const article of articles) {
        if (article) {
          await topStoriesCol.add({
            title: article.title,
            link: article.link,
            time: article.time,
            imgURL: article.imgURL || "",
            providerImg: article.providerImg || "",
            providerName: article.providerName || "",
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
