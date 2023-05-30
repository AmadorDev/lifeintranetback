const { getResponse } = require("../utils/response");

const { Comment, Post, User } = require("../models");

const { v4: uuidv4 } = require("uuid");

const store = async (req, res, next) => {
  try {
    console.log(req.body);
    const { description } = req.body;
    const comment = await Comment.create({
      user: req.user._id,
      post: req.params.postId,
      description: description,
    });
    const newcomment = await Comment.find({ _id: comment._id }).populate(
      "user",
      "_id profilePicture name"
    );
    getResponse(res, { code: 200, data: newcomment });
  } catch (error) {
    getResponse(res, { code: 500, data: error.errors });
  }
};

// list
const list = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const PAGE_SIZE = parseInt(process.env.PAGE_SIZE_COMMENT); // tamaño x paginacin'
  const skip = (page - 1) * PAGE_SIZE;
  try {
    const posts = await Comment.find({ post: req.params.postId })
      .populate("user", "_id profilePicture name surnames")
      .skip(skip)
      .limit(PAGE_SIZE)
      .sort({createdAt: -1});
    getResponse(res, { code: 200, data: posts });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

// Total comments x idpost
const countComments = async (req, res, next) => {
  try {
    const count = await Comment.find({
      post: req.params.postId,
    }).countDocuments();
    getResponse(res, { code: 200, data: count });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

// like/dislike coment
const liked = async (req, res, next) => {
 
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment.likes.includes(req.user._id)) {
      const newComment = await Comment.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { likes: req.user._id } },
        { new: true }
      );
      getResponse(res, { code: 200, data: newComment });
    } else {
      const newComment = await Comment.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: req.user._id } },
        { new: true }
      );
      getResponse(res, { code: 200, data: newComment });
    }
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

//delete comment 
// Total comments x idpost
const remove = async (req, res) => {
  try {
    const data = await Comment.findByIdAndRemove({
      _id: req.params.id,
    })
    getResponse(res, { code: 200, data: data });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

module.exports = {
  store,
  list,
  countComments,
  liked,
  remove,
};
