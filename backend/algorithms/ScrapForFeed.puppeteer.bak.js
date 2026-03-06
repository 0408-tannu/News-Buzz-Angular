// // const { Cluster } = require("puppeteer-cluster");
// // const randomUseragent = require("random-useragent"); // Added random-useragent
// // const fs = require('fs');
// // const path = require('path');
// // const os = require('os');

// import { Cluster } from "puppeteer-cluster";
// // import randomUseragent from "random-useragent"; // Added random-useragent
// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium";

// const scanForLinks = async (page) => {

//   const element = await page.$('div.SoaBEf');
//   if (!element) {
//     return [];
//   }

//   await page.waitForSelector('div.SoaBEf div.SoAPf div.MgUUmf.NUnG9d');

//   const articles = await page.$$eval('div.SoaBEf', articles => {
//     return articles.map(article => {
//       const titleElement = article.querySelector('div.SoAPf div.n0jPhd.ynAwRc.MBeuO.nDgy9d');
//       const linkElement = article.querySelector('a.WlydOe');
//       const imgURLElement = article.querySelector('div.gpjNTe div.YEMaTe.JFSfwc div.uhHOwf.BYbUcd img'); // Update with the correct selector
//       const timeElement = article.querySelector('div.SoAPf div.OSrXXb.rbYSKb.LfVVr');
//       const providerImgElement = article.querySelector('div.SoAPf div.MgUUmf.NUnG9d g-img.QyR1Ze.ZGomKf img'); // Update with the correct selector
//       // const providerImgElement2 = article.querySelector('div.MCAGUe div.oovtQ img.qEdqNd.y3G2Ed'); // Update with the correct selector
//       const providerNameElement = article.querySelector('div.SoAPf div.MgUUmf.NUnG9d span'); // Update with the correct selector
//       const someTextElement = article.querySelector('div.SoAPf div.GI74Re.nDgy9d');

//       const articleData = {
//         title: titleElement ? titleElement.textContent.trim() : null,
//         someText: someTextElement ? someTextElement.textContent : null,
//         link: linkElement ? linkElement.getAttribute('href') : null,
//         imgURL: imgURLElement ? imgURLElement.getAttribute('src') : null,
//         time: timeElement ? timeElement.textContent : null,
//         providerImg: providerImgElement ? providerImgElement.getAttribute('src') : null,
//         providerName: providerNameElement ? providerNameElement.textContent : null
//       };

//       return (articleData && articleData.title && articleData.someText && articleData.link && articleData.time && articleData.providerImg && articleData.providerName) ? articleData : null;

//     });
//   });

//   return articles.filter(article => article !== null);
// };

// const ScrapForFeed = async (SearchTexts) => {

//   // SearchTexts is array of only one element.

//   if (SearchTexts.length === 0) {
//     SearchTexts[0] = "news";
//   }

//   try {
//     const puppeteerOptions = {
//       args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
//       // defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath() || puppeteer.executablePath(),
//       // headless: chromium.headless,
//       ignoreDefaultArgs: chromium.ignoreDefaultArgs,
//     };

//     const cluster = await Cluster.launch({
//       concurrency: Cluster.CONCURRENCY_PAGE,
//       maxConcurrency: 5,
//       puppeteerOptions: puppeteerOptions,
//     });

//     cluster.on("taskerror", (err, data) => {
//       console.log(`Error crawling ${data}: ${err.message}`);
//     });

//     let allArticles = [];  // Array to hold all articles

//     await cluster.task(async ({ page, data: url }) => {

//       // console.log(url);

//       // await page.setUserAgent(
//       //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36"
//       // ); // working

//       // await page.setUserAgent(
//       //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0"
//       // );

//       // await page.setUserAgent(
//       //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
//       // );
//       // await page.setUserAgent(
//       //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.864.48 Safari/537.36 Edg/91.0.864.48"
//       // );

//       // const userAgent = randomUseragent.getRandom(); // Get a random user agent
//       // await page.setUserAgent(userAgent); // Set the random user agent
//       await page.goto(url, { waitUntil: "networkidle2" });
//       const articles = await scanForLinks(page);
//       console.log(url, articles.length);

//       allArticles = [...allArticles, ...articles];  // Collect articles from each page

//     });

//     console.log(`Starting search for ${SearchTexts}`);
//     // const searchURL = `https://www.google.com/search?q=${searchText}+site%3A${site}&tbm=nws&tbs=${tbs}&start=`;
//     const searchURL = `https://www.google.com/search?q=`;

//     console.log(SearchTexts);

//     for (let i = 0; i < SearchTexts.length; i++) {
//       await cluster.queue(`${searchURL}${SearchTexts[i]}&tbm=nws`);
//     }

//     await cluster.idle();
//     await cluster.close();

//     console.log(allArticles.length);

//     return allArticles;  // Return the collected articles
//   } catch (error) {
//     console.error("An error occurred while Scraping search data:", error);
//     return [];
//   }
// };

// export { ScrapForFeed };
// // module.exports = { ScrapForFeed };

// const { Cluster } = require("puppeteer-cluster");
// const randomUseragent = require("random-useragent"); // Added random-useragent
// const fs = require('fs');
// const path = require('path');
// const os = require('os');

import { Cluster } from "puppeteer-cluster";
import randomUseragent from "random-useragent"; // Added random-useragent
import fs from "fs";
import path from "path";
import os from "os";

const findChromeUserDataDir = () => {
  let possiblePaths = [];

  if (process.platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA;
    const appData = process.env.APPDATA;
    const username = process.env.USERNAME || os.userInfo().username;

    if (localAppData) {
      possiblePaths.push(
        path.join(localAppData, "Google", "Chrome", "User Data"),
      );
    }
    if (appData) {
      possiblePaths.push(path.join(appData, "Google", "Chrome", "User Data"));
    }
    possiblePaths.push(
      path.join(
        "C:",
        "Users",
        username,
        "AppData",
        "Local",
        "Google",
        "Chrome",
        "User Data",
      ),
    );
  } else if (process.platform === "darwin") {
    possiblePaths.push(
      path.join(
        os.homedir(),
        "Library",
        "Application Support",
        "Google",
        "Chrome",
      ),
    );
  } else {
    possiblePaths.push(path.join(os.homedir(), ".config", "google-chrome"));
  }

  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  console.log("Could not find Chrome user data directory");
  return null;
};

const scanForLinks = async (page, count) => {
  // Debug: log the page content to see what we're working with
  const pageContent = await page.content();
  console.log("Page contains SoaBEf:", pageContent.includes("SoaBEf"));
  console.log("Page contains WlydOe:", pageContent.includes("WlydOe"));

  // Check for captcha or unusual traffic message
  if (
    pageContent.includes("unusual traffic") ||
    pageContent.includes("captcha")
  ) {
    console.log("Google detected automated traffic - captcha present");
    return [];
  }

  // Try multiple possible container selectors
  let element = await page.$("div.SoaBEf");
  if (!element) {
    element = await page.$("div.xuvV6b");
  }
  if (!element) {
    element = await page.$("div[data-hveid]");
  }

  if (!element) {
    console.log("No search results found - trying to get page HTML structure");
    // Log first 2000 chars to debug
    console.log(pageContent.substring(0, 2000));
    return [];
  }

  // Wait for content to load
  try {
    await page.waitForSelector("div.SoaBEf, div.xuvV6b", { timeout: 10000 });
  } catch (e) {
    console.log("Timeout waiting for results selector");
  }

  // Give extra time for dynamic content
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const articles = await page.$$eval("div.SoaBEf, div.xuvV6b", (articles) => {
    return articles.map((article) => {
      // Title element - try multiple selectors
      const titleElement =
        article.querySelector("div.n0jPhd.ynAwRc.MBeuO.nDgy9d") ||
        article.querySelector("div.n0jPhd") ||
        article.querySelector("[role='heading']") ||
        article.querySelector("h3") ||
        article.querySelector("a.WlydOe");

      // Link element
      const linkElement =
        article.querySelector("a.WlydOe") ||
        article.querySelector("a[href*='http']");

      // Main image - updated selector
      const imgURLElement =
        article.querySelector("div.uhHOwf.BYbUcd img") ||
        article.querySelector("div.gpjNTe img") ||
        article.querySelector("g-img img") ||
        article.querySelector("img[src*='http']");

      // Time element - try multiple selectors
      const timeElement =
        article.querySelector("div.OSrXXb.rbYSKb.LfVVr span") ||
        article.querySelector("div.OSrXXb.rbYSKb.LfVVr") ||
        article.querySelector("span.WG9SHc") ||
        article.querySelector("time") ||
        article.querySelector("[datetime]");

      // Provider image - updated selector
      const providerImgElement =
        article.querySelector("div.QyR1Ze img") ||
        article.querySelector("div.MgUUmf.NUnG9d img") ||
        article.querySelector("g-img.QyR1Ze img") ||
        article.querySelector(".CEMjEf img");

      // Provider name - try multiple selectors
      const providerNameElement =
        article.querySelector("div.MgUUmf.NUnG9d span") ||
        article.querySelector(".CEMjEf span") ||
        article.querySelector("span.CEMjEf") ||
        article.querySelector(".NUnG9d span");

      // Description/someText - try multiple selectors
      const someTextElement =
        article.querySelector("div.UqSP2b.nDgy9d") ||
        article.querySelector("div.GI74Re.nDgy9d") ||
        article.querySelector(".GI74Re") ||
        article.querySelector(".UqSP2b");

      const articleData = {
        title: titleElement ? titleElement.textContent.trim() : null,
        someText: someTextElement ? someTextElement.textContent : null,
        link: linkElement ? linkElement.getAttribute("href") : null,
        imgURL: imgURLElement ? imgURLElement.getAttribute("src") : null,
        time: timeElement
          ? timeElement.textContent || timeElement.getAttribute("datetime")
          : null,
        providerImg: providerImgElement
          ? providerImgElement.getAttribute("src")
          : null,
        providerName: providerNameElement
          ? providerNameElement.textContent
          : null,
      };

      // Return article if it has essential fields (title, link, time)
      return articleData.title && articleData.link && articleData.time
        ? articleData
        : null;
    });
  });

  const filteredArticles = articles.filter((article) => article !== null);
  console.log(
    "Found",
    filteredArticles.length,
    "articles before filtering by count",
  );
  return filteredArticles.slice(0, count);
};

const ScrapForFeed = async (SearchTexts) => {
  const userDataDir = findChromeUserDataDir();
  if (!userDataDir) {
    console.error(
      "Unable to find Chrome user data directory. Please specify it manually.",
    );
    return [];
  }

  try {
    const puppeteerOptions = {
      headless: false, // Use visible mode to avoid Google blocking
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--window-size=1920,1080",
      ],
      defaultViewport: { width: 1920, height: 1080 },
    };
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 1,
      puppeteerOptions: puppeteerOptions,
    });

    cluster.on("taskerror", (err, data) => {
      console.log(`Error crawling ${data}: ${err.message}`);
    });

    let allArticles = []; // Array to hold all articles

    let articleCount = 10; // means 10 10 9 9 8 8 7 7.  total 68 articles
    let flag = 0;

    await cluster.task(async ({ page, data: url }) => {
      console.log("url -->  ", url);

      // Set a realistic user agent
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      );

      // Set extra headers to look more like a real browser
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      });

      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      // Wait longer for dynamic content to load
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Check for and handle Google consent page if present
      try {
        const consentButton = await page.$('button[aria-label="Accept all"]');
        if (consentButton) {
          console.log("Found consent button, clicking...");
          await consentButton.click();
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        // Also check for other consent button variants
        const rejectButton = await page.$('button[aria-label="Reject all"]');
        const acceptButton = await page.$("#L2AGLb"); // Another common consent button ID
        if (acceptButton) {
          console.log("Found accept button by ID, clicking...");
          await acceptButton.click();
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      } catch (e) {
        console.log("No consent dialog found or error handling it");
      }

      // Scroll down to trigger lazy loading
      await page.evaluate(() => {
        window.scrollBy(0, 500);
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const articles = await scanForLinks(page, articleCount);
      console.log(url, articles.length);

      allArticles = [...allArticles, ...articles]; // Collect articles from each page

      if (flag === 0) {
        articleCount = Math.max(articleCount, 1); // Decrease the count but ensure it doesn't go below 1
        flag = 1;
      } else {
        articleCount = Math.max(articleCount - 1, 1); // Decrease the count but ensure it doesn't go below 1
        flag = 0;
      }
    });

    console.log(`Starting search for ${SearchTexts}`);
    // const searchURL = `https://www.google.com/search?q=${searchText}+site%3A${site}&tbm=nws&tbs=${tbs}&start=`;
    const searchURL = `https://www.google.com/search?q=`;

    console.log(SearchTexts);

    for (let i = 0; i < SearchTexts.length; i++) {
      await cluster.queue(`${searchURL}${SearchTexts[i]}&tbm=nws`);
    }

    await cluster.idle();
    await cluster.close();

    console.log(allArticles.length);

    return allArticles; // Return the collected articles
  } catch (error) {
    console.error("An error occurred while Scraping search data:", error);
    return [];
  }
};

export { ScrapForFeed };
// module.exports = { ScrapForFeed };
