// // // import puppeteer from "puppeteer";
// // import puppeteer from "puppeteer-core";
// // import chromium from "@sparticuz/chromium";
// // // import randomUseragent from "random-useragent";
// // import { top_stories_model } from "../models/mtopStories.js";
// // import { newsProvidermodel } from "../models/mnewsProvider.js";

// // // const puppeteer = require("puppeteer");
// // // const randomUseragent = require("random-useragent"); // Added random-useragent
// // // const top_stories_model = require("../models/mtopStories");
// // // const newsProvidermodel = require("../models/mnewsProvider.js");

// // // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // const scanForLinks = async (page) => {

// // 	await page.waitForSelector('article');

// // 	const articles = await page.$$eval('article.UwIKyb', articles => {
// // 		return articles.map(article => {
// // 			const linkElement = article.querySelector('a.gPFEn');
// // 			const timeElement = article.querySelector('div.UOVeFe time.hvbAAd');
// // 			const providerImgElement1 = article.querySelector('div.MCAGUe img.msvBD.zC7z7b'); // Update with the correct selector
// // 			const providerImgElement2 = article.querySelector('div.MCAGUe div.oovtQ img.qEdqNd.y3G2Ed'); // Update with the correct selector

// // 			const articleData = {
// // 				title: linkElement ? linkElement.textContent.trim() : null,
// // 				link: linkElement ? `https://news.google.com${linkElement.getAttribute('href')}` : null,
// // 				time: timeElement ? timeElement.textContent : null,
// // 				providerImg: providerImgElement1 ? providerImgElement1.getAttribute('src') : providerImgElement2 ? providerImgElement2.getAttribute('src') : null
// // 			};

// // 			// Only return the article if none of the fields are null
// // 			return (articleData.title && articleData.link && articleData.time && articleData.providerImg) ? articleData : null;

// // 		});
// // 	});

// // 	// delay(10000);

// // 	return articles.filter(article => article !== null);

// // };

// // const Scrap = async (searchby) => {

// // 	try {
// // 		let country = searchby.country;
// // 		const puppeteerOptions = {
// // 			args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars'],
// // 			defaultViewport: chromium.defaultViewport,
// // 			executablePath: await chromium.executablePath() || puppeteer.executablePath(),
// // 			headless: chromium.headless,
// // 			ignoreDefaultArgs: chromium.ignoreDefaultArgs,
// // 		};

// // 		const browser = await puppeteer.launch(puppeteerOptions);
// // 		const page = await browser.newPage();

// // 		// const userAgent = randomUseragent.getRandom(); // Get a random user agent
// // 		// await page.setUserAgent(userAgent); // Set the random user agent

// // 		console.log(`Starting to search for Top stories in ${country}`);

// // 		const url = `https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-${country}&gl=${country}&ceid=${country}%3Aen`;
// // 		// const url = `https://www.google.com/search?q=dhoni&tbm=nws`;
// // 		console.log(url);
// // 		await page.goto(url, { waitUntil: "networkidle2" });
// // 		// await page.waitForTimeout(2000);

// // 		// delay(30000);

// // 		const articles = await scanForLinks(page);
// // 		console.log(articles.length);

// // 		await browser.close();
// // 		setTimeout(() => {
// // 		}, 0);

// // 		return articles;
// // 	}
// // 	catch (err) {
// // 		return "An error occurred while Scraping top stories data.";
// // 	}
// // };

// // const ScrapTop_stories = async (req, res) => {

// // 	const FETCH_INTERVAL = 1000 * 600000000;  // 600000 seconds

// // 	let lastFetchTime = null;
// // 	lastFetchTime = await top_stories_model.findOne({}, { createdAt: 1 });
// // 	if (!lastFetchTime)
// // 		lastFetchTime = 0;
// // 	else
// // 		lastFetchTime = lastFetchTime.createdAt.getTime();

// // 	const currentTime = new Date().getTime();

// // 	const Documentcount = await top_stories_model.find({}).countDocuments();  // this is because if user close the browser at the time of web scraping then we have to fetch the data again

// // 	if (currentTime - lastFetchTime > FETCH_INTERVAL || Documentcount < 30) {

// // 		console.log("scrapping");
// // 		let articles = [];
// // 		articles = await Scrap({
// // 			country: "IN",
// // 		});

// // 		try {
// // 			await top_stories_model.deleteMany({});
// // 		} catch (err) {
// // 			res.status(210).json({ success: false, articles: "An error occurred while deleting the data from the database " });
// // 		}

// // 		try {
// // 			console.log(articles);

// // 			articles?.forEach(async (article) => {

// // 				if (article) {
// // 					const newArticle = new top_stories_model({
// // 						title: article.title,
// // 						link: article.link,
// // 						time: article.time,
// // 						providerImg: article.providerImg,
// // 					});
// // 					await newArticle.save();
// // 				}
// // 			});

// // 			// await newsProvidermodel.deleteMany({});

// // 			articles?.forEach(async (article) => {
// // 				const url = new URL(article.providerImg);
// // 				const params = new URLSearchParams(url.search);
// // 				const baseUrl = params.get('url');
// // 				const finalURL = baseUrl ? new URL(baseUrl).origin : null;

// // 				let providerName = finalURL.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\.com$/, "").replace(/\.in$/, "");

// // 				if (providerName.includes('.')) {
// // 					providerName = providerName.replace(/\./g, '-');
// // 				}

// // 				try {
// // 					const provider = await newsProvidermodel.findOne({ baseURL: finalURL });
// // 					// console.log(finalURL, provider);

// // 					if (!provider) {
// // 						await newsProvidermodel.create({ name: providerName, baseURL: finalURL, logo: article.providerImg });
// // 					}
// // 				} catch (err) {
// // 					console.log(err);
// // 				}

// // 			});

// // 			res.status(202).json({ success: true, articles: articles });
// // 		}
// // 		catch (err) {
// // 			console.log(err);
// // 			res.status(210).json({ success: false, articles: "An error occurred while saving the data to the database " });

// // 		}

// // 	}
// // 	else {
// // 		try {
// // 			const top_stories = await top_stories_model.find();

// // 			res.status(202).json({ success: true, articles: top_stories });
// // 		} catch (error) {
// // 			res.status(210).json({ success: false, message: error });
// // 		}
// // 	}

// // };

// // export { ScrapTop_stories };

// import randomUseragent from "random-useragent";
// import top_stories_model from "../models/mtopStories.js";
// import newsProvidermodel from "../models/mnewsProvider.js";
// import puppeteer from "puppeteer";

// // const puppeteer = require("puppeteer");
// // const randomUseragent = require("random-useragent"); // Added random-useragent
// // const top_stories_model = require("../models/mtopStories");
// // const newsProvidermodel = require("../models/mnewsProvider.js");

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// // const findChromeUserDataDir = () => {
// // 	let possiblePaths = [];

// // 	if (process.platform === 'win32') {
// // 		const localAppData = process.env.LOCALAPPDATA;
// // 		const appData = process.env.APPDATA;
// // 		const username = process.env.USERNAME || os.userInfo().username;

// // 		if (localAppData) {
// // 			possiblePaths.push(path.join(localAppData, 'Google', 'Chrome', 'User Data'));
// // 		}
// // 		if (appData) {
// // 			possiblePaths.push(path.join(appData, 'Google', 'Chrome', 'User Data'));
// // 		}
// // 		possiblePaths.push(path.join('C:', 'Users', username, 'AppData', 'Local', 'Google', 'Chrome', 'User Data'));
// // 	} else if (process.platform === 'darwin') {
// // 		possiblePaths.push(path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome'));
// // 	} else {
// // 		possiblePaths.push(path.join(os.homedir(), '.config', 'google-chrome'));
// // 	}

// // 	for (const dir of possiblePaths) {
// // 		if (fs.existsSync(dir)) {
// // 			return dir;
// // 		}
// // 	}

// // 	console.log('Could not find Chrome user data directory');
// // 	return null;
// // };

// const scanForLinks = async (page) => {

// 	await page.waitForSelector('article');

// 	const articles = await page.$$eval('article.UwIKyb', articles => {
// 		return articles.map(article => {
// 			const linkElement = article.querySelector('a.gPFEn');
// 			const timeElement = article.querySelector('div.UOVeFe time.hvbAAd');
// 			const providerImgElement1 = article.querySelector('div.MCAGUe img.msvBD.zC7z7b'); // Update with the correct selector
// 			const providerImgElement2 = article.querySelector('div.MCAGUe div.oovtQ img.qEdqNd.y3G2Ed'); // Update with the correct selector

// 			const articleData = {
// 				title: linkElement ? linkElement.textContent.trim() : null,
// 				link: linkElement ? `https://news.google.com${linkElement.getAttribute('href')}` : null,
// 				time: timeElement ? timeElement.textContent : null,
// 				providerImg: providerImgElement1 ? providerImgElement1.getAttribute('src') : providerImgElement2 ? providerImgElement2.getAttribute('src') : null
// 			};

// 			// Only return the article if none of the fields are null
// 			return (articleData.title && articleData.link && articleData.time && articleData.providerImg) ? articleData : null;

// 		});
// 	});

// 	// delay(10000);

// 	return articles.filter(article => article !== null);

// };

// const Scrap = async (searchby) => {
// 	try {
// 		let country = searchby.country;
// 		let puppeteerOptions = {};

// 		if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
// 			puppeteerOptions = {
// 				args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
// 				defaultViewport: chrome.defaultViewport,
// 				executablePath: await chrome.executablePath,
// 				headless: true,
// 				ignoreHTTPSErrors: true,
// 			};
// 		}
// 		else {
// 			puppeteerOptions = {
// 				headless: false,
// 				args: [
// 					"--no-sandbox",
// 					"--disable-setuid-sandbox",
// 					// `--user-data-dir=${userDataDir}`,
// 					// "--enable-automation"  // This flag might be necessary for some extensions
// 				],
// 				// ignoreDefaultArgs: ["--enable-automation"],  // This prevents Puppeteer from using a temporary profile
// 				// executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
// 				defaultViewport: false,
// 			}

// 		}
// 		const browser = await puppeteer.launch(puppeteerOptions);
// 		const page = await browser.newPage();

// 		const userAgent = randomUseragent.getRandom(); // Get a random user agent
// 		await page.setUserAgent(userAgent); // Set the random user agent

// 		console.log(`Starting to search for Top stories in ${country}`);

// 		const url = `https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-${country}&gl=${country}&ceid=${country}%3Aen`;
// 		await page.goto(url, { waitUntil: "networkidle2" });
// 		// await page.waitForTimeout(2000);

// 		// delay(30000);

// 		const articles = await scanForLinks(page);
// 		console.log(articles.length);

// 		await browser.close();
// 		setTimeout(() => {
// 		}, 0);

// 		return articles;
// 	}
// 	catch (err) {
// 		return "An error occurred while Scraping top stories data.";
// 	}
// };

// const ScrapTop_stories = async (req, res) => {

// 	const FETCH_INTERVAL = 1000 * 600000000;  // 600000 seconds

// 	let lastFetchTime = null;
// 	lastFetchTime = await top_stories_model.findOne({}, { createdAt: 1 });
// 	if (!lastFetchTime)
// 		lastFetchTime = 0;
// 	else
// 		lastFetchTime = lastFetchTime.createdAt.getTime();

// 	const currentTime = new Date().getTime();

// 	const Documentcount = await top_stories_model.find({}).countDocuments();  // this is because if user close the browser at the time of web scraping then we have to fetch the data again

// 	if (currentTime - lastFetchTime > FETCH_INTERVAL || Documentcount < 30) {

// 		const articles = await Scrap({
// 			country: "IN",
// 		});

// 		try {
// 			await top_stories_model.deleteMany({});
// 		} catch (err) {
// 			res.status(210).json({ success: false, articles: "An error occurred while deleting the data from the database " });
// 		}

// 		try {
// 			console.log(articles);

// 			articles?.forEach(async (article) => {

// 				if (article) {
// 					const newArticle = new top_stories_model({
// 						title: article.title,
// 						link: article.link,
// 						time: article.time,
// 						providerImg: article.providerImg,
// 					});
// 					await newArticle.save();
// 				}
// 			});

// 			articles.forEach(async (article) => {
// 				const url = new URL(article.providerImg);
// 				const params = new URLSearchParams(url.search);
// 				const baseUrl = params.get('url');
// 				const finalURL = baseUrl ? new URL(baseUrl).origin : null;

// 				let providerName = finalURL.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\.com$/, "").replace(/\.in$/, "");

// 				if (providerName.includes('.')) {
// 					providerName = providerName.replace(/\./g, '-');
// 				}

// 				try {
// 					const provider = await newsProvidermodel.findOne({ baseURL: finalURL });
// 					// console.log(finalURL, provider);
// 					if (!provider) {
// 						await newsProvidermodel.create({ name: providerName, baseURL: finalURL, logo: article.providerImg });
// 					}
// 				} catch (err) {
// 					console.log(err);
// 				}

// 			});

// 			res.status(202).json({ success: true, articles: articles });
// 		}
// 		catch (err) {
// 			console.log(err);
// 			res.status(210).json({ success: false, articles: "An error occurred while saving the data to the database " });
// 		}
// 	}
// 	else {
// 		try {
// 			const top_stories = await top_stories_model.find();

// 			res.status(202).json({ success: true, articles: top_stories });
// 		} catch (error) {
// 			res.status(210).json({ success: false, message: error });
// 		}
// 	}
// };
// // module.exports = { ScrapTop_stories };
// export default ScrapTop_stories;

import randomUseragent from "random-useragent";
import { top_stories_model } from "../models/mtopStories.js";
import { newsProvidermodel } from "../models/mnewsProvider.js";
import puppeteer from "puppeteer";

// const puppeteer = require("puppeteer");
// const randomUseragent = require("random-useragent"); // Added random-useragent
// const top_stories_model = require("../models/mtopStories");
// const newsProvidermodel = require("../models/mnewsProvider.js");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// const findChromeUserDataDir = () => {
// 	let possiblePaths = [];

// 	if (process.platform === 'win32') {
// 		const localAppData = process.env.LOCALAPPDATA;
// 		const appData = process.env.APPDATA;
// 		const username = process.env.USERNAME || os.userInfo().username;

// 		if (localAppData) {
// 			possiblePaths.push(path.join(localAppData, 'Google', 'Chrome', 'User Data'));
// 		}
// 		if (appData) {
// 			possiblePaths.push(path.join(appData, 'Google', 'Chrome', 'User Data'));
// 		}
// 		possiblePaths.push(path.join('C:', 'Users', username, 'AppData', 'Local', 'Google', 'Chrome', 'User Data'));
// 	} else if (process.platform === 'darwin') {
// 		possiblePaths.push(path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome'));
// 	} else {
// 		possiblePaths.push(path.join(os.homedir(), '.config', 'google-chrome'));
// 	}

// 	for (const dir of possiblePaths) {
// 		if (fs.existsSync(dir)) {
// 			return dir;
// 		}
// 	}

// 	console.log('Could not find Chrome user data directory');
// 	return null;
// };

const scanForLinks = async (page) => {
  try {
    // Wait for news cards to load - Google News uses div.IBr9hb or div.UwIKyb
    await page.waitForSelector("a.gPFEn", { timeout: 15000 });

    // Give extra time for dynamic content to load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const articles = await page.$$eval("a.gPFEn", (links) => {
      return links.map((linkElement) => {
        // Get the parent card container to find related elements
        const card =
          linkElement.closest("div.IBr9hb") ||
          linkElement.closest("div.UwIKyb") ||
          linkElement.parentElement;

        // Get the title from the link text
        const title = linkElement.textContent.trim();

        // Get the href
        const href = linkElement.getAttribute("href") || "";
        const link = href.startsWith("http")
          ? href
          : href.startsWith("./")
            ? `https://news.google.com${href.substring(1)}`
            : `https://news.google.com/${href}`;

        // Find time element within the card
        const timeElement = card
          ? card.querySelector("time.hvbAAd") || card.querySelector("time")
          : null;

        // Find provider image within the card
        const providerImgElement = card
          ? card.querySelector("img.qEdqNd") ||
            card.querySelector("div.MCAGUe img")
          : null;

        // Find provider name
        const providerNameElement = card
          ? card.querySelector("div.vr1PYe")
          : null;

        const articleData = {
          title: title,
          link: link,
          time: timeElement
            ? timeElement.textContent || timeElement.getAttribute("datetime")
            : "Recently",
          providerImg: providerImgElement
            ? providerImgElement.getAttribute("src")
            : null,
          providerName: providerNameElement
            ? providerNameElement.textContent.trim()
            : null,
        };

        // Return article only if it has all fields
        return articleData.title &&
          articleData.link &&
          articleData.time &&
          articleData.providerImg &&
          articleData.providerName
          ? articleData
          : null;
      });
    });

    return articles.filter((article) => article !== null);
  } catch (err) {
    console.error("Error scanning for links:", err.message);
    return [];
  }
};

const Scrap = async (searchby) => {
  let browser = null;
  try {
    let country = searchby.country;

    let puppeteerOptions = {
      headless: "new", // Use new headless mode
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920,1080",
      ],
      defaultViewport: { width: 1920, height: 1080 },
    };
    browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();

    const userAgent = randomUseragent.getRandom(); // Get a random user agent
    await page.setUserAgent(userAgent); // Set the random user agent

    console.log(`Starting to search for Top stories in ${country}`);

    const url = `https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-${country}&gl=${country}&ceid=${country}%3Aen`;
    console.log("Navigating to:", url);

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const articles = await scanForLinks(page);
    console.log("Scraped articles count:", articles.length);

    await browser.close();
    browser = null;

    return articles;
  } catch (err) {
    console.error("Scraping error:", err.message);
    if (browser) {
      await browser.close();
    }
    return [];
  }
};

const ScrapTop_stories = async (req, res) => {
  const FETCH_INTERVAL = 1000 * 60 * 20; // 20 min

  let lastFetchTime = null;
  lastFetchTime = await top_stories_model.findOne({}, { createdAt: 1 });
  if (!lastFetchTime) lastFetchTime = 0;
  else lastFetchTime = lastFetchTime.createdAt.getTime();

  const currentTime = new Date().getTime();

  const Documentcount = await top_stories_model.find({}).countDocuments(); // this is because if user close the browser at the time of web scraping then we have to fetch the data again

  if (currentTime - lastFetchTime > FETCH_INTERVAL || Documentcount < 30) {
    console.log("Scraping new articles...");
    const articles = await Scrap({
      country: "IN",
    });

    // If scraping failed or returned no articles, try to return cached data
    if (!articles || articles.length === 0) {
      console.log("Scraping returned no articles, checking cache...");
      const cached = await top_stories_model.find();
      if (cached && cached.length > 0) {
        return res
          .status(202)
          .json({ success: true, articles: cached, source: "cache" });
      }
      return res.status(210).json({
        success: false,
        articles: [],
        message: "Could not scrape articles and no cache available",
      });
    }

    try {
      await top_stories_model.deleteMany({});
    } catch (err) {
      return res.status(210).json({
        success: false,
        articles:
          "An error occurred while deleting the data from the database ",
      });
    }

    try {
      console.log("Saving", articles.length, "articles to database...");

      // Save articles sequentially to avoid race conditions
      for (const article of articles) {
        if (article) {
          const newArticle = new top_stories_model({
            title: article.title,
            link: article.link,
            time: article.time,
            providerImg: article.providerImg || "",
          });
          await newArticle.save();
        }
      }

      // Process news providers
      for (const article of articles) {
        if (article.providerImg) {
          try {
            const url = new URL(article.providerImg);
            const params = new URLSearchParams(url.search);
            const baseUrl = params.get("url");
            const finalURL = baseUrl ? new URL(baseUrl).origin : null;

            if (finalURL) {
              let providerName = finalURL
                .replace(/^https?:\/\//, "")
                .replace(/^www\./, "")
                .replace(/\.com$/, "")
                .replace(/\.in$/, "");

              if (providerName.includes(".")) {
                providerName = providerName.replace(/\./g, "-");
              }

              const provider = await newsProvidermodel.findOne({
                baseURL: finalURL,
              });
              if (!provider) {
                await newsProvidermodel.create({
                  name: providerName,
                  baseURL: finalURL,
                  logo: article.providerImg,
                });
              }
            }
          } catch (err) {
            console.log("Error processing provider:", err.message);
          }
        }
      }
      // for (const article of articles) {
      // 	const url = new URL(article.providerImg);
      // 	const params = new URLSearchParams(url.search);
      // 	const baseUrl = params.get('url');
      // 	const finalURL = baseUrl ? new URL(baseUrl).origin : null;

      // 	let providerName = finalURL.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/^m\./, "").replace(/\.com$/, "").replace(/\.in$/, "");

      // 	if (providerName.includes('.')) {
      // 		providerName = providerName.replace(/\./g, '-');
      // 	}

      // 	console.log(providerName);

      // 	try {
      // 		const provider = await newsProvidermodel.findOne({ url: finalURL });

      // 		if (!provider) {
      // 			await newsProvidermodel.create({ name: providerName, url: finalURL });
      // 		}
      // 	} catch (err) {
      // 		console.log(err);
      // 	}
      // }
      res.status(202).json({ success: true, articles: articles });
    } catch (err) {
      console.log(err);
      res.status(210).json({
        success: false,
        articles: "An error occurred while saving the data to the database ",
      });
    }
  } else {
    try {
      const top_stories = await top_stories_model.find();

      res.status(202).json({ success: true, articles: top_stories });
    } catch (error) {
      res.status(210).json({ success: false, message: error });
    }
  }
};
// module.exports = { ScrapTop_stories };
export { ScrapTop_stories };
