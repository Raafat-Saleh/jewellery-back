/** @format */

const HttpError = require("../models/http-error");
const Blog = require("../models/blog");
const TempBlog = require("../models/temp-blog");

const createTempBlog = async (req, res, next) => {
  if (req.user.accountType == "seller") {
    const createdTempBlog = new TempBlog({
      ...req.body,
      method: "add",
      user: req.user._id,
    });
    try {
      await createdTempBlog.save();
      res.status(201).json({
        message: "Under review thanks!",
        createdTempBlog: createdTempBlog,
      });
    } catch (err) {
      res.status(500).json({ message: "Creating temp_blog failed" });
    }
  } else {
    res.status(500).json({ message: "Not Allowed." });
  }
};

//Admin
const getTempBlogsForAdd = async (req, res, next) => {
  try {
    const temp_blogs = await TempBlog.find({ method: "add" });
    res.json({
      temp_blogs: temp_blogs,
    });
  } catch (err) {
    const error = new HttpError("Fetching temp_blog failed", 500);
    return next(error);
  }
};

const updateTempBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!blog) {
      return res.status(404).send("blog not found");
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "description",
      "title",
      "image",
      "images",
      "content",
      "tags",
      "date",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    const createdTempBlogForEdit = new TempBlog({
      ...req.body,
      method: "edit",
      old_blog_id: req.params.id,
      user: req.user._id,
    });
    await createdTempBlogForEdit.save();
    res.status(200).json({
      message: "Under review thanks!",
      tempBlog: createdTempBlogForEdit,
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

//Admin
const getTempblogsForEdit = async (req, res, next) => {
  try {
    const temp_blogs = await TempBlog.find({ method: "edit" });
    res.json({
      temp_blogs: temp_blogs,
    });
  } catch (err) {
    const error = new HttpError("Fetching temp_blogs failed", 500);
    return next(error);
  }
};

const deleteOneTempBlog = async (req, res, next) => {
  const tempBlogId = req.params.id;
  try {
    const temp_blog = await TempBlog.findOneAndDelete({
      _id: tempBlogId,
      user: req.user._id,
    });

    if (!temp_blog) {
      res.status(404).send();
    }

    res
      .status(200)
      .json({ message: "Deleted temp_blog.", temp_blog: temp_blog });
  } catch (err) {
    res.status(500).send();
  }
};

// Admin
const deleteAllTempBlogForOneUser = async (req, res, next) => {
  let countTempBlog;
  try {
    countTempBlog = await TempBlog.deleteMany({
      user: req.params.id,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete All temp_blogs.",
      500
    );
    return next(error);
  }
  res.status(200).json({
    message: `Deleted ${countTempBlog.deletedCount} temp_blogs`,
  });
};

exports.createTempBlog = createTempBlog;
exports.getTempBlogsForAdd = getTempBlogsForAdd;

exports.updateTempBlog = updateTempBlog;
exports.getTempblogsForEdit = getTempblogsForEdit;

exports.deleteOneTempBlog = deleteOneTempBlog;
exports.deleteAllTempBlogForOneUser = deleteAllTempBlogForOneUser;
