/** @format */

const User = require("../models/user");

const mainOption = require("../models/main-option.json").main_option;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-isAdmin");
    res.status(200).send({ users: users });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const signup = async (req, res, next) => {
  try {
    const user = new User(req.body);

    if (!user.avatar) {
      user.avatar =
        user.gender == "male" ? mainOption.male_image : mainOption.female_image;
    }

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
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
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
    await req.user.remove();
    res.status(200).send(req.user);
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

    res.status(200).send("Log out");
  } catch (e) {
    res.status(500).send(e);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Log out from all devices");
  } catch (e) {
    res.status(500).send(e);
  }
};

const getMe = async (req, res, next) => {
  try {
    await req.user.populate("products").execPopulate();
    res.send({ user: req.user, products: req.user.products });
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
};

//------------------------------------------------survey (rate-opinion)------------------------//
const makeSurvey = async (req, res, next) => {
  try {
    const { rate, opinion } = req.body;
    req.user.rate = rate;
    req.user.opinion = opinion;

    await req.user.save();
    res.status(200).send(`rate && opinion was added`);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getSurveys = async (req, res, next) => {
  try {
    const users = await User.find(
      { rate: { $gte: 3 } },
      "firstName avatar rate opinion"
    );
    res.json({ users: users });
  } catch (err) {
    res.status(500).send(err);
  }
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
