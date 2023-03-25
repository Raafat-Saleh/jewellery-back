/** @format */

const express = require("express");
const auth = require("../middleware/auth");

const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

router.get("/me", auth, usersController.getMe);

router.patch("/me", auth, usersController.updateUser);

router.delete("/me", auth, usersController.deleteUser);

router.post("/logout", auth, usersController.logout);

router.post("/logoutAll", auth, usersController.logoutAll);

router.get("/:id", usersController.getUser);

//surveys  (rate -- opinion)
router.post("/survey", auth, usersController.makeSurvey);

router.get("/surveys", usersController.getSurveys);

module.exports = router;
