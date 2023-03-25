/** @format */

const express = require("express");
const auth = require("../middleware/auth");

const tempProductsControllers = require("../controllers/temp-products-controllers");

const router = express.Router();

router.post("/", auth, tempProductsControllers.createTempProduct);
router.get("/add", auth, tempProductsControllers.getTempProductsForAdd);

router.patch("/:pid", auth, tempProductsControllers.updateTempProduct);

router.get("/edit", auth, tempProductsControllers.getTempProductsForEdit);
router.delete("/one/:pid", auth, tempProductsControllers.deleteOneTempProduct);
router.delete("/all", auth, tempProductsControllers.deleteAllTempProduct);

module.exports = router;
