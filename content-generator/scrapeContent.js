const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeArticle(url) {
  try {
    console.log(" Scraping:", url);

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US,en;q=0.9"
      },
      timeout: 15000
    });

    const $ = cheerio.load(data);

    const selectors = [
      "article",
      ".article-body",
      ".post-content",
      ".blog-content",
      ".content",
      "main"
    ];

    let text = "";

    for (const s of selectors) {
      const block = $(s).text().trim();
      if (block.length > 500) {
        text = block;
        break;
      }
    }

    if (!text) {
      text = $("p").text().trim();
    }

    if (!text || text.length < 200) {
      console.log("Content too small");
      return null;
    }

    return text;

  } catch (err) {
    console.log(" Scrape failed:", url);
    return null;
  }
}

module.exports = scrapeArticle;
