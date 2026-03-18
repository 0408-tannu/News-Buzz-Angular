/**
 * In-memory provider cache for efficient auto-adding of news providers.
 * Avoids per-article DB lookups by keeping known baseURLs in a Set.
 * New providers are batched and bulk-written.
 */

import { db } from "../config/firebase.js";
import { getProviderLogo } from "../algorithms/rssUtils.js";

const newsProvidersCol = db.collection('newsProviders');

// In-memory Set of known provider baseURLs
let knownProviders = new Set();
let cacheLoaded = false;

// Same domain map used in rssUtils.getProviderLogo — keeps baseURLs consistent with logos
const providerDomains = {
  "the times of india": "timesofindia.indiatimes.com",
  "times of india": "timesofindia.indiatimes.com",
  "ndtv": "ndtv.com",
  "ndtv sports": "sports.ndtv.com",
  "the hindu": "thehindu.com",
  "hindustan times": "hindustantimes.com",
  "india today": "indiatoday.in",
  "the indian express": "indianexpress.com",
  "indian express": "indianexpress.com",
  "economic times": "economictimes.indiatimes.com",
  "the economic times": "economictimes.indiatimes.com",
  "bbc": "bbc.com",
  "bbc news": "bbc.com",
  "cnn": "cnn.com",
  "reuters": "reuters.com",
  "the guardian": "theguardian.com",
  "al jazeera": "aljazeera.com",
  "the washington post": "washingtonpost.com",
  "the new york times": "nytimes.com",
  "new york times": "nytimes.com",
  "bloomberg": "bloomberg.com",
  "bloomberg.com": "bloomberg.com",
  "cnbc": "cnbc.com",
  "cnbc tv18": "cnbctv18.com",
  "the wall street journal": "wsj.com",
  "wall street journal": "wsj.com",
  "wsj": "wsj.com",
  "forbes": "forbes.com",
  "business insider": "businessinsider.com",
  "techcrunch": "techcrunch.com",
  "the verge": "theverge.com",
  "wired": "wired.com",
  "ars technica": "arstechnica.com",
  "mashable": "mashable.com",
  "engadget": "engadget.com",
  "livemint": "livemint.com",
  "mint": "livemint.com",
  "firstpost": "firstpost.com",
  "news18": "news18.com",
  "zee news": "zeenews.india.com",
  "zee business": "zeebusiness.india.com",
  "aaj tak": "aajtak.in",
  "republic world": "republicworld.com",
  "the print": "theprint.in",
  "theprint": "theprint.in",
  "the wire": "thewire.in",
  "thewire.in": "thewire.in",
  "scroll": "scroll.in",
  "scroll.in": "scroll.in",
  "moneycontrol": "moneycontrol.com",
  "moneycontrol.com": "moneycontrol.com",
  "outlook india": "outlookindia.com",
  "deccan herald": "deccanherald.com",
  "deccan chronicle": "deccanchronicle.com",
  "the quint": "thequint.com",
  "the telegraph": "telegraphindia.com",
  "telegraph india": "telegraphindia.com",
  "espn": "espn.com",
  "espn.in": "espn.in",
  "espncricinfo": "espncricinfo.com",
  "cricbuzz": "cricbuzz.com",
  "cricbuzz.com": "cricbuzz.com",
  "sports ndtv": "sports.ndtv.com",
  "sky sports": "skysports.com",
  "associated press": "apnews.com",
  "ap news": "apnews.com",
  "afp": "afp.com",
  "yahoo news": "news.yahoo.com",
  "google news": "news.google.com",
  "the independent": "independent.co.uk",
  "daily mail": "dailymail.co.uk",
  "the telegraph uk": "telegraph.co.uk",
  "abc news": "abcnews.go.com",
  "fox news": "foxnews.com",
  "nbc news": "nbcnews.com",
  "usa today": "usatoday.com",
  "the atlantic": "theatlantic.com",
  "politico": "politico.com",
  "axios": "axios.com",
  "vice": "vice.com",
  "buzzfeed": "buzzfeed.com",
  "huffpost": "huffpost.com",
  "times now": "timesnownews.com",
  "business standard": "business-standard.com",
  "the financial express": "financialexpress.com",
  "down to earth": "downtoearth.org.in",
  "msn": "msn.com",
  "phys.org": "phys.org",
  "live science": "livescience.com",
  "sciencealert": "sciencealert.com",
  "sciencedaily": "sciencedaily.com",
  "nasa science (.gov)": "science.nasa.gov",
  "imdb": "imdb.com",
  "goal.com": "goal.com",
  "wion": "wionews.com",
  "investing.com india": "investing.com",
  "investing.com": "investing.com",
  "britannica": "britannica.com",
  "the new yorker": "newyorker.com",
  "vogue india": "vogue.in",
  "autocar india": "autocarindia.com",
  "carwale": "carwale.com",
  "the hans india": "thehansindia.com",
  "news on air": "newsonair.gov.in",
  "the korea times": "koreatimes.co.kr",
  "the times of israel": "timesofisrael.com",
  "mit technology review": "technologyreview.com",
  "nvidia newsroom": "nvidianews.nvidia.com",
  "apple": "apple.com",
  "ethrworld.com": "ethrworld.com",
  "sportstar": "sportstar.thehindu.com",
  "icc": "icc-cricket.com",
  "formula 1": "formula1.com",
};

/**
 * Resolve the actual website domain for a provider name.
 * Uses the hardcoded map first, then falls back to guessing.
 */
const resolveProviderDomain = (providerName) => {
  if (!providerName) return null;

  // Check hardcoded map
  const mapped = providerDomains[providerName.toLowerCase()];
  if (mapped) return mapped;

  // Fallback: clean the name and add .com
  return providerName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9.]/g, "") + ".com";
};

/**
 * Load all existing provider baseURLs into memory (call once on server start)
 */
const loadProviderCache = async () => {
  try {
    const snapshot = await newsProvidersCol.get();
    knownProviders = new Set(snapshot.docs.map((doc) => doc.data().baseURL));
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
 * Uses Firestore batch writes for a single DB call instead of N individual calls.
 */
const batchSaveProviders = async (articles) => {
  if (!cacheLoaded) await loadProviderCache();

  // Collect unique new providers from this batch
  const newProviders = new Map(); // baseURL -> { name, baseURL, logo }

  for (const article of articles) {
    // Get the real provider domain from the provider name
    let baseURL = getProviderBaseURL(article.link);
    const isGoogleRedirect = baseURL && baseURL.includes('news.google.com');

    if (isGoogleRedirect && article.providerName) {
      // Resolve the actual domain from provider name using our map
      const domain = resolveProviderDomain(article.providerName);
      if (domain) {
        baseURL = `https://${domain}`;
      }
    }

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

  // Check which providers already exist in Firestore, then add only new ones
  try {
    let upsertedCount = 0;
    const batch = db.batch();

    for (const [baseURL, provider] of newProviders) {
      // Check if provider already exists
      const existing = await newsProvidersCol.where('baseURL', '==', baseURL).limit(1).get();
      if (existing.empty) {
        const newDocRef = newsProvidersCol.doc();
        batch.set(newDocRef, {
          ...provider,
          followers: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        upsertedCount++;
      }
      // Update cache regardless
      knownProviders.add(baseURL);
    }

    if (upsertedCount > 0) {
      await batch.commit();
      console.log(`[ProviderCache] Added ${upsertedCount} new providers in 1 batch write`);
    }
  } catch (err) {
    console.error("[ProviderCache] Bulk save error:", err.message);
  }
};

export {
  loadProviderCache,
  batchSaveProviders,
  getProviderBaseURL,
};
