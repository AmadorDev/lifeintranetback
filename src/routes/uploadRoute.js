const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const { storeImages, storeDocs } = require("../controllers/uploadController");
const { upload } = require("../utils/uploadImages");
const { uploadDocs } = require("../utils/uploadDocs");

router.post("/images", storeImages);
router.post("/docs", storeDocs);
module.exports = router;
