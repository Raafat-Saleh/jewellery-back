/** @format */

const Product = require("../models/product");
const TempProduct = require("../models/temp-product");
const User = require("../models/user");

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.pid });

    if (!product) {
      return res
        .status(404)
        .send("Could not find a product for the provided id.");
    }
    product.views += 1;
    await product.save();
    res.json({ product: product });
  } catch (e) {
    res.status(500).send("Something went wrong, could not find a product.");
  }
};

const createProduct = async (req, res, next) => {
  try {
    let id = req.body._id;
    delete req.body._id;
    const createdProduct = new Product(req.body);

    if (id) {
      // if there are issue in save product dont remove temp
      const tempProduct = await TempProduct.findById(id);
      if (!tempProduct) {
        return res.status(404).send("No temp product is found");
      }
      await createdProduct.save();
      await tempProduct.remove();
    } else {
      await createdProduct.save();
    }

    res.status(201).json({ product: createdProduct });
  } catch (e) {
    res.status(400).send(e);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.body.old_product_id,
      creator: req.body.creator,
    });

    if (!product) {
      return res.status(404).send();
    }

    let id = req.body._id;
    delete req.body._id;
    delete req.body.old_product_id;
    delete req.body.creator;

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

    updates.forEach((update) => (product[update] = req.body[update]));

    if (id) {
      const tempProduct = await TempProduct.findById(id);
      if (!tempProduct) {
        return res.status(404).send("No temp product is found");
      }
      await product.save();
      await tempProduct.remove();
    } else {
      await product.save();
    }

    res.status(200).json({ product: product });
  } catch (e) {
    res.status(400).send(e);
  }
};

const createNotification = async (req, res, next) => {
  try {
    let my_object = {};
    my_object.message = "stack";
    my_object.title = "stack";
    my_object.ID_temp_product = "123";
    const user = await User.findById(req.body.creator);
    if (!user) {
      return res.status(404).send("No user is found");
    }
    user.notification.push(my_object);
    await user.save();
    res.status(201).json({ user: user });
  } catch (e) {
    res.status(400).send(e);
  }
};

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
