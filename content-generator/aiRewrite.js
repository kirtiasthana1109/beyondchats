const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function rewriteArticle(content, refs) {
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `Rewrite this article in a clean SEO-friendly format.
                     Improve flow, headings and readability.
                     Keep meaning same — do NOT change facts.
                     At the end add:
                     References: 
                     ${refs.join("\n")}

                     Content to rewrite:
                     ${content}
                      `
                      }]
                    });

    return res.choices?.[0]?.message?.content || null;

  } catch (err) {
    console.log("AI Rewrite Error:", err.message);
    return null;
  }
}

module.exports = rewriteArticle;
