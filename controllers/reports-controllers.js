/** @format */

const Report = require("../models/report");
const User = require("../models/user");

const makeReport = async (req, res, next) => {
  try {
    const report = new Report({
      text: req.body.text,
      comment: req.params.id,
      reporter: req.user._id,
    });

    await report.save();
    res.status(201).send({ report });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

// admin
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find({});
    res.send({ reports: reports });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

//admin
const createNotification = async (req, res, next) => {
  try {
    let my_object = {};
    my_object.message = "aaaaaaa";
    my_object.title = "bbbbbbb";
    my_object.commentID = "123";

    const user = await User.findById(req.params.id);
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

exports.makeReport = makeReport;
exports.getReports = getReports;
exports.createNotification = createNotification;
