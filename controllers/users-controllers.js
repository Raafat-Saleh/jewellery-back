/** @format */

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Product = require("../models/product");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-isAdmin");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(200).send({ users: users });
};

const signup = async (req, res, next) => {
  const user = new User(req.body);

  if (!user.avatar) {
    user.avatar = user.gender == "male" ? "a.jpg" : "b.jpg";
  }
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    if (!user) {
      const error = new HttpError("No user Found", 500);
      return next(error);
    }
    res.send({ user, token });
  } catch (e) {
    const error = new HttpError(e.message, 400);
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["firstName", "email", "gender", "avatar", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    if (!req.user.avatar) {
      req.user.avatar = req.user.gender == "male" ? "a.jpg" : "b.jpg";
    }
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).send("No user is found to delete");
    }
    // await req.user.remove()
    res.status(200).send("Deleted Successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const logout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.status(200).send("Signed out");
  } catch (e) {
    res.status(500).send(e);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Signed out from all devices");
  } catch (e) {
    res.status(500).send(e);
  }
};

const getMe = async (req, res, next) => {
  // res.send(req.user)
  try {
    const products = await Product.find({
      creator: req.user._id,
    });
    res.status(200).send({ profile: req.user, products: products });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) {
      return res.status(404).send("No user is found");
    }

    await user.populate("products").execPopulate();
    res.send({ user: user, products: user.products });
  } catch (e) {
    res.status(500).send();
  }
  // const products = await Product.find({
  //   creator: req.params.id,
  // });
  // res.send(req.user)
};

//------------------------------------------------survey (rate-opinion)------------------------//
const makeSurvey = async (req, res, next) => {
  const { rate, opinion } = req.body;
  req.user.rate = rate;
  req.user.opinion = opinion;
  try {
    await req.user.save();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  res.status(200).json({
    message: `rate :${req.user.rate} && opinion :${req.user.opinion} was added`,
  });
};

//------------------------------------------------All_surveys rate>2--------------------------//
const getSurveys = async (req, res, next) => {
  console.log("surveyUsers");

  // try {
  // let surveyUsers;
  // surveyUsers = await User.find({}, "firstName avatar rate opinion");
  console.log("surveyUsers");
  next();
  // } catch (err) {
  //   const error = new HttpError(
  //     "Fetching surveys failed, please try again later.",
  //     500
  //   );
  //   return next(error);
  // }
  // res.json({ users: "users" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.getMe = getMe;
exports.deleteUser = deleteUser;
exports.logout = logout;
exports.logoutAll = logoutAll;
exports.getUser = getUser;

exports.makeSurvey = makeSurvey;
exports.getSurveys = getSurveys;
