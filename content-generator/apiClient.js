const axios = require("axios");

const API_BASE = "http://localhost:5000/articles";

async function getArticles() {
  const res = await axios.get(API_BASE);
  return res.data;
}

async function publishArticle(article) {
  return await axios.post(API_BASE, article);
}

module.exports = { getArticles, publishArticle };
