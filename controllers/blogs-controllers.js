/** @format */

const HttpError = require("../models/http-error");
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

const createBlog = async (req, res, next) => {
  const createdBlog = new Blog(req.body);
  try {
    await createdBlog.save();
  } catch (err) {
    const error = new HttpError("Creating blog failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ blog: createdBlog });
};

/////------------------//////
const makeComment = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.bid,
    });
    if (!blog) {
      return res.status(404).send("blog not found");
    }

    const comment = new Comment({
      ...req.body,
      blog_id: req.params.bid,
      user: req.user._id,
    });

    await comment.save();
    res.status(201).send({ comment });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const makeReply = async (req, res, next) => {
  try {
    const reply = new Comment({
      ...req.body,
      user: req.user._id,
      parent: req.params.cid,
    });

    const comment = await Comment.updateOne(
      { _id: req.params.cid },
      { $push: { replies: reply._id } }
    );

    if (!comment.n) {
      return res.status(404).send("comment not found");
    }

    await reply.save();
    res.status(201).send({ reply: reply });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.cid,
      user: req.user._id,
    });

    if (!comment) {
      return res.status(404).send("comment not found");
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ["comment", "date"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    updates.forEach((update) => (comment[update] = req.body[update]));
    await comment.save();
    res.status(200).json({ comment: comment });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
    });

    if (!blog) {
      return res.status(404).send("No blog is found");
    }

    await blog
      .populate("comments")
      .populate({ path: "user", select: "firstName lastName store avatar" })
      .execPopulate();
    res.send({ blog: blog, comments: blog.comments });
  } catch (e) {
    res.status(500).send();
  }
};

const deleteComment = async (req, res, next) => {
  let comment;
  try {
    comment = await Comment.findOneAndDelete({
      _id: req.params.cid,
      user: req.user._id,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }

  if (!comment) {
    res.status(404).send("comment not found");
  }

  /////
  if (!comment.replies.length < 1) {
    await Comment.deleteMany({ _id: { $in: comment.replies } });
  }

  if (comment.parent) {
    await Comment.updateOne(
      { _id: comment.parent },
      { $pullAll: { replies: [req.params.cid] } }
    );
  }

  res.status(200).json({ message: "Deleted comment." });
};

exports.createBlog = createBlog;

exports.makeComment = makeComment;
exports.makeReply = makeReply;
exports.editComment = editComment;
exports.getBlog = getBlog;
exports.deleteComment = deleteComment;
