const { getResponse } = require("../utils/response");
const { Category } = require("../models");

function replaceSpace(txt) {
  let result = txt.replace(/\s+/g, "_");
  return result.toLowerCase();
}
const store = async (req, res, next) => {
  try {
    const { name } = req.body;
    const categorie = await Category.create({
      name: replaceSpace(name),
    });

    getResponse(res, { code: 200, data: categorie });
  } catch (error) {
    getResponse(res, { code: 500, data: error.errors });
  }
};

const show = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const categorie = await Category.find({ name: slug });
    getResponse(res, { code: 200, data: categorie });
  } catch (error) {
    getResponse(res, { code: 500, data: error.errors });
  }
};

// list
const list = async (req, res, next) => {
  let status = req.query.status;

  let query = {};
  if (status !== "") {
    query = { status: status };
  }
  try {
    const categories = await Category.find(query);
    getResponse(res, { code: 200, data: categories });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

// active/inactive
const active = async (req, res, next) => {
  try {
    const categories = await Category.findByIdAndUpdate(
      { _id: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    getResponse(res, { code: 200, data: categories });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

const update = async (req, res, next) => {
  try {
    const { name } = req.body;
    const existData = await Category.find({ name: name });
    if (existData.length === 0) {
      const categorie = await Category.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: replaceSpace(name),
        },
        { new: true }
      );

      getResponse(res, { code: 200, data: categorie });
    } else {
      getResponse(res, { code: 500, data: "unique" });
    }
  } catch (error) {
    getResponse(res, { code: 500, data: error.errors });
  }
};

module.exports = {
  store,
  list,
  active,
  update,
  show,
};
