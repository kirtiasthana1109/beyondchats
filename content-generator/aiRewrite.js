

const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function rewriteArticle(content, refs) {
  try {
    const safeContent =
      content?.length > 1800 ? content.slice(0, 1800) : content || "";

    const messages = [
      {
        role: "user",
        content: `
Rewrite this article in a clean SEO-friendly format.
Improve readability, structure and flow.
Do NOT change facts — keep meaning same.

At the end add:

References:
${refs.join("\n")}

Content to rewrite:
${safeContent}
`
      }
    ];

    const models = [
      "gpt-4o-mini-2024-07-18",
      "gpt-4o-mini"
    ];

    for (let attempt = 1; attempt <= 5; attempt++) {
      const model = models[Math.min(attempt - 1, models.length - 1)];

      console.log(`🧠 AI attempt ${attempt} (model: ${model})`);

      try {
        const res = await client.chat.completions.create({
          model,
          messages,
          max_tokens: 800,
          temperature: 0.4
        });

        const text = res?.choices?.[0]?.message?.content?.trim() || "";
        console.log("📏 Output length:", text.length);

        if (text.length >= 300) {
          console.log("✔ AI rewrite OK");
          return text;
        }

        console.log("⚠ Response short — retrying…");
      }

      catch (err) {
        const msg =
          err?.response?.data?.error?.message || err?.message || "";

        // 🟥 HARD DAILY LIMIT (RPD)
        if (msg.includes("requests per day")) {
          const match = msg.match(/(\d+)m(\d+)s/);

          const delay = match
            ? ((+match[1] * 60) + (+match[2])) * 1000
            : 10 * 60 * 1000;

          console.log(
            `⏳ Daily limit — waiting ${(delay / 1000).toFixed(0)}s…`
          );

          await wait(delay);
          continue;
        }

        // 🟡 REQUESTS PER MINUTE (RPM)
        if (msg.includes("requests per min")) {
          const match = msg.match(/(\d+)s/);
          const delay = match ? (+match[1]) * 1000 : 30000;

          console.log(
            `⏳ RPM limit — waiting ${(delay / 1000).toFixed(0)}s…`
          );

          await wait(delay);
          continue;
        }

        // 🟢 SOFT 429 W/ RETRY-AFTER
        if (err?.response?.status === 429) {
          const retry = err?.response?.headers?.["retry-after"];

          const delay = retry
            ? Number(retry) * 1000
            : 60000 * attempt; // 60s → 120s → 180s…

          console.log(
            `⏳ Rate-limit — waiting ${(delay / 1000).toFixed(0)}s…`
          );

          await wait(delay);
          continue;
        }

        console.log("❌ Non-rate-limit error:", err?.message);
        throw err;
      }
    }

    console.log("❌ Final AI failure after retries");
    return null;

  } catch (err) {
    console.log("❌ Final AI failure:");
    console.log("Full error:", err?.response?.data || err?.message || err);
    return null;
  }
}

module.exports = rewriteArticle;
