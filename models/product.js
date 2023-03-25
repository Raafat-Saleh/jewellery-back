/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image1: { type: String, required: true },
    image2: { type: String, required: true },
    image3: { type: String, required: true },
    image4: { type: String, required: true },

    price: { type: String, required: true, trim: true },
    stock: { type: String },
    discount: { type: String },
    end_date: { type: String },

    tags: [{ type: String, required: true }], ////////
    category: { type: String, required: true },
    model: { type: String, required: true },

    features: { type: String, required: true, trim: true },
    caliber: { type: String, required: true },

    store: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
