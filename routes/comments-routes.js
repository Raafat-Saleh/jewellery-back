/** @format */

const express = require("express");
const auth = require("../middleware/auth");

const commentsControllers = require("../controllers/comments-controllers");

const router = express.Router();

router.post("/:bid", auth, commentsControllers.makeComment);
router.post("/reply/:cid", auth, commentsControllers.makeReply);
router.patch("/:cid", auth, commentsControllers.editComment);
router.delete("/:cid", auth, commentsControllers.deleteComment);

module.exports = router;
