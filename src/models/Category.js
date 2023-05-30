const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      uniqueCaseInsensitive: true,
    },

    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);
// usando validator
CategorySchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

const Category = model("categories", CategorySchema);

module.exports = Category;
