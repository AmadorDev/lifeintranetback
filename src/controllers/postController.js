const { getResponse } = require("../utils/response");
const { uploadPostImg } = require("../utils/postImgUploads");
const { uploadDocs } = require("../utils/postDocUploads");
const { Post, User, Area } = require("../models");

const { v4: uuidv4 } = require("uuid");

const uploadImg = uploadPostImg.array("postsImg", 5);
const store = async (req, res, next) => {
  uploadImg(req, res, async function (err) {
    if (err) return getResponse(res, { code: 500, data: err.message });
    let rutas = [];
    req.files.forEach((item) => {
      let ruta = `${process.env.PATH_HOST}/${process.env.POST_IMGS}/${item.filename}`;
      item.originalname = item.originalname.replace(/ /g, "_");
      rutas.push({ id: uuidv4(), ruta: ruta, name: item.originalname });
    });
    let tipod;
    if (rutas.length > 0) {
      tipod = "image";
    } else {
      tipod = "text";
    }
    try {
      const aread = [];
      if (req.body.area != "feed") {
        const area = await Area.find({ code: req.body.area });
        console.log(area);
        aread.push({ code: area[0].code, name: area[0].name });
      } else {
        aread.push({ code: "feed", name: "feed" });
      }
      const post = await Post.create({
        user: req.user._id,
        description: req.body.description,
        category: req.body.category,
        tipo: tipod,
        files: rutas,
        area: aread,
        empresa: req.user.empresa,
      });

      const newPost = await Post.find({ _id: post._id })
        .populate("user", "_id profilePicture name")
        .populate("category", "_id name");

      getResponse(res, { code: 200, data: newPost });
    } catch (error) {
      console.log(error);
      getResponse(res, { code: 500, data: error });
    }
  });
};

const uploadDoc = uploadDocs.array("postsDocs", 5);
const storeWithDocs = async (req, res, next) => {
  uploadDoc(req, res, async function (err) {
    if (err) return getResponse(res, { code: 500, data: err.message });
    let rutas = [];
    req.files.forEach((item) => {
      console.log(item);
      let ruta = `${process.env.PATH_HOST}/${process.env.POST_DOCS}/${item.filename}`;
      item.originalname = item.originalname.replace(/ /g, "_");
      rutas.push({ id: uuidv4(), ruta: ruta, name: item.originalname });
    });

    let tipod;
    if (rutas.length > 0) {
      tipod = "docs";
    } else {
      tipod = "text";
    }
    try {
      const aread = [];
      if (req.body.area != "feed") {
        const area = await Area.find({ code: req.body.area });
        console.log(area);
        aread.push({ code: area[0].code, name: area[0].name });
      } else {
        aread.push({ code: "feed", name: "feed" });
      }
      const post = await Post.create({
        user: req.user._id,
        description: req.body.description,
        category: req.body.category,
        tipo: tipod,
        files: rutas,
        area: aread,
        empresa: req.user.empresa,
      });
      const newPost = await Post.find({ _id: post._id })
        .populate("user", "_id profilePicture name")
        .populate("category", "_id name");
      getResponse(res, { code: 200, data: newPost });
    } catch (error) {
      getResponse(res, { code: 500, data: error });
      next();
    }
  });
};

// register video
const storeSimple = async (req, res, next) => {
  let tipod;
  const ruta = [];
  if (req.body.url) {
    tipod = "video";
    ruta.push({ id: uuidv4(), ruta: req.body.url, name: req.body.url });
  } else {
    tipod = "text";
  }
  try {
    const aread = [];
    if (req.body.area != "feed") {
      const area = await Area.find({ code: req.body.area });
      console.log(area);
      aread.push({ code: area[0].code, name: area[0].name });
    } else {
      aread.push({ code: "feed", name: "feed" });
    }
    const post = await Post.create({
      user: req.user._id,
      description: req.body.description,
      category: req.body.category,
      tipo: tipod,
      files: ruta,
      area: aread,
      empresa: req.user.empresa,
    });
    const newPost = await Post.find({ _id: post._id })
      .populate("user", "_id profilePicture name")
      .populate("category", "_id name");

    getResponse(res, { code: 200, data: newPost });
  } catch (e) {
    getResponse(res, { code: 500, data: error });
  }
};

// list feed
const list = async (req, res, next) => {
  console.log("-------------------", req.query);

  const page = parseInt(req.query.page) || 1;
  const cate = req.query.category || "";
  const PAGE_SIZE = parseInt(process.env.PAGE_SIZE); // tamaño x paginacin'
  const skip = (page - 1) * PAGE_SIZE;
  let query = {};
  if (cate !== "") {
    query = {
      category: cate,
      area: { $elemMatch: { code: parseInt(req.query.area) } },
      empresa: req.user.empresa,
    };
  } else {
    query = {
      area: { $elemMatch: { code: req.query.area } },
      empresa: req.user.empresa,
    };
  }

  try {
    const posts = await Post.find(query)
      .populate("user", "_id profilePicture name")
      .populate("category", "_id name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE);
    getResponse(res, { code: 200, data: posts });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

const listwithPaginator = async (req, res, next) => {
  // console.log("----------listwithPaginator-----------", req.query);

  const page = parseInt(req.query.page) || 1;
  const cate = req.query.category || "";
  const PAGE_SIZE = parseInt(process.env.PAGE_SIZE); // tamaño x paginacin'
  let query = {};

  let area;
  if (req.query.area === "feed") {
    area = req.query.area;
  } else if (req.query.area != "") {
    area = parseInt(req.query.area);
  } else {
    area = "";
  }

  if (cate !== "") {
    query = {
      category: cate,
      area: { $elemMatch: { code: "feed" } },
      empresa: req.user.empresa,
    };
  } else {
    query = {
      area: { $elemMatch: { code: area } },
      empresa: req.user.empresa,
    };
  }
  //to filters
  if (area !== "" && cate !== "") {
    query = {
      category: cate,
      area: { $elemMatch: { code: area } },
      empresa: req.user.empresa,
    };
  }

  // console.log("-----query----",query)

  const options = {
    page: page,
    sort: { createdAt: -1 },
    limit: PAGE_SIZE,
    populate: ["category", "user"],
    lean: true,
  };
  try {
    const { docs, nextPage, totalDocs, hasNextPage } = await Post.paginate(
      query,
      options
    );
    res
      .status(200)
      .json({ msg: "OK", data: docs, next: hasNextPage, total: totalDocs });
  } catch (error) {
    getResponse(res, { code: 500, data: error });
  }
};

// like/dislike

const liked = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user._id)) {
      console.log("caee en flasee");
      const newPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { likes: req.user._id } },
        { new: true }
      );
      getResponse(res, { code: 200, data: newPost });
    } else {
      const newPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: req.user._id } },
        { new: true }
      );
      getResponse(res, { code: 200, data: newPost });
    }
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};
// usuarios que le dieron like a un posts
const usersLikeds = async (req, res, next) => {
  try {
    const posts = await Post.find({
      _id: req.params.id,
    });
    const data = posts[0].likes;
    const users = [];
    for (let item in data) {
      let user = await User.find(
        { _id: data[item] },
        { profilePicture: 1, _id: 1, name: 1, email: 1 }
      );

      users.push(user[0]);
    }

    const page = parseInt(req.query.page) || 1;
    const PAGE_SIZE = parseInt(process.env.PAGE_SIZE_LIKED);
    const userdata = Paginator(users, page, PAGE_SIZE);
    getResponse(res, { code: 200, data: userdata });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

// paginador
function Paginator(items, page, per_page) {
  var page = page || 1,
    per_page = per_page || 1,
    offset = (page - 1) * per_page,
    paginatedItems = items.slice(offset).slice(0, per_page),
    total_pages = Math.ceil(items.length / per_page);
  return paginatedItems;
  // return {
  //   page: page,
  //   per_page: per_page,
  //   pre_page: page - 1 ? page - 1 : null,
  //   next_page: total_pages > page ? page + 1 : null,
  //   total: items.length,
  //   total_pages: total_pages,
  //   data: paginatedItems,
  // };
}

// delete
const destroy = async (req, res, next) => {
  try {
    const des = await Post.deleteOne({ _id: req.params.id });
    getResponse(res, { code: 200, data: des });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};
module.exports = {
  store,
  storeWithDocs,
  storeSimple,
  list,
  listwithPaginator,
  liked,
  usersLikeds,
  destroy,
};
