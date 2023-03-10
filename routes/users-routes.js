/** @format */

const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  [
    check("first_name").isLength({ min: 3 }),
    check("last_name").isLength({ min: 3 }),
    check("email")
      .normalizeEmail() // test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
    check("sex").isLength({ min: 4 }),
    check("phone").isLength({ min: 6 }),
    check("country").isLength({ min: 3 }),
    check("city").isLength({ min: 3 }),
    check("street").isLength({ min: 3 }),
    check("account_type").isLength({ min: 3 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

//update_user
router.patch(
  "/:uid",
  [
    check("first_name").isLength({ min: 3 }),
    check("last_name").isLength({ min: 3 }),
    check("email")
      .normalizeEmail() // test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
    check("sex").isLength({ min: 4 }),
    check("phone").isLength({ min: 6 }),
    check("country").isLength({ min: 3 }),
    check("city").isLength({ min: 3 }),
    check("street").isLength({ min: 3 }),
    check("account_type").isLength({ min: 3 }),
  ],
  usersController.updateUser
);

router.delete("/:uid", usersController.deleteUser);

//make_survey (rate -- opinion)
router.post(
  "/survey/:uid",
  [check("rate").not().isEmpty(), check("opinion").not().isEmpty()],
  usersController.makeSurvey
);

//show all surveys
router.get("/surveys", usersController.getSurveys);

module.exports = router;
