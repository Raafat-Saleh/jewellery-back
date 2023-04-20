/** @format */

const express = require("express");
const auth = require("../middleware/auth");

const reportsControllers = require("../controllers/reports-controllers");

const router = express.Router();

router.get("/", auth, reportsControllers.getReports);
router.post("/:id", auth, reportsControllers.makeReport);
router.post("/notifaction/:id", auth, reportsControllers.createNotification);

module.exports = router;
