// const Article = require("../articles-backend/Article");
// const rewriteLite = require("./rewrite-lite");
// require("dotenv").config();

// async function wait(ms) {
//   return new Promise(res => setTimeout(res, ms));
// }

// async function run() {
//   console.log("🚀 AI Rewrite — Remaining Articles");

//   // fetch only originals
//   const originals = await Article.find({
//     $or: [
//       { isUpdatedVersion: false },
//       { isUpdatedVersion: { $exists: false } }
//     ]
//   })
//     // 👉 first test with 1 article

//   console.log("📄 Articles to process:", originals.length);

//   for (const art of originals) {
//     console.log("\n📝 Processing:", art.title);

//     const rewritten = await rewriteLite(art.title, art.link);

//     if (!rewritten) {
//       console.log("⚠ Rewrite failed, skipping");
//       continue;
//     }

//     await Article.create({
//       originalId: art._id,
//       isUpdatedVersion: true,
//       title: `${art.title} (Updated Version)`,
//       link: art.link,
//       content: rewritten
//     });

//     console.log("✅ AI Enhanced Version Saved");

//     console.log("⏳ Cooling 15s before next...");
//     await wait(15000);
//   }

//   console.log("\n🎉 Done");
// }

// run();

const Article = require("../articles-backend/Article");
const rewriteLite = require("./rewrite-lite");
require("dotenv").config();

async function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function run() {
  console.log("🚀 AI Rewrite — Remaining Articles");

  // fetch only articles that do NOT already have updated version
  const originals = await Article.find({
    $or: [
      { isUpdatedVersion: false },
      { isUpdatedVersion: { $exists: false } }
    ]
  });

  console.log("📄 Articles to process:", originals.length);

  for (const art of originals) {

    // skip if already enhanced exists
    const exists = await Article.findOne({
      originalId: art._id,
      isUpdatedVersion: true
    });

    if (exists) {
      console.log(`⏭ Already enhanced → Skipping: ${art.title}`);
      continue;
    }

    console.log(`\n📝 Enhancing: ${art.title}`);

    const rewritten = await rewriteLite(art.title, art.link);

    if (!rewritten) {
      console.log("⚠ Rewrite failed — skipping");
      continue;
    }

    await Article.create({
      originalId: art._id,
      isUpdatedVersion: true,
      title: `${art.title} (Updated Version)`,
      link: art.link,
      content: rewritten
    });

    console.log("✅ AI Enhanced Version Saved");

    console.log("⏳ Cooling 20s before next...");
    await wait(20000);
  }

  console.log("\n🎉 Done");
}

run();
