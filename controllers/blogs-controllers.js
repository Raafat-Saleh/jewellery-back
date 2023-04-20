/** @format */

const Blog = require("../models/blog");
const TempBlog = require("../models/temp-blog");
const User = require("../models/user");

const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id });

    if (!blog) {
      return res.status(404).send("Could not find a blog for the provided id.");
    }
    blog.views += 1;
    await blog.save();

    await blog
      .populate("comments")
      .populate({ path: "user", select: "firstName lastName store avatar" })
      .execPopulate();

    res.json({ blog: blog, comments: blog.comments });
  } catch (e) {
    res.status(500).send("Something went wrong, could not find a blog.");
  }
};

const createBlog = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).send("No user is found");
    }

    let id = req.body._id;
    delete req.body._id;

    const createdBlog = new Blog(req.body);

    if (id) {
      const tempBlog = await TempBlog.findById(id);
      if (!tempBlog) {
        return res.status(404).send("No temp blog is found");
      }
      await createdBlog.save();
      await tempBlog.remove();
    } else {
      await createdBlog.save();
    }

    res.status(201).json({ blog: createdBlog });
  } catch (e) {
    res.status(400).send(e);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      _id: req.body.old_blog_id,
      user: req.body.user,
    });

    if (!blog) {
      return res.status(404).send();
    }

    let id = req.body._id;
    delete req.body._id;
    delete req.body.old_blog_id;
    delete req.body.user;
    delete req.body.method;
    delete req.body.__v;

    // dont allow delete all images or all tags at least one image and  one tag
    if (req.body.images) {
      if (req.body.images.length == 0) {
        delete req.body.images;
      }
    }
    if (req.body.tags) {
      if (req.body.tags.length == 0) {
        delete req.body.tags;
      }
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

    updates.forEach((update) => (blog[update] = req.body[update]));
    // may edit with no temp
    if (id) {
      const tempBlog = await TempBlog.findById(id);
      if (!tempBlog) {
        return res.status(404).send("No temp blog is found");
      }
      await blog.save();
      await tempBlog.remove();
    } else {
      await blog.save();
    }

    res.status(200).json({ blog: blog });
  } catch (e) {
    res.status(400).send(e);
  }
};

const createNotification = async (req, res, next) => {
  try {
    let my_object = {};
    my_object.message = "stack";
    my_object.title = "stack";
    my_object.tempBlogID = "123";
    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res.status(404).send("No user is found");
    }
    user.notification.push(my_object);
    await user.save();
    res.status(201).json({ user: user });
  } catch (e) {
    res.status(400).send(e);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!blog) {
      res.status(404).send();
    }
    res.status(200).json({ message: "Deleted blog." });
  } catch (e) {
    res.status(500).send();
  }
};

const getBlogs = async (req, res, next) => {
  const blogs = await Blog.find({});
  res.json({
    blogs: blogs.map((blog) => blog),
  });
};

exports.getBlogById = getBlogById;
exports.getBlogs = getBlogs;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
exports.createNotification = createNotification;
