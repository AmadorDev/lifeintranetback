const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const SlideSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "slider",
    },
    section: {
      type: String,
      required: true,
      uniqueCaseInsensitive: true,
    },
    image: {
      type: String,
      required: true,
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
SlideSchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

const Slide = model("slides", SlideSchema);

module.exports = Slide;
