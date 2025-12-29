require("dotenv").config();

const { getArticles, publishArticle } = require("./apiClient");
const generateNewArticle = require("./generateArticle");

(async () => {
  console.log(" Phase-2 Script Started\n");

  const articles = await getArticles();

  for (let art of articles) {

    console.log("\n Processing Article:", art.title);

    const newArt = await generateNewArticle(art.title);

    if (!newArt) {
      console.log(" Skipped (no rewritten content)\n");
      continue;
    }

    
    newArt.content += `

  References:
1️⃣ ${newArt.source1}
2️⃣ ${newArt.source2}
`;

    const finalPayload = {
      title: art.title + " (Updated Version)",
      content: newArt.content,
      references: [newArt.source1, newArt.source2]
    };

    await publishArticle(finalPayload);

    console.log("Published Successfully:", finalPayload.title);
  }

  console.log("\n Phase-2 Completed Successfully");
})();
