/** @format */
const express = require("express");

const auth = require("../middleware/auth");
const binControllers = require("../controllers/bin-controllers");

const router = express.Router();

router.get("/user", auth, binControllers.getUser_bin_products);
router.get("/:id", auth, binControllers.getBinProductById);

router.post("/:id", auth, binControllers.createProductFromBin);

router.delete("/all/:id", auth, binControllers.deleteAllBinProductsForAdmin);
router.delete("/:id", auth, binControllers.deleteBinProduct);
router.delete("/user/bin", auth, binControllers.deleteAllBinProductsForUser);

module.exports = router;
