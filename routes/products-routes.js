/** @format */
const express = require("express");

const auth = require("../middleware/auth");
const productsControllers = require("../controllers/products-controllers");

const router = express.Router();

router.get("/", auth, productsControllers.getProducts);

router.post("/", auth, productsControllers.createProduct);

router.get("/:pid", auth, productsControllers.getProductById);

router.patch("/", auth, productsControllers.updateProduct);

router.delete("/:pid", auth, productsControllers.deleteProduct);

router.post("/note", auth, productsControllers.createNotification);

module.exports = router;
