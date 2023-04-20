/** @format */

const TempProduct = require("../models/temp-product");
const User = require("../models/user");
const Draft = require("../models/draft");

const createDraft = async (req, res, next) => {
  if (req.user.accountType == "seller") {
    try {
      const createdDraft = new Draft({
        ...req.body,
        creator: req.user._id,
      });
      await createdDraft.save();
      res.status(201).json({ Draft: createdDraft });
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.status(500).json({ message: "Not Allowed." });
  }
};

const updateDraft = async (req, res, next) => {
  try {
    const draft = await Draft.findOne({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!draft) {
      return res.status(404).send();
    }

    const updates = Object.keys(req.body);

    const allowedUpdates = [
      "description",
      "title",
      "image1",
      "image2",
      "image3",
      "image4",
      "price",
      "stock",
      "discount",
      "end_date",
      "tags",
      "category",
      "model",
      "features",
      "caliber",
      "store",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    updates.forEach((update) => (draft[update] = req.body[update]));
    await draft.save();
    res.status(200).json({ draft: draft });
  } catch (e) {
    res.status(400).send(e);
  }
};

const getDraftById = async (req, res, next) => {
  try {
    const draft = await Draft.findOne({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!draft) {
      return res
        .status(404)
        .send("Could not find a draft for the provided id.");
    }
    res.json({ draft: draft });
  } catch (e) {
    res.status(500).send("Something went wrong, could not find a draft.");
  }
};

const getUser_draft_products = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user._id,
    });

    await user.populate("drafts").execPopulate();
    res.send({ drafts: user.drafts });
  } catch (e) {
    res.status(500).send();
  }
};

const deleteDraft = async (req, res, next) => {
  try {
    const draft = await Draft.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!draft) {
      res.status(404).send("No draft product is found to delete");
    }
    res.status(200).json({ message: "Deleted draft Successfully." });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const deleteAllDraftProductsForMy = async (req, res, next) => {
  try {
    const countDraftProduct = await Draft.deleteMany({
      creator: req.user._id,
    });
    res.status(200).json({
      message: `Deleted ${countDraftProduct.deletedCount} draft_products`,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// admin
const deleteAllDraftProductsForAllUser = async (req, res, next) => {
  try {
    const countDraftProduct = await Draft.deleteMany({});
    res.status(200).json({
      message: `Deleted ${countDraftProduct.deletedCount} draft_products`,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// for send to temp
const createTempProductFromDraft = async (req, res, next) => {
  try {
    const draft = await Draft.findById({
      _id: req.params.id,
      creator: req.user._id,
    });
    if (!draft) {
      return res.status(404).send("No draft product is found");
    }

    let obj = draft.toObject();
    delete obj._id;

    const createdTempProduct = new TempProduct({
      ...obj,
      method: "add",
    });
    await createdTempProduct.save();
    await draft.remove();
    res.status(201).json({
      message: "Under review thanks!",
      createdTempProduct: createdTempProduct,
    });
  } catch (err) {
    res.status(500).json({ message: "Creating temp_product failed" });
  }
};

exports.createDraft = createDraft;
exports.updateDraft = updateDraft;
exports.getDraftById = getDraftById;
exports.getUser_draft_products = getUser_draft_products;

exports.deleteDraft = deleteDraft;
exports.deleteAllDraftProductsForMy = deleteAllDraftProductsForMy;
exports.deleteAllDraftProductsForAllUser = deleteAllDraftProductsForAllUser;

exports.createTempProductFromDraft = createTempProductFromDraft;
