const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const {
  store,
  storeAnswer,
  list,
  countComments,
  liked,
  remove,
  notificationUser,
} = require("../controllers/commentController");

router.get("/:postId/count", countComments);
router.get("/:postId", list);
router.get("/:id/like/:key?", authenticateJWT, liked);
router.post("/:postId", authenticateJWT, store);
router.post("/answer/:id", authenticateJWT, storeAnswer);
router.delete("/:id", authenticateJWT, remove);
router.get("/notifications/all", authenticateJWT, notificationUser);

module.exports = router;
