const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute");
const convRoute = require("./conversationRoute");
const messageRoute = require("./messageRoute");
const uploadRoute = require("./uploadRoute");

const postRoute = require("./postRoute");
const commentRoute = require("./commentRoute");
const categorieRoute = require("./categorieRoute");
const areaRoute = require("./areaRoute");

const DocRoute = require("./documentRoute");

const PollRoute = require("./pollRoute");
const managementRoute = require("./managementRoute");

router.use("/users", userRoute);
router.use("/conversations", convRoute);
router.use("/messages", messageRoute);
router.use("/uploads", uploadRoute);
router.use("/posts", postRoute);
router.use("/comments", commentRoute);
router.use("/areas", areaRoute);
router.use("/categories", categorieRoute);
router.use("/docs", DocRoute);
router.use("/polls", PollRoute);
router.use("/managements", managementRoute);


module.exports = router;
