/** @format */
const express = require("express");

const auth = require("../middleware/auth");
const draftControllers = require("../controllers/draft-controllers");

const router = express.Router();

router.post("/", auth, draftControllers.createDraft);

router.patch("/:id", auth, draftControllers.updateDraft);

router.get("/", auth, draftControllers.getUser_draft_products);

router.get("/:id", auth, draftControllers.getDraftById);

router.delete("/", auth, draftControllers.deleteAllDraftProductsForMy);
router.delete("/all", auth, draftControllers.deleteAllDraftProductsForAllUser);
router.delete("/:id", auth, draftControllers.deleteDraft);

router.post("/:id", auth, draftControllers.createTempProductFromDraft);

module.exports = router;
