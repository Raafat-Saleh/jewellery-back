/** @format */

const express = require("express");
const auth = require("../middleware/auth");

const blogsControllers = require("../controllers/blogs-controllers");

const router = express.Router();

router.post("/", blogsControllers.createBlog);
router.get("/:id", blogsControllers.getBlog);

router.post("/:bid", auth, blogsControllers.makeComment);
router.post("/comment/:cid", auth, blogsControllers.makeReply);
router.patch("/comment/:cid", auth, blogsControllers.editComment);
router.delete("/comment/:cid", auth, blogsControllers.deleteComment);

module.exports = router;
