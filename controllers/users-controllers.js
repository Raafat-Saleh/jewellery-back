/** @format */

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Product = require("../models/product");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req); //validation
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let {
    first_name,
    last_name,
    email,
    password,
    sex,
    phone,
    country,
    city,
    street,
    image,
    account_type,
    admin,
  } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }
  // if user do not send image
  if (!image) {
    image = sex == "male" ? "a.jpg" : "b.jpg";
  }

  const createdUser = new User({
    first_name,
    last_name,
    email,
    image,
    password,
    sex,
    phone,
    country,
    city,
    street,
    products: [],
    account_type,
    admin,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  let {
    first_name,
    last_name,
    email,
    password,
    sex,
    phone,
    country,
    city,
    street,
    image,
    account_type,
    admin,
  } = req.body;

  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Wrong user id, could not update user.", 500);
    return next(error);
  }
  // if user do not send image
  if (!image) {
    image = sex == "male" ? "a.jpg" : "b.jpg";
  }

  user.first_name = first_name;
  user.last_name = last_name;
  user.email = email;
  user.password = password;
  user.phone = phone;
  user.country = country;
  user.city = city;
  user.street = street;
  user.image = image;

  user.account_type = account_type; ///////
  user.admin = admin; //////

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
  //delete user
  const userId = req.params.uid;

  User.findByIdAndDelete(userId)
    .then((user) => {
      if (!user) {
        const error = new HttpError("User was not found", 404);
        return next(error);
      } else {
        //delete user products
        Product.deleteMany({ creator: userId })
          .then((data) => {
            res.json({
              message: `User was deleted successfully and ${data.deletedCount} products were deleted successfully`,
            });
          })
          .catch((err) => {
            const error = new HttpError(
              "Some error occurred while removing all products",
              500
            );
            return next(error);
          });
        //
      }
    })
    .catch((err) => {
      const error = new HttpError(
        "Delete user was failed, please try again later",
        500
      );
      return next(error);
    });
};

//------------------------------------------------survey (rate-opinion)------------------------//
const makeSurvey = async (req, res, next) => {
  const errors = validationResult(req); //validation
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { rate, opinion } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Wrong user id, could not find the user.", 500);
    return next(error);
  }
  user.rate = rate;
  user.opinion = opinion;
  try {
    await user.save();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  res.status(200).json({
    message: `rate :${rate} && opinion :${opinion} was added to id: ${userId}`,
  });
};

//------------------------------------------------All_surveys rate>2--------------------------//
const getSurveys = async (req, res, next) => {
  let users;
  try {
    users = await User.find(
      { rate: { $gte: 2 } },
      "first_name image rate opinion"
    );
  } catch (err) {
    const error = new HttpError(
      "Fetching surveys failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.makeSurvey = makeSurvey;
exports.getSurveys = getSurveys;
