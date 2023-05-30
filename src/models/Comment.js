const { Schema, model } = require("mongoose");
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
  },
  { timestamps: true }
);

const Comment = model("comments", CommentSchema);
module.exports = Comment;
