// const OpenAI = require("openai");
// require("dotenv").config();

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// async function rewriteLite(title, link) {
//   const prompt = `
// Write a fresh, clean, SEO-friendly blog article based on this topic:

// Title: ${title}
// Source link (context only, do NOT copy):
// ${link}

// Requirements:
// - Keep meaning same as original topic
// - Improve clarity, tone, structure and readability
// - Use headings & short paragraphs
// - No plagiarism
// - Add conclusion
// - Add "References" at bottom with this link only
// `;

//   const res = await client.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }],
//     max_tokens: 950,
//     temperature: 0.5
//   });

//   return res.choices[0].message.content;
// }

// module.exports = rewriteLite;
const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function rewriteLite(title, link) {
  const prompt = `
Write a clean, SEO-friendly blog article based on this topic.

Title: ${title}
Source link (for context only, do NOT copy content):
${link}

Requirements:
- Keep meaning same as the topic
- Improve clarity, structure and readability
- Use headings & short paragraphs
- No plagiarism
- Add a conclusion
- Add "References" at bottom with this link only
`;

  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      console.log(`🧠 AI attempt ${attempt}`);

      const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 900,
        temperature: 0.5
      });

      return res.choices[0].message.content.trim();
    }

    catch (err) {
      const msg = err?.error?.message || err?.message || "";

      // ⛔ HARD TPM / RPD LIMIT (includes time remaining text)
      if (msg.includes("tokens per min") || msg.includes("requests per day")) {
        const match = msg.match(/(\d+)m(\d+)\.?(\d+)?s/);
        const delay =
          match ?
          ((+match[1] * 60) + (+match[2])) * 1000 :
          10 * 60 * 1000; // fallback 10 mins

        console.log(`⏳ Hard limit — waiting ${(delay/1000).toFixed(0)}s…`);
        await wait(delay);
        continue;
      }

      
      // normal retry
      console.log("⚠ Retrying in 30s…");
      await wait(30000);
    }
  }

  console.log("❌ Gave up after retries");
  return null;
}

module.exports = rewriteLite;
