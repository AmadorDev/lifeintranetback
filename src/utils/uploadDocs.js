const multer = require("multer");
const path = require("path");
const type_valid_ext = [
  { type: "application/pdf", ext: ".pdf" },
  {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ext: ".xlsx",
  },
  {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: ".docx",
  },
  {
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ext: ".pptx",
  },
];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, `../public/${process.env.UP_DOCS_RUTA}`));
  },
  filename: function (req, file, cb) {
    const typeF = type_valid_ext.find(
      (element) => element.type === file.mimetype
    );
    cb(null, `${Date.now()}${typeF.ext}`);
  },
});

const type_valid = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const uploadDocs = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (type_valid.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error(`${type_valid}`));
    }
  },

  limits: { fileSize: parseInt(process.env.UP_DOCS_LIMIT) },
});

//
// .single("docs");

module.exports = {
  uploadDocs,
};
