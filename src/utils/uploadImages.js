const multer = require("multer");
const path = require("path");

const type_valid_ext = [
  { type: "image/jpg", ext: ".jpg" },
  {
    type: "image/jpeg",
    ext: ".jpeg",
  },
  {
    type: "image/png",
    ext: ".png",
  },
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, `../public/${process.env.UP_IMG_RUTA}`));
  },
  filename: function (req, file, cb) {
    const typeF = type_valid_ext.find(
      (element) => element.type === file.mimetype
    );
    cb(null, `${Date.now()}${typeF.ext}`);
  },
});

const type_valid = ["image/jpg", "image/jpeg", "image/png"];
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (type_valid.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },

  limits: { fileSize: parseInt(process.env.UP_IMG_LIMIT) },
});
module.exports = {
  upload,
};
