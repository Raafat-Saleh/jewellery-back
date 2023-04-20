/** @format */

const fs = require("fs");
const path = require("path");
var full_path = path.resolve(__dirname, "../models/main-option.json");

const Option = require("../models/option");
const mainOptionID = require("../models/main-option.json").main_option._id;

// check all routes for admin
const createOption = async (req, res, next) => {
  try {
    const createdOption = new Option(req.body);
    await createdOption.save();

    res.status(201).json({ option: createdOption });
  } catch (e) {
    res.status(400).send(e);
  }
};

const updateOption = async (req, res, next) => {
  try {
    const option = await Option.findOne({ _id: req.params.id });

    if (!option) {
      return res.status(404).send();
    }

    const updates = Object.keys(req.body);
    updates.forEach((update) => (option[update] = req.body[update]));
    await option.save();
    res.status(200).json({ option: option });
  } catch (e) {
    res.status(400).send(e);
  }
};

const deleteOption = async (req, res, next) => {
  try {
    const option = await Option.findOneAndDelete({ _id: req.params.id });

    if (!option) {
      res.status(404).send();
    }
    res.status(200).json({ message: "Deleted option." });
  } catch (e) {
    res.status(500).send();
  }
};

const getOptions = async (req, res, next) => {
  const option = await Option.find({});
  res.json({
    option: option.map((option) => option),
  });
};

const make_MainOption = async (req, res, next) => {
  try {
    const option = await Option.findOne({ _id: req.params.id }); //
    if (!option) {
      return res.status(404).send();
    }

    var json_file = JSON.parse(fs.readFileSync(full_path).toString());
    json_file.main_option = option;
    fs.writeFileSync(full_path, JSON.stringify(json_file));

    res.status(200).send({ option: option });
  } catch (e) {
    res.status(400).send(e);
  }
};

const getMainOption = async (req, res, next) => {
  try {
    const option = await Option.findOne({ _id: mainOptionID });
    if (!option) {
      return res.status(404).send("select main option");
    }
    res.json({ option: option });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.createOption = createOption;
exports.updateOption = updateOption;
exports.getOptions = getOptions;
exports.deleteOption = deleteOption;

exports.make_MainOption = make_MainOption;
exports.getMainOption = getMainOption;
