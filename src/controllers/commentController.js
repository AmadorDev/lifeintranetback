const { getResponse } = require("../utils/response");

const { Comment, Post, User,Notification } = require("../models");

const { v4: uuidv4 } = require("uuid");

const { ObjectId } = require("mongoose");


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

const findNestedReply = (replies, replyId) => {
  for (const reply of replies) {
    if (reply.id == replyId) {
      return reply;
    }
    if (reply.replies && reply.replies.length > 0) {
      const nestedReply = findNestedReply(reply.replies, replyId);
      if (nestedReply) {
        return nestedReply;
      }
    }
  }
  return null;
};

//******************************** insert answer****************************** */
const storeAnswer = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const replyId = req.body.replyId;
    const answer = req.body.answer;
    const post_id = req.body.post;
    const mentioned = req.body.mentioned;
    console.log("----------",mentioned)
    const comment = await Comment.findById(commentId);
    const nestedComment = findNestedReply(comment.replies, replyId);

    if (!nestedComment) {
      let newReply = {
        user: req.user._id,
        description: answer,
        post: post_id,// "6202c539a13ca126a0241f57",
      };
      comment.replies.push(newReply);
      await comment.save();
      const commentNew = await Comment.findById(commentId)
        .populate("user", "_id profilePicture name surnames")
        .populate({
          path: "replies",
          populate: {
            path: "user",
            select: "_id profilePicture name surnames",
          },
        })
        .populate({
          path: "replies.replies",
          populate: {
            path: "user",
            select: "_id profilePicture name surnames",
          },
        })
        .populate({
          path: "replies.replies.replies",
          populate: {
            path: "user",
            select: "_id profilePicture name surnames",
          },
        })
        .populate({
          path: "replies.replies.replies.replies",
          populate: {
            path: "user",
            select: "_id profilePicture name surnames",
          },
        });
     console.log('mentioned',mentioned)
     if(mentioned){
       await notificationStore(req.user._id,post_id,answer,mentioned); 
       console.log('post_id',post_id) 
     }
        return res.json({
          status: true,
          data: commentNew,
          message: "Comentario añadido correctamente",
        });
    }

    const newReply = {
      user: req.user._id,
      description: answer,
      post:post_id,// "6202c539a13ca126a0241f57",
    };

    nestedComment.replies.push(newReply);
    await comment.save();
    const commentNew = await Comment.findById(commentId)
      .populate("user", "_id profilePicture name surnames")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "_id profilePicture name surnames",
        },
      })
      .populate({
        path: "replies.replies",
        populate: {
          path: "user",
          select: "_id profilePicture name surnames",
        },
      })
      .populate({
        path: "replies.replies.replies",
        populate: {
          path: "user",
          select: "_id profilePicture name surnames",
        },
      })
      .populate({
        path: "replies.replies.replies.replies",
        populate: {
          path: "user",
          select: "_id profilePicture name surnames",
        },
      });

      console.log('mentioned',mentioned)
      if(mentioned){
        await notificationStore(req.user._id,post_id,answer,mentioned); 
        console.log('post_id',post_id) 
      }
    return res.json({
      status: true,
      data: commentNew,
      message: "Comentario añadido correctamente",
    });
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};

function getLastReply(comment) {
  if (!comment.replies || comment.replies.length === 0) {
    return comment;
  }
  let lastReply = comment.replies[comment.replies.length - 1];
  return getLastReply(lastReply);
}

//******************************** end insert answer****************************** */
// list
const list = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const PAGE_SIZE = parseInt(process.env.PAGE_SIZE_COMMENT); // tamaño x paginacin'
  const skip = (page - 1) * PAGE_SIZE;
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "_id profilePicture name surnames")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "_id profilePicture name surnames",
        },
      })
      .populate({
        path: "replies.replies",
        populate: {
          path: "user",
          select: "_id profilePicture name surnames",
        },
      })
      .populate({
        path: "replies.replies.replies",
        populate: {
          path: "user",
          select: "_id profilePicture name surnames",
        },
      })
      .populate({
        path: "replies.replies.replies.replies",
        populate: {
          path: "user",
          select: "_id profilePicture name surnames",
        },
      })

      .skip(skip)
      .limit(PAGE_SIZE)
      .sort({ createdAt: -1 })
      .exec();

    getResponse(res, { code: 200, data: comments });
  } catch (e) {
    console.log(e);
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
    if (comment) {
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
    } else {
      const comment = await Comment.findById(req.params.key);
      const nestedComment = findNestedReply(comment.replies, req.params.id);
      const userId = req.user._id;
      if (nestedComment.likes.includes(userId.toString())) {
        nestedComment.likes = nestedComment.likes.filter(
          (like) => like != `${userId}`
        );
      } else {
        nestedComment.likes.push(userId);
      }
      nestedComment.markModified("likes");
      const updatedComment = await comment.save();
      getResponse(res, { code: 200, data: updatedComment });
    }
  } catch (e) {
    console.log(e.message);
    getResponse(res, { code: 500, data: e });
  }
};

//delete comment
// Total comments x idpost
const remove = async (req, res) => {
  try {
    const data = await Comment.findByIdAndRemove({
      _id: req.params.id,
    });
    getResponse(res, { code: 200, data: data });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

// notifications
const notificationStore = async (user,post,content,mentioned) => {
  try {
    const model = await Notification.create({
      user: user,
      mentioned:mentioned,
      post: post,
      content: content,
    });
    
  } catch (error) {
  }
};
const notificationUser = async (req, res) => {
  
  try {
    const data = await Notification.find({
      mentioned: req.user._id,
    }).populate('user', 'id profilePicture').sort({ createdAt: -1 }).limit(10);
    getResponse(res, { code: 200, data: data,status:true });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

module.exports = {
  store,
  storeAnswer,
  list,
  countComments,
  liked,
  remove,
  notificationUser
};
