/** @format */

const express = require("express");
const { check } = require("express-validator");

const blogsControllers = require("../controllers/blogs-controllers");

const router = express.Router();

router.post(
  "/",
  [
    check("publisher").not().isEmpty(),
    check("date").isLength({ min: 5 }),
    check("image").not().isEmpty(),
    check("images").not().isEmpty(),
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
    check("content").not().isEmpty(),
    check("tags").not().isEmpty(),
    check("creator").not().isEmpty(),
  ],
  blogsControllers.createBlog
);
router.post(
  "/comment",
  [
    check("commenter_id").not().isEmpty(),
    check("blog_id").not().isEmpty(),
    check("commenter_image"),
    check("commenter_name").not().isEmpty(),
    check("comment").not().isEmpty(),
    check("date").not().isEmpty(),
  ],
  blogsControllers.createComment
);

router.post(
  "/reply/:cid",
  [
    check("commenter_id").not().isEmpty(),
    check("blog_id").not().isEmpty(),
    check("commenter_image"),
    check("commenter_name").not().isEmpty(),
    check("comment").not().isEmpty(),
    check("date").not().isEmpty(),
  ],
  blogsControllers.createReply
);

router.get("/getcomment", blogsControllers.getComment);
module.exports = router;
