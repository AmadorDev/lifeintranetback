const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, `../public/${process.env.UP_USER}`));
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/");
    cb(null, `${Date.now()}.${ext[1]}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },

  limits: { fileSize: parseInt(process.env.UP_USER_LIMIT) },
}).single("profile");
module.exports = {
  upload,
};
