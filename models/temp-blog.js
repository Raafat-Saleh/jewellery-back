/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tempBlogSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  content: { type: String },
  image: { type: String },
  images: [{ type: String }],
  tags: [{ type: Object }],
  date: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  method: { type: String },
  old_blog_id: { type: String },
});

module.exports = mongoose.model("Temp_blog", tempBlogSchema);
