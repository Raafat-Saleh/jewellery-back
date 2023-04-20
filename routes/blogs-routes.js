/** @format */
const express = require("express");

const auth = require("../middleware/auth");
const blogsControllers = require("../controllers/blogs-controllers");

const router = express.Router();

router.get("/", auth, blogsControllers.getBlogs);

router.post("/", auth, blogsControllers.createBlog);

router.get("/:id", auth, blogsControllers.getBlogById);

router.patch("/", auth, blogsControllers.updateBlog);

router.delete("/:id", auth, blogsControllers.deleteBlog);

router.post("/note", auth, blogsControllers.createNotification);

module.exports = router;
