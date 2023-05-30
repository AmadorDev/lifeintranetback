const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const VideoXSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "slider",
    },
    cate: {
      type: String,
      required: true,
      uniqueCaseInsensitive: true,
    },
    section: {
      type: String,
      required: true,
      uniqueCaseInsensitive: true,
    },
    name: {
      type: String,
      required: false,
      uniqueCaseInsensitive: true,
    },
    link: {
      type: String,
      required: false,
      uniqueCaseInsensitive: true,
    },

    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// usando validator
VideoXSchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

const VideoX = model("videos", VideoXSchema);

module.exports = VideoX;
