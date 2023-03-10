/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tempProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  image4: { type: String, required: true },

  price: { type: String, required: true },
  stock: { type: String },
  discount: { type: String },
  end_date: { type: String },

  tags: [{ type: String, required: true }], ////////
  category: { type: String, required: true },
  model: { type: String, required: true },

  features: { type: String, required: true },
  caliber: { type: String, required: true },

  method: { type: String },
  old_product_id: { type: String },

  seller: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Temp_products", tempProductSchema);
