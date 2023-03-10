/** @format */

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  sex: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },

  rate: { type: String },
  opinion: { type: String },
  image: { type: String },

  account_type: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false },

  products: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

// purchases:[{ type: String}],
