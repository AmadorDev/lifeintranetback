const { Schema, model } = require("mongoose");
const FilePostSchema = new Schema(
  {
    posts: {
      type: Schema.Types.ObjectId,
      ref: "posts",
    },
    type: {
      type: String,
    },
    files: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const FilePost = model("filesposts", FilePostSchema);
module.exports = FilePost;
