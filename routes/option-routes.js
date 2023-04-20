/** @format */

const express = require("express");
const auth = require("../middleware/auth");
const optionController = require("../controllers/option-controllers");
const router = express.Router();

router.post("/", optionController.createOption);
router.get("/", optionController.getOptions);

router.patch("/:id", optionController.updateOption);
router.delete("/:id", optionController.deleteOption);

router.post("/main/:id", optionController.make_MainOption);
router.get("/main", optionController.getMainOption);

module.exports = router;
