/** @format */

const HttpError = require("../models/http-error");
const Product = require("../models/product");
const TempProduct = require("../models/temp-product");
const Bin = require("../models/bin");

const createTempProduct = async (req, res, next) => {
  if (req.user.accountType == "seller") {
    const createdTempProduct = new TempProduct({
      ...req.body,
      method: "add",
      creator: req.user._id,
    });
    try {
      await createdTempProduct.save();
      res.status(201).json({
        message: "Under review thanks!",
        createdTempProduct: createdTempProduct,
      });
    } catch (err) {
      res.status(500).json({ message: "Creating temp_product failed" });
    }
  } else {
    res.status(500).json({ message: "Not Allowed." });
  }
};

//Admin
const getTempProductsForAdd = async (req, res, next) => {
  try {
    const temp_products = await TempProduct.find({ method: "add" });
    res.json({
      temp_products: temp_products,
    });
  } catch (err) {
    const error = new HttpError("Fetching temp_products failed", 500);
    return next(error);
  }
};

const updateTempProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.pid,
      creator: req.user._id,
    });
    if (!product) {
      return res.status(404).send("product not found");
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "description",
      "title",
      "image1",
      "image2",
      "image3",
      "image4",
      "price",
      "stock",
      "discount",
      "end_date",
      "tags",
      "category",
      "model",
      "features",
      "caliber",
      "store",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    const createdTempProductForEdit = new TempProduct({
      ...req.body,
      method: "edit",
      old_product_id: req.params.pid,
      creator: req.user._id,
    });
    await createdTempProductForEdit.save();
    res.status(200).json({
      message: "Under review thanks!",
      tempProduct: createdTempProductForEdit,
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

//Admin
const getTempProductsForEdit = async (req, res, next) => {
  try {
    const temp_products = await TempProduct.find({ method: "edit" });
    res.json({
      temp_products: temp_products,
    });
  } catch (err) {
    const error = new HttpError("Fetching temp_products failed", 500);
    return next(error);
  }
};

//this for send bin
const deleteProductFromSeller = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.pid,
      creator: req.user._id,
    });

    if (!product) {
      res.status(404).send();
    }

    let obj = product.toObject();
    delete obj._id;
    const bin = new Bin(obj);

    await bin.save();
    res.status(200).json({ message: "Deleted product. and Added to bin" });
  } catch (e) {
    res.status(500).send();
  }
};

const deleteOneTempProduct = async (req, res, next) => {
  try {
    const temp_product = await TempProduct.findOneAndDelete({
      _id: req.params.pid,
      creator: req.user._id,
    });

    if (!temp_product) {
      res.status(404).send();
    }

    res
      .status(200)
      .json({ message: "Deleted temp_product.", temp_product: temp_product });
  } catch (err) {
    res.status(500).send();
  }
};

const deleteAllTempProductForUser = async (req, res, next) => {
  let countTempProduct;
  try {
    countTempProduct = await TempProduct.deleteMany({
      creator: req.body.creator,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete All temp_products.",
      500
    );
    return next(error);
  }
  res.status(200).json({
    message: `Deleted ${countTempProduct.deletedCount} temp_products`,
  });
};

// Admin
const deleteAllTempProduct = async (req, res, next) => {
  let countTempProduct;
  try {
    countTempProduct = await TempProduct.deleteMany({
      creator: req.user._id,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete All temp_products.",
      500
    );
    return next(error);
  }
  res.status(200).json({
    message: `Deleted ${countTempProduct.deletedCount} temp_products`,
  });
};

exports.createTempProduct = createTempProduct;
exports.getTempProductsForAdd = getTempProductsForAdd;
exports.updateTempProduct = updateTempProduct;
exports.getTempProductsForEdit = getTempProductsForEdit;

exports.deleteProductFromSeller = deleteProductFromSeller;
exports.deleteAllTempProductForUser = deleteAllTempProductForUser;

exports.deleteOneTempProduct = deleteOneTempProduct;
exports.deleteAllTempProduct = deleteAllTempProduct;
