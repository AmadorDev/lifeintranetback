const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const {
  store,
  xUser,
  includeDosUsers,
  getDetalleCov,
  cnvPersonaliza,
} = require("../controllers/conversationController");

router.post("/store", store);
router.get("/:userId", xUser);
router.get("/detalle/:id", getDetalleCov);
router.get("/find/:firstUserId/:secondUserId", includeDosUsers);
router.get("/perszd/:userId", cnvPersonaliza);

module.exports = router;
