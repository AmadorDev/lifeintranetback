const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const {
  store,
  xconversationId,
  getMessagesxCov,
  messageRead,
  storeImages,
} = require("../controllers/messageController");

router.post("/store", store);
router.get("/:conversationId", xconversationId);
router.post("/:idconv/:userId", getMessagesxCov);
router.put("/upd/:id", messageRead);

module.exports = router;
