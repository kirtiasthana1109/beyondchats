const express = require("express");
const cors = require("cors");
const Article = require("../Article");
require("../db");
const {ObjectId} = require("mongodb");
const { default: mongoose } = require("mongoose");


const app = express();
app.disable("etag");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// 🔹 Force JSON response
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// 🔹 Get all articles
app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/articles/:id", async (req, res) => {
  try {
    const original = await Article.findById(req.params.id);
  
    if (!original) {
      return res.status(404).json({ message: "Article not found" });
    }

    const updated = await Article.findOne({
      originalId: original._id,
      isUpdatedVersion: true
    }).lean();
    console.log("    ", original);
    console.log("Original ID =", original._id);
    console.log("Updated Found =", !!updated);

    return res.json({
      title: original.title,
      link: original.link,
      original: {
        _id: original._id,
        title: original.title,
        content: original.content || null,
        link: original.link
      },
      updated: updated
        ? {
            _id: updated._id,
            content: updated.content ?? null
          }
        : null
    });

  } catch (err) {
    console.error("GET /articles/:id error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


app.put("/articles/:id", async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(article);
});

app.delete("/articles/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

app.listen(5000, () => {
  console.log("API server running at http://localhost:5000");
});