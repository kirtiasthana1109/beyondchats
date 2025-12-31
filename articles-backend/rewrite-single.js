require("dotenv").config({ path: "../content-generator/.env" });
require("./db");

const Article = require("./Article");
const generateNewArticle = require("../content-generator/generateArticle");

const ONLY_TITLE = null;

(async () => {
  try {
    console.log("🚀 Rewrite process started");
    const query = {
      isUpdatedVersion: { $ne: true },
      ...(ONLY_TITLE ? { title: ONLY_TITLE } : {})
    };

    const originals = await Article.find(query);

    if (!originals.length) {
      console.log(" No original articles found");
      process.exit(0);
    }

    console.log(` Articles to process: ${originals.length}`);
    for (const original of originals) {
      console.log(`\n Processing: ${original.title}`);

      const newArt = await generateNewArticle(original.title);

      if (!newArt || !newArt.content) {
        console.log("Rewrite failed, skipping");
        continue;
      }

      newArt.content += `

References:
1️⃣ ${newArt.source1}
2️⃣ ${newArt.source2}
`;

      const updatedDoc = await Article.findOneAndUpdate(
        { originalId: original._id },
        {
          title: `${original.title} (Updated Version)`,
          link: original.link,
          content: newArt.content,
          isUpdatedVersion: true,
          originalId: original._id
        },
        { upsert: true, new: true }
      );

      console.log("Updated saved");
      console.log("Updated ID:", updatedDoc._id.toString());
    }

    console.log("\nRewrite process completed successfully");
    process.exit(0);

  } catch (err) {
    console.error("❌ Rewrite process failed:", err);
    process.exit(1);
  }
})();
