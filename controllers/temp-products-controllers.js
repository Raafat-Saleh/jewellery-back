/** @format */

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Product = require("../models/product");
const TempProduct = require("../models/temp-product");

//[ADD
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
// Auth &&Admin check
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
//ADD]

//[EDIT
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
    const allowedUpdates = ["description", "title"]; //-creator
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
// Auth &&Admin check
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
//EDIT]

// Auth &&Admin check
const deleteOneTempProduct = async (req, res, next) => {
  const tempProductId = req.params.pid;

  try {
    const temp_product = await TempProduct.findById(tempProductId);

    if (!temp_product) {
      const error = new HttpError("not find temp_product for id.", 404);
      return next(error);
    }

    await temp_product.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete temp_product.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted temp_product." });
};
// Auth &&Admin check

const deleteAllTempProduct = async (req, res, next) => {
  let countTempProduct;
  try {
    countTempProduct = await TempProduct.deleteMany({});
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
exports.deleteOneTempProduct = deleteOneTempProduct;
exports.deleteAllTempProduct = deleteAllTempProduct;
