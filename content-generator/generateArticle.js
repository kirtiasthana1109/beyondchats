const searchOnGoogle = require("./googleSearch");
const scrapeArticle = require("./scrapeContent");
const rewriteArticle = require("./aiRewrite");

async function generateNewArticle(title) {

  console.log("\n📝 Processing Article:", title);

  const query = title.replace(/[:?]/g, "") + " chatbot blog article";

  const links = await searchOnGoogle(query);
  console.log("🔗 Search Links:", links);

  if (!links || links.length === 0) {
    console.log("⚠️ No links found — skipping");
    return null;
  }

  const validLinks = links.filter(l => l && l.startsWith("http")).slice(0, 3);

  if (validLinks.length < 2) {
    console.log("⚠️ Not enough valid links — skipping");
    return null;
  }

  let c1 = await scrapeArticle(validLinks[0]);
  let c2 = await scrapeArticle(validLinks[1]);

  if (!c1 || !c2) {
    console.log("⚠️ One source failed — trying extra link…");

    if (!c1 && validLinks[2]) c1 = await scrapeArticle(validLinks[2]);
    if (!c2 && validLinks[2]) c2 = await scrapeArticle(validLinks[2]);
  }

  if (!c1 || !c2) {
    console.log("⏩ Skipping — still missing content");
    return null;
  }

  const combined = c1 + "\n\n" + c2;

  const rewritten = await rewriteArticle(combined, validLinks);

  if (!rewritten) {
    console.log("⚠️ Rewrite failed — skipping");
    return null;
  }

  return {
    title: title,
    content: rewritten,
    source1: validLinks[0],
    source2: validLinks[1]
  };
}

module.exports = generateNewArticle;
