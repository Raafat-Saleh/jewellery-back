/** @format */

const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const optionSchema = new Schema({
  male_image: { type: String, required: true },
  female_image: { type: String, required: true },
});
const Option = mongoose.model("Option", optionSchema);
module.exports = Option;
