

require("dotenv").config();

const { getArticles, publishArticle } = require("./apiClient");
const generateNewArticle = require("./generateArticle");

(async () => {

  console.log("🚀 Phase-2 Started\n");

  const articles = await getArticles();

  for (let art of articles) {

    console.log("\n📝 Processing:", art.title);

    // ❌ Skip if already updated
    if (art.isUpdatedVersion) {
      console.log("⏩ Skipping (already updated)");
      continue;
    }

    const newArt = await generateNewArticle(art.title);

    // ❌ Skip if AI failed or content is empty
    if (!newArt || !newArt.content) {
      console.log("⚠️ Skipped — No AI content generated\n");
      continue;
    }

    // Append references
    newArt.content += `

References:
1️⃣ ${newArt.source1}
2️⃣ ${newArt.source2}
`;

    const payload = {
      title: art.title + " (Updated Version)",
      link: art.link || "",
      content: newArt.content,
      isUpdatedVersion: true
    };

    await publishArticle(payload);

    console.log("✅ Saved:", payload.title);

    // 🕒 Avoid rate limit
    await new Promise(r => setTimeout(r, 4000));
  }

  console.log("\n🎯 Phase-2 Completed");

})();

