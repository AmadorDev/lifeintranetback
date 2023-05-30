const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const {
  List,
  ListDocId,
  DowloadDoc,
  FileAll,
} = require("../controllers/documentsControllers");

router.get("/", authenticateJWT, List);
router.get("/:id", authenticateJWT, ListDocId);
router.get("/dowload/:id", authenticateJWT, DowloadDoc);


//fileAll
router.post("/fileall",authenticateJWT, FileAll);
module.exports = router;
