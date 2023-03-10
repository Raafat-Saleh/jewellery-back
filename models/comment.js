/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commenter_id: { type: String, required: true },
  commenter_image: { type: String },
  commenter_name: { type: String },

  blog_id: { type: String },

  comment: { type: String },
  date: { type: String },
  replies: [{ type: Object }],
});

module.exports = mongoose.model("Comment", commentSchema);
