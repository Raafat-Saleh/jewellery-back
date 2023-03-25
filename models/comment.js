/** @format */

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

commentSchema.pre("find", function (next) {
  // if (this.options._recursed) {
  //   return next();
  // }
  this.populate({ path: "replies", select: "-parent" }).populate({
    path: "user",
    select: "firstName lastName store avatar",
  });

  //, options: { _recursed: true } , select: "age email comment"
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
