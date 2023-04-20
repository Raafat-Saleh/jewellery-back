/** @format */
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Product = require("../models/product");
const Bin = require("../models/bin");
const User = require("../models/user");

const createProductFromBin = async (req, res, next) => {
  try {
    const bin = await Bin.findById({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!bin) {
      return res.status(404).send("No bin product is found to delete");
    }

    let obj = bin.toObject();
    delete obj._id;
    const createdProduct = new Product(obj);

    await createdProduct.save();
    await bin.remove();

    res.status(201).json({ product: createdProduct });
  } catch (e) {
    res.status(400).send(e);
  }
};

const getBinProductById = async (req, res, next) => {
  try {
    const bin = await Bin.findOne({ _id: req.params.id });

    if (!bin) {
      return res.status(404).send("Could not find a bin product.");
    }
    res.json({ bin: bin });
  } catch (e) {
    res.status(500).send("Something went wrong, could not find a product.");
  }
};

const getUser_bin_products = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user._id,
    });

    await user.populate("bin").execPopulate();
    res.send({ bin_products: user.bin });
  } catch (e) {
    res.status(500).send();
  }
};

const deleteBinProduct = async (req, res, next) => {
  try {
    const bin = await Bin.findByIdAndDelete({
      _id: req.params.id,
      creator: req.user._id,
    });
    if (!bin) {
      return res.status(404).send("No bin product is found to delete");
    }
    res.status(200).send("Deleted Successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteAllBinProductsForUser = async (req, res, next) => {
  let countBinProduct;
  try {
    countBinProduct = await Bin.deleteMany({ creator: req.user._id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete All bin_products.",
      500
    );
    return next(error);
  }
  res.status(200).json({
    message: `Deleted ${countBinProduct.deletedCount} bin_products`,
  });
};

const deleteAllBinProductsForAdmin = async (req, res, next) => {
  let countBinProduct;
  try {
    countBinProduct = await Bin.deleteMany({ creator: req.params.id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete All temp_products.",
      500
    );
    return next(error);
  }
  res.status(200).json({
    message: `Deleted ${countBinProduct.deletedCount} bin_products`,
  });
};

exports.createProductFromBin = createProductFromBin;
exports.getBinProductById = getBinProductById;
exports.getUser_bin_products = getUser_bin_products;
exports.deleteBinProduct = deleteBinProduct;
exports.deleteAllBinProductsForUser = deleteAllBinProductsForUser;
exports.deleteAllBinProductsForAdmin = deleteAllBinProductsForAdmin;
