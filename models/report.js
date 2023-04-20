/** @format */

const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const reportSchema = new Schema({
  text: { type: String, required: true, trim: true },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

reportSchema.pre("find", function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({ path: "comment", options: { _recursed: true } }).populate({
    path: "reporter",
    select: "firstName lastName avatar",
    options: { _recursed: true },
  });
  next();
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
