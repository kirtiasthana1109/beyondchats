/**
 * rewrite-single.js
 * - Rewrite ALL articles OR
 * - Rewrite ONLY ONE article (configurable)
 */

require("dotenv").config({ path: "../content-generator/.env" });
require("./db");

const Article = require("./Article");
const generateNewArticle = require("../content-generator/generateArticle");

/**
 * 👉 If you want to rewrite ONLY one article,
 *    put its exact title here.
 * 👉 If null, ALL articles will be rewritten.
 */
const ONLY_TITLE = null;
// Example:
// const ONLY_TITLE = "10X Your Leads: How Chatbots Revolutionize Lead Generation";

(async () => {
  try {
    console.log("🚀 Rewrite process started");

    // 🔹 Step 1: Fetch originals
    const query = {
      isUpdatedVersion: { $ne: true },
      ...(ONLY_TITLE ? { title: ONLY_TITLE } : {})
    };

    const originals = await Article.find(query);

    if (!originals.length) {
      console.log("❌ No original articles found");
      process.exit(0);
    }

    console.log(`📄 Articles to process: ${originals.length}`);

    // 🔹 Step 2: Process each article
    for (const original of originals) {
      console.log(`\n📝 Processing: ${original.title}`);

      const newArt = await generateNewArticle(original.title);

      if (!newArt || !newArt.content) {
        console.log("⚠ Rewrite failed, skipping");
        continue;
      }

      // add references
      newArt.content += `

References:
1️⃣ ${newArt.source1}
2️⃣ ${newArt.source2}
`;

      // 🔹 Step 3: Save / update updated version
      const updatedDoc = await Article.findOneAndUpdate(
        { originalId: original._id }, // 🔑 RELATION KEY
        {
          title: `${original.title} (Updated Version)`,
          link: original.link,
          content: newArt.content,
          isUpdatedVersion: true,
          originalId: original._id
        },
        { upsert: true, new: true }
      );

      console.log("✅ Updated saved");
      console.log("🆔 Updated ID:", updatedDoc._id.toString());
    }

    console.log("\n🎉 Rewrite process completed successfully");
    process.exit(0);

  } catch (err) {
    console.error("❌ Rewrite process failed:", err);
    process.exit(1);
  }
})();
