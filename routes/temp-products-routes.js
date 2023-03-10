/** @format */

const express = require("express");
const { check } = require("express-validator");

const tempProductsControllers = require("../controllers/temp-products-controllers");

const router = express.Router();

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
  tempProductsControllers.createTempProduct
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
  tempProductsControllers.updateTempProduct
);

router.get("/", tempProductsControllers.getTempProducts);
router.delete("/one/:pid", tempProductsControllers.deleteOneTempProduct);
router.delete("/all", tempProductsControllers.deleteAllTempProduct);

module.exports = router;
