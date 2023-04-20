/** @format */

const express = require("express");
const auth = require("../middleware/auth");

const tempblogsControllers = require("../controllers/temp-blogs-controllers");

const router = express.Router();

router.post("/", auth, tempblogsControllers.createTempBlog);
router.get("/add", auth, tempblogsControllers.getTempBlogsForAdd);

router.patch("/:id", auth, tempblogsControllers.updateTempBlog);
router.get("/edit", auth, tempblogsControllers.getTempblogsForEdit);

router.delete(
  "/user/:id",
  auth,
  tempblogsControllers.deleteAllTempBlogForOneUser
);
router.delete("/:id", auth, tempblogsControllers.deleteOneTempBlog);

module.exports = router;
