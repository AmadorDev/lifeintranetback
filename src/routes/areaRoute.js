const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const { store, list } = require("../controllers/areaController");

router.post("/", authenticateJWT, store);
router.get("/", authenticateJWT, list);

module.exports = router;
