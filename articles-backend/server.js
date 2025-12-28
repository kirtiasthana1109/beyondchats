const express = require("express");
const cors = require("cors");
const Article = require("../Article");
require("../db");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/articles", async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

app.get("/articles/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.json(article);
});

app.post("/articles", async (req, res) => {
  const article = await Article.create(req.body);
  res.json(article);
});

app.put("/articles/:id", async (req, res) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(article);
});

app.delete("/articles/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

app.listen(5000, () => {
  console.log("API server running on http://localhost:5000");
});