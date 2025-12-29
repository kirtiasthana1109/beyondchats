// Article model and CRUD operations
const mongoose = require("./db");

const ArticleSchema = new
mongoose.Schema({
    title: String,
    link: String,
    });

module.exports = mongoose.model("Article", ArticleSchema);