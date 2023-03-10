/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  publisher: { type: String, required: true },
  date: { type: String },
  image: { type: String },
  title: { type: String },
  description: { type: String },
  content: { type: String },
  images: [{ type: String }],
  tags: [{ type: Object, ref: "Blog" }],
  creator: { type: String },
});

module.exports = mongoose.model("Blog", blogSchema);
