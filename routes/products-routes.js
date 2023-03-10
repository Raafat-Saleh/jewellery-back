/** @format */

const express = require("express");
const { check } = require("express-validator");

const productsControllers = require("../controllers/products-controllers");

const router = express.Router();

router.get("/:pid", productsControllers.getProductById);

router.get("/user/:uid", productsControllers.getProductsByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("image1").not().isEmpty(),
    check("image2").not().isEmpty(),
    check("image3").not().isEmpty(),
    check("image4").not().isEmpty(),
    check("price").not().isEmpty(),
    check("tags").not().isEmpty(),
    check("category").not().isEmpty(),
    check("model").not().isEmpty(),
    check("seller").not().isEmpty(),
  ],
  productsControllers.createProduct
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("image1").not().isEmpty(),
    check("image2").not().isEmpty(),
    check("image3").not().isEmpty(),
    check("image4").not().isEmpty(),
    check("price").not().isEmpty(),
    check("tags").not().isEmpty(),
    check("category").not().isEmpty(),
    check("model").not().isEmpty(),
    check("seller").not().isEmpty(),
  ],
  productsControllers.updateProduct
);

router.delete("/:pid", productsControllers.deleteProduct);
module.exports = router;
