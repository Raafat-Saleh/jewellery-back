/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const binSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },

    price: { type: String },
    stock: { type: String },
    discount: { type: String },
    end_date: { type: String },

    tags: [{ type: String }],
    category: { type: String },
    model: { type: String },

    features: { type: String },
    caliber: { type: String },

    store: { type: String },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Bin = mongoose.model("Bin", binSchema);
module.exports = Bin;
