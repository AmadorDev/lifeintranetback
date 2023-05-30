const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const {
  sliderStore,
  sliders,
  sliderDestroyAll,
  videosX,
  videosXStore,
  videosXDestroy,
  videosFind,
  sliderSection,
  sliderDestroy,
} = require("../controllers/managementContorller");
//authenticateJWT

router.get("/sliders", sliders);
router.get("/sliders/:s", sliderSection);
router.post("/sliders", sliderStore);
router.delete("/sliders", sliderDestroyAll);
router.delete("/sliders/:id", sliderDestroy);

router.get("/videos/:s/:c", videosFind);
router.get("/videos", videosX);
router.post("/videos", videosXStore);
router.delete("/videos", videosXDestroy);
router.delete("/videos/:id", videosXDestroy);

module.exports = router;
