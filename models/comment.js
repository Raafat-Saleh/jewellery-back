/** @format */

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },

  date: { type: String },
  comment: {
    type: String,
    validate(value) {
      if ([...value].length < 5) {
        throw new Error("short comment");
      }
    },
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
  },

  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Comment",
    },
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

// -parent
commentSchema.pre("find", function (next) {
  this.populate({ path: "replies", select: "" }).populate({
    path: "user",
    select: "firstName lastName avatar",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
