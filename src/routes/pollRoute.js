const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const { store ,list, destroy,update} = require("../controllers/pollController");


router.get("/", authenticateJWT, list);
router.post("/add", authenticateJWT, store);
router.delete("/delete/:id", authenticateJWT, destroy);
router.put("/update/:id", authenticateJWT, update);

module.exports = router;
