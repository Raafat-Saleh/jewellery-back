/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  image: { type: String },
  images: [{ type: String }],
  tags: [{ type: Object }],
  date: { type: String },
  views: { type: Number, default: 1 },
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
