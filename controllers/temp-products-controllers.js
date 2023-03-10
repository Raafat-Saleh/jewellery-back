/** @format */

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Product = require("../models/product");
const TempProduct = require("../models/temp-product");

const createTempProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    title,
    description,
    image1,
    image2,
    image3,
    image4,
    price,
    stock,
    discount,
    end_date,
    tags,
    category,
    model,
    features,
    caliber,
    seller,
    creator,
  } = req.body;

  const createdTempProduct = new TempProduct({
    title,
    description,
    image1,
    image2,
    image3,
    image4,
    price,
    stock,
    discount,
    end_date,
    tags,
    category,
    model,
    features,
    caliber,
    seller,
    creator,
    method: "add",
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating temp_product failed, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  try {
    await createdTempProduct.save();
  } catch (err) {
    const error = new HttpError(
      "Creating temp_product failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Under review thanks!" });
};

const updateTempProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const productId = req.params.pid;

  const {
    title,
    description,
    image1,
    image2,
    image3,
    image4,
    price,
    stock,
    discount,
    end_date,
    tags,
    category,
    model,
    features,
    caliber,
    seller,
    creator,
  } = req.body;
  //------------------------------------ensure product existing-------------------------
  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Wrong product id, could not update product.",
      500
    );
    return next(error);
  }
  //---------------------------------create temp product---------------------------------
  const createdTempProductForEdit = new TempProduct({
    title,
    description,
    image1,
    image2,
    image3,
    image4,
    price,
    stock,
    discount,
    end_date,
    tags,
    category,
    model,
    features,
    caliber,
    seller,
    creator,
    method: "edit",
    old_product_id: productId,
  });
  //---------------------------------ensure user existing---------------------------------
  //------------------------------you need creator id for create new temp product---------
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Invalid creator id passed, Creating temp_product failed, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  try {
    await createdTempProductForEdit.save();
  } catch (err) {
    const error = new HttpError(
      "Creating temp_product failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Under review thanks!" });
};

/////another one for add
const getTempProducts = async (req, res, next) => {
  let temp_products;
  try {
    temp_products = await TempProduct.find({ method: "edit" });
  } catch (err) {
    const error = new HttpError(
      "Fetching temp_products failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    temp_products: temp_products.map((temp) =>
      temp.toObject({ getters: true })
    ),
  });
};

const deleteOneTempProduct = async (req, res, next) => {
  const tempProductId = req.params.pid;

  let temp_product;
  try {
    temp_product = await TempProduct.findById(tempProductId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete temp_product.",
      500
    );
    return next(error);
  }

  if (!temp_product) {
    const error = new HttpError(
      "Could not find temp_product for this id.",
      404
    );
    return next(error);
  }

  try {
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

/////one for send msg

exports.createTempProduct = createTempProduct;
exports.updateTempProduct = updateTempProduct;
exports.getTempProducts = getTempProducts;
exports.deleteOneTempProduct = deleteOneTempProduct;
exports.deleteAllTempProduct = deleteAllTempProduct;
