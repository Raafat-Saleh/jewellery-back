/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tempProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String, trim: true },
    image4: { type: String },

    price: { type: String },
    stock: { type: String },
    discount: { type: String },
    end_date: { type: String },

    tags: [{ type: String }], ////////
    category: { type: String },
    model: { type: String },

    features: { type: String },
    caliber: { type: String },

    method: { type: String },
    old_product_id: { type: String },

    store: { type: String },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const TempProduct = mongoose.model("Temp_products", tempProductSchema);
module.exports = TempProduct;
