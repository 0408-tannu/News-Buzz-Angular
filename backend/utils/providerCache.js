/**
 * In-memory provider cache for efficient auto-adding of news providers.
 * Avoids per-article DB lookups by keeping known baseURLs in a Set.
 * New providers are batched and bulk-upserted.
 */

import { newsProvidermodel } from "../models/mnewsProvider.js";
import { getProviderLogo } from "../algorithms/rssUtils.js";

// In-memory Set of known provider baseURLs
let knownProviders = new Set();
let cacheLoaded = false;

/**
 * Load all existing provider baseURLs into memory (call once on server start)
 */
const loadProviderCache = async () => {
  try {
    const providers = await newsProvidermodel.find({}, { baseURL: 1, _id: 0 });
    knownProviders = new Set(providers.map((p) => p.baseURL));
    cacheLoaded = true;
    console.log(`[ProviderCache] Loaded ${knownProviders.size} providers into cache`);
  } catch (err) {
    console.error("[ProviderCache] Error loading cache:", err.message);
  }
};

/**
 * Extract base URL from article link
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
 * Batch save new providers from an array of articles.
 * Only does DB writes for truly new providers (not in cache).
 * Uses bulkWrite for a single DB call instead of N individual calls.
 */
const batchSaveProviders = async (articles) => {
  if (!cacheLoaded) await loadProviderCache();

  // Collect unique new providers from this batch
  const newProviders = new Map(); // baseURL -> { name, baseURL, logo }

  for (const article of articles) {
    const baseURL = getProviderBaseURL(article.link);
    if (!baseURL || knownProviders.has(baseURL) || newProviders.has(baseURL)) {
      continue;
    }

    const providerName =
      article.providerName ||
      baseURL
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\.com$/, "")
        .replace(/\.in$/, "");

    newProviders.set(baseURL, {
      name: providerName,
      baseURL: baseURL,
      logo: article.providerImg || getProviderLogo(providerName, article.link),
    });
  }

  if (newProviders.size === 0) return;

  // Bulk upsert — single DB call for all new providers
  try {
    const ops = Array.from(newProviders.values()).map((provider) => ({
      updateOne: {
        filter: { baseURL: provider.baseURL },
        update: { $setOnInsert: provider },
        upsert: true,
      },
    }));

    const result = await newsProvidermodel.bulkWrite(ops, { ordered: false });
    
    // Update cache with newly inserted providers
    for (const baseURL of newProviders.keys()) {
      knownProviders.add(baseURL);
    }

    if (result.upsertedCount > 0) {
      console.log(`[ProviderCache] Added ${result.upsertedCount} new providers in 1 DB call`);
    }
  } catch (err) {
    console.error("[ProviderCache] Bulk save error:", err.message);
  }
};

/**
 * Update ALL existing providers' logos to use Google Favicon API (128px).
 * Skips user-created channels (those with Cloudinary URLs).
 * Returns count of updated providers.
 */
const refreshAllProviderLogos = async () => {
  try {
    const providers = await newsProvidermodel.find({});
    let updated = 0;

    const ops = providers
      .filter((p) => !p.logo.includes("cloudinary")) // Skip user-uploaded logos
      .map((provider) => {
        // Extract domain from baseURL for accurate favicon
        let domain = "";
        try {
          domain = new URL(provider.baseURL).hostname.replace(/^www\./, "");
        } catch {
          domain = provider.name.toLowerCase().replace(/\s+/g, "") + ".com";
        }

        const newLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        updated++;

        return {
          updateOne: {
            filter: { _id: provider._id },
            update: { $set: { logo: newLogo } },
          },
        };
      });

    if (ops.length > 0) {
      await newsProvidermodel.bulkWrite(ops, { ordered: false });
    }

    console.log(`[ProviderCache] Refreshed ${updated} provider logos`);
    return updated;
  } catch (err) {
    console.error("[ProviderCache] Error refreshing logos:", err.message);
    throw err;
  }
};

export {
  loadProviderCache,
  batchSaveProviders,
  getProviderBaseURL,
  refreshAllProviderLogos,
};
