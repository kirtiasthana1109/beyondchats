const axios = require("axios");
const cheerio = require("cheerio");
const Article = require("../Article");

async function scrapePage(url) {

  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let blogs = [];

  $("article.entry-card").each((i, el) => {

    const title = $(el)
      .find("h2.entry-title")
      .text()
      .trim();

    const link = $(el)
      .find("h2.entry-title a")
      .attr("href");

    blogs.push({ title, link });
  });

  return blogs;
}

(async () => {

  let finalBlogs = [];
  const page15 = await scrapePage("https://beyondchats.com/blogs/page/15");
  finalBlogs.push(page15[0]);  

  const page14 = await scrapePage("https://beyondchats.com/blogs/page/14");
  const lastFour = page14.slice(-4);

  finalBlogs.push(...lastFour);

  console.log("FINAL BLOGS = ", finalBlogs);

  await Article.insertMany(finalBlogs);

  console.log("Saved 5 oldest blogs successfully");
})();