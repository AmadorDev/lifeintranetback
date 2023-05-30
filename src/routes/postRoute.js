const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");
const {
  store,
  storeWithDocs,
  storeSimple,
  list,
  listwithPaginator,
  liked,
  usersLikeds,
  destroy,
} = require("../controllers/postController");

router.get("/", authenticateJWT, listwithPaginator);
router.post("/", authenticateJWT, store);
router.post("/docs", authenticateJWT, storeWithDocs);
router.post("/simple", authenticateJWT, storeSimple);
router.put("/:id/like", authenticateJWT, liked);
router.get("/:id/users/likeds", usersLikeds);
router.delete("/:id/destroy", destroy);

module.exports = router;
