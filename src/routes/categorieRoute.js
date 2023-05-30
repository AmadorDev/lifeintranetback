const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const {
  store,
  list,
  active,
  update,
  show,
} = require("../controllers/categoryController");

router.get("/", list);
router.get("/:slug", show);
router.post("/", authenticateJWT, store);
router.put("/:id", active);
router.post("/:id/edit", update);
module.exports = router;
