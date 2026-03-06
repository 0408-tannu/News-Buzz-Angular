// Shared RSS utility functions for Google News feed parsing
// Used by ScrapForFeed.js, search.js, and top_stories.js

import Parser from "rss-parser";

/**
 * Create a configured RSS parser with Google News custom fields
 */
const createParser = () => {
  return new Parser({
    customFields: {
      item: [["source", "rssSource"]],
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    timeout: 15000,
  });
};

/**
 * Fetch og:image and actual article URL from a Google News article page.
 * Google News article pages contain og:image meta tags.
 */
const fetchArticleMeta = async (googleNewsUrl) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(googleNewsUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    clearTimeout(timeout);

    const html = await response.text();

    // Extract og:image
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    );
    const ogImage = ogImageMatch
      ? ogImageMatch[1]
      : (() => {
          // Try reverse attribute order
          const alt = html.match(
            /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
          );
          return alt ? alt[1] : null;
        })();

    return { imgURL: ogImage };
  } catch (err) {
    return { imgURL: null };
  }
};

/**
 * Fetch og:image for multiple articles in parallel (with concurrency limit)
 */
const fetchArticleImages = async (articles, concurrency = 5) => {
  const results = [...articles];
  
  // Process in batches to avoid too many concurrent requests
  for (let i = 0; i < results.length; i += concurrency) {
    const batch = results.slice(i, i + concurrency);
    const metaPromises = batch.map((article) =>
      fetchArticleMeta(article.link),
    );
    const metas = await Promise.all(metaPromises);

    for (let j = 0; j < batch.length; j++) {
      if (metas[j].imgURL) {
        results[i + j].imgURL = metas[j].imgURL;
      }
    }
  }

  return results;
};

/**
 * Extract provider/source name from RSS item
 */
const extractProviderName = (item) => {
  // Check rssSource (custom field)
  if (item.rssSource && typeof item.rssSource === "string") {
    return item.rssSource;
  }
  if (
    item.rssSource &&
    typeof item.rssSource === "object" &&
    item.rssSource._
  ) {
    return item.rssSource._;
  }
  // Fallback: extract from title (Google News format: "Title - Source")
  if (item.title) {
    const parts = item.title.split(" - ");
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
  }
  return "Google News";
};

/**
 * Get clean title (remove source suffix that Google News appends)
 */
const getCleanTitle = (title) => {
  if (!title) return "";
  const parts = title.split(" - ");
  if (parts.length > 1) {
    parts.pop(); // Remove the source name at the end
    return parts.join(" - ").trim();
  }
  return title.trim();
};

/**
 * Extract description text from RSS item content HTML
 */
const extractTextFromContent = (content) => {
  if (!content) return null;
  return (
    content
      .replace(/<img[^>]*>/gi, "")
      .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim() || null
  );
};

/**
 * Generate a provider logo URL using Google's favicon service.
 * For Google News redirect URLs, uses the provider name to generate a useful favicon.
 */
const getProviderLogo = (providerName) => {
  // Map of common news providers to their domains for accurate favicons
  const providerDomains = {
    "the times of india": "timesofindia.indiatimes.com",
    "times of india": "timesofindia.indiatimes.com",
    "ndtv": "ndtv.com",
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
    "cnbc": "cnbc.com",
    "the wall street journal": "wsj.com",
    "wall street journal": "wsj.com",
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
    "aaj tak": "aajtak.in",
    "republic world": "republicworld.com",
    "the print": "theprint.in",
    "the wire": "thewire.in",
    "scroll": "scroll.in",
    "scroll.in": "scroll.in",
    "moneycontrol": "moneycontrol.com",
    "outlook india": "outlookindia.com",
    "deccan herald": "deccanherald.com",
    "the quint": "thequint.com",
    "the telegraph": "telegraphindia.com",
    "espn": "espn.com",
    "espncricinfo": "espncricinfo.com",
    "cricbuzz": "cricbuzz.com",
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
  };

  const domain =
    providerDomains[providerName.toLowerCase()] ||
    providerName
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9.]/g, "") + ".com";

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
};

/**
 * Convert pubDate to relative time string
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
 * Default placeholder image
 */
const getPlaceholderImage = (text) => {
  return `https://placehold.co/300x200/e2e8f0/64748b?text=${encodeURIComponent(text || "News")}`;
};

export {
  createParser,
  fetchArticleMeta,
  fetchArticleImages,
  extractProviderName,
  getCleanTitle,
  extractTextFromContent,
  getProviderLogo,
  getRelativeTime,
  getPlaceholderImage,
};
