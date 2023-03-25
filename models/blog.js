/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: { type: String },
  description: { type: String },
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
});

blogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blog_id",
});

module.exports = mongoose.model("Blog", blogSchema);
