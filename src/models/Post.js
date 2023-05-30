const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
    },
    area: { type: Array, default: [] },
    empresa: { type: Number },
    likes: {
      type: Array,
      default: [],
    },
    iscomment: { type: Boolean, default: true },
    tipo: { type: String },
    status: { type: Boolean, default: true },
    files: { type: Array, default: [] },
  },
  { timestamps: true }
);

PostSchema.plugin(mongoosePaginate);
const Post = model("posts", PostSchema);
module.exports = Post;
