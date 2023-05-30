const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const {
  store,
  list,
  countComments,
  liked,
  remove,
} = require("../controllers/commentController");

router.get("/:postId/count", countComments);
router.get("/:postId", list);
router.get("/:id/like", authenticateJWT, liked);
router.post("/:postId", authenticateJWT, store);
router.delete("/:id", authenticateJWT, remove);

module.exports = router;
