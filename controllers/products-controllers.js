/** @format */
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Product = require("../models/product");
const User = require("../models/user");

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.pid });

    if (!product) {
      return res
        .status(404)
        .send("Could not find a product for the provided id.");
    }
    res.json({ product: product });
  } catch (e) {
    res.status(500).send("Something went wrong, could not find a product.");
  }

  //--------------------------------------------product.Views+1---------------------------------------
};

//------------------admin-----------------
///ADD-edit
const createProduct = async (req, res, next) => {
  if (JSON.stringify(req.body._id)) {
    return res.status(500).send({ error: "Invalid updates! can not send _id" });
  }

  const createdProduct = new Product(req.body);
  try {
    await createdProduct.save();
    res.status(201).json({ product: createdProduct });
  } catch (e) {
    res.status(400).send(e);
  }
};

const updateProduct = async (req, res, next) => {
  if (JSON.stringify(req.body._id)) {
    return res.status(500).send({ error: "Invalid updates! can not send _id" });
  }

  try {
    const product = await Product.findOne({ _id: req.body.old_product_id });

    if (!product) {
      return res.status(404).send();
    }

    const updates = Object.keys(req.body);
    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();
    res.status(200).json({ product: product });
  } catch (e) {
    res.status(400).send(e);
  }
};

const createNotification = async (req, res, next) => {
  try {
    let my_object = {};
    my_object.message = "stack";
    my_object.title = "20"; ////ID_temp_product

    const user = await User.findById(req.body.creator);
    user.notification.push(my_object);
    await user.save();
    res.status(201).json({ user: user });
  } catch (e) {
    res.status(400).send(e);
  }
};
///ADD-edit

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.pid });

    if (!product) {
      res.status(404).send();
    }
    res.status(200).json({ message: "Deleted product." });
  } catch (e) {
    res.status(500).send();
  }
};

const getProducts = async (req, res, next) => {
  const products = await Product.find({});
  res.json({
    products: products.map((product) => product),
  });
};

exports.getProductById = getProductById;
exports.getProducts = getProducts;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.createNotification = createNotification;
