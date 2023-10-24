const express = require("express");

const router = express.Router();
const { authenticateJWT } = require("../middlewares/auth");



const { check, oneOf,body } = require('express-validator');


const {
  sigin,
  store,
  storeAll,
  list,
  getPerfil,
  profile,
  closeLogin,
  query,
  loginApi,
  getMe,
  attendance,
  attendanceStore,
  FriendStore,
  FriendList,
  FriendListEx,
  FriendRemove,
  FriendVerify,
  validateId,
  converPage,
  HappyBirtday,
  updateUser,
  ContactEmergencyAdd,
  ContactEmergency,
  CertificateAdd,
  CertificateByUser,
  getIdByName,
  devAll,
} = require("../controllers/userController");
const { upload } = require("../utils/uploads");

router.get("/dev-users", devAll);
router.get("/", authenticateJWT, getMe);
router.get("/list", list);
router.post("/search-name/", getIdByName);
router.get("/list/:q", query);
router.get("/detail/:id", getPerfil);
router.get("/hbs", HappyBirtday);

router.get("/up", updateUser);

router.post("/sigin", loginApi);
router.post("/store", store);
router.post("/storeall", storeAll);
router.post("/upload/:id", authenticateJWT, upload, profile);
router.post("/logout/:id", closeLogin);
router.get("/validateobjects/:ObjectId", validateId);

router.post("/coverpage", authenticateJWT, converPage);

// asistencia
router.get("/attendance", authenticateJWT, attendance);
router.post("/attendance", authenticateJWT, attendanceStore);

// friends
router.post("/friends", authenticateJWT, FriendStore);
router.get("/friends", authenticateJWT, FriendList);
router.get("/friends/:id", FriendListEx);
router.delete("/friends/:id", authenticateJWT, FriendRemove);
router.post("/friends/verify/:id", authenticateJWT, FriendVerify);
// -----

router.get("/dev", (req, res, next) => {
  const entornos = [
    { env: `${process.env.NODE_ENV}` },
    { limitImg: `${process.env.UP_DOCS_LIMIT}` },
    { limitDocs: `${process.env.UP_IMG_LIMIT}` },
  ];
  res.json(entornos);
});


//contact emergency
router.get("/emergency", authenticateJWT, ContactEmergency);
//store contact emergency
router.post("/emergency/add",oneOf([
 [ body('phone').notEmpty().isNumeric().isLength(1,10).withMessage('required'),
  body('name').notEmpty().isLength(1,20).withMessage('required'),]
]), authenticateJWT, ContactEmergencyAdd);


//cetificates
router.post("/certificates/add", 
   authenticateJWT, CertificateAdd);

router.get("/certificates/:userId", 
   authenticateJWT, CertificateByUser);

module.exports = router;
