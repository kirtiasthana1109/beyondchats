const mongoose = require("./db");

const ArticleSchema = new mongoose.Schema({
  title: String,
  link: String,
  content: String,
  originalId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },     
  isUpdatedVersion: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Article", ArticleSchema);
