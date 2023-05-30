const { getResponse } = require("../utils/response");
const { upload } = require("../utils/uploadImages");
const { uploadDocs } = require("../utils/uploadDocs");

const uploadImgs = upload.single("imgs");
const storeImages = async (req, res, next) => {
  uploadImgs(req, res, function (err) {
    if (err) return getResponse(res, { code: 500, data: err.message });
    let ruta = `${process.env.PATH_HOST}/${process.env.UP_IMG_RUTA}/${req.file.filename}`;
    getResponse(res, { code: 200, data: ruta });
  });
};

const uploadSingleDocs = uploadDocs.array("docs", 2);
const storeDocs = async (req, res, next) => {
  uploadSingleDocs(req, res, function (err) {
    if (err) return getResponse(res, { code: 500, data: err.message });
    let ruta = `${process.env.PATH_HOST}/${process.env.UP_DOCS_RUTA}/${req.files[0].filename}`;
    getResponse(res, { code: 200, data: ruta });
  });
};

module.exports = {
  storeImages,
  storeDocs,
};
