const fs = require("fs");
const path = require("path");

const deleteFile = async (files) => {
  const ruta = path.join(__dirname, `../public/${process.env.FILES_CATE}`);
  try {
    for (f of files) {
      fs.unlinkSync(`${ruta}/${f.name}`);
    }
  } catch (err) {}
};
module.exports = { deleteFile };
