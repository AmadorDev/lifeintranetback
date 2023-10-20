const { Schema, model } = require("mongoose");
const mongoose= require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    likes: {
      type: Array,
      default: [],
    },

    // replies: [
    //   {
    //     user: {
    //       type: Schema.Types.ObjectId,
    //       ref: "users",
    //     },
    //     description: {
    //       type: String,
    //       required: true,
    //     },
    //     likes: {
    //       type: Array,
    //       default: [],
    //     },
    //     replies: [this],
    //     createdAt: {
    //       type: Date,
    //       default:new Date(),
    //     }
    //   },
    // ],
  },
  { timestamps: true }
);

CommentSchema.add({
  replies: [CommentSchema],
});

CommentSchema.plugin(deepPopulate);

const Comment = model("comments", CommentSchema);
module.exports = Comment;
