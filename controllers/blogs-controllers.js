/** @format */

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

const createBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    publisher,
    date,
    image,
    images,
    title,
    description,
    content,
    tags,
    creator,
  } = req.body;

  const createdBlog = new Blog({
    publisher,
    date,
    image,
    images,
    title,
    description,
    content,
    tags,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating blog failed, please try again", 560);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  try {
    await createdBlog.save();
  } catch (err) {
    const error = new HttpError("Creating blog failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ blog: createdBlog });
};

const createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    blog_id,
    commenter_id,
    commenter_image,
    commenter_name,
    comment,
    date,
  } = req.body;
  const createdComment = new Comment({
    commenter_id,
    commenter_image,
    commenter_name,
    blog_id,
    comment,
    date,
    replies: [],
  });

  let user;
  try {
    user = await User.findById(commenter_id);
  } catch (err) {
    const error = new HttpError("Creating blog failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  let blog;
  try {
    blog = await Blog.findById(blog_id);
  } catch (err) {
    const error = new HttpError("Creating blog failed, please try again", 500);
    return next(error);
  }

  if (!blog) {
    const error = new HttpError("Could not find blog for provided id", 404);
    return next(error);
  }

  try {
    await createdComment.save();
  } catch (err) {
    const error = new HttpError(
      "Creating comment failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ comment: createdComment });
};

const createReply = async (req, res, next) => {
  const comment_id = req.params.cid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    blog_id,
    commenter_id,
    commenter_image,
    commenter_name,
    comment,
    date,
  } = req.body;
  const createdComment = new Comment({
    commenter_id,
    commenter_image,
    commenter_name,
    blog_id,
    comment,
    date,
    replies: [],
  });

  let user;
  try {
    user = await User.findById(commenter_id);
  } catch (err) {
    const error = new HttpError("Creating blog failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  let blog;
  try {
    blog = await Blog.findById(blog_id);
  } catch (err) {
    const error = new HttpError("Creating blog failed, please try again", 500);
    return next(error);
  }

  if (!blog) {
    const error = new HttpError("Could not find blog for provided id", 404);
    return next(error);
  }

  let _comment;
  try {
    _comment = await Comment.findById(comment_id);
  } catch (err) {
    const error = new HttpError("Creating reply failed, please try again", 500);
    return next(error);
  }

  if (!_comment) {
    const error = new HttpError("Could not find comment for provided id", 404);
    return next(error);
  }

  try {
    await _comment.replies.push(createdComment);
    await _comment.save();
  } catch (err) {
    const error = new HttpError(
      "Creating reply failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ comment: _comment });
};

const getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.body.id);

    if (!comment) {
      comment = "jrn";
    }
    res.status(201).json({ comment: comment });
  } catch (error) {
    res.status(400).json({ comment: "t" });
  }
};

exports.createBlog = createBlog;
exports.createComment = createComment;
exports.createReply = createReply;
exports.getComment = getComment;
