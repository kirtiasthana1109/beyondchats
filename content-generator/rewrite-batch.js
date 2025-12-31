const Article = require("../articles-backend/Article");
const scrapeArticle = require("./scrapeContent");
const rewriteArticle = require("./aiRewrite");


async function runBatchRewrite() {
//   const articles = await Article.find({ isUpdatedVersion: false }).limit(5);

const articles = await Article.find({
  $or: [
    { isUpdatedVersion: false },
    { isUpdatedVersion: { $exists: false } }
  ]
});



  console.log("📄 Articles to process:", articles.length);

  for (const article of articles) {
    console.log("\n📝 Processing:", article.title);

    const scraped = await scrapeArticle(article.link);
    if (!scraped) {
      console.log("⚠ Skipped — no content scraped");
      continue;
    }

    const rewritten = await rewriteArticle(scraped, [article.link]);
    if (!rewritten) {
      console.log("⚠ Rewrite failed — skipping");
      continue;
    }

    await Article.create({
      originalId: article._id,
      isUpdatedVersion: true,
      content: rewritten
    });

    console.log("✅ Updated version saved");
  }

  console.log("\n🎉 Done");
}

runBatchRewrite();
