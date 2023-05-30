const { User, Poll } = require("../models");
const { getResponse } = require("../utils/response");

const store = async (req, res) => {
  try {
    const { title, link, type } = req.body;

    const obj = await Poll.create({
      UserId: req.user._id,
      title: title,
      link: link,
      type_poll: type,
    });
    return getResponse(res, { code: 200, data: obj });
  } catch (error) {
    return getResponse(res, { code: 500, data: error });
  }
};
const list = async (req, res) => {
  console.log(req.query.page);
  console.log(req.query.q);
  let type={}
  if(req.query.q){
     type = {
      type_poll:req.query.q
    }
  }
  
  try {
    const options = {
      page: req.query.page || 1,
      limit: 10,
      collation: {
        locale: "es",
      },
    };
    const obj = await Poll.paginate(type, options);
    return getResponse(res, { code: 200, data: obj });
  } catch (error) {
    console.log(error);
    return getResponse(res, { code: 500, data: error });
  }
};

const update = async (req, res) => {
  try {
    const obj = await Poll.findOneAndUpdate({ _id: req.params.id },
      {
        title:req.body.title,
        link:req.body.link,
        type_poll:req.body.type,

      }
      );
    return getResponse(res, { code: 200, data: obj });
  } catch (error) {
    return getResponse(res, { code: 500, data: error });
  }
};

const destroy = async (req, res) => {
  try {
    const obj = await Poll.findOneAndRemove({ _id: req.params.id });
    return getResponse(res, { code: 200, data: obj });
  } catch (error) {
    return getResponse(res, { code: 500, data: error });
  }
};

function isUrl(s) {
  var regexp =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}
module.exports = { store, list, destroy ,update};
