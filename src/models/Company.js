const { Schema, model } = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const CompanySchema = new Schema(
  {
    vision: {
      type: String,
      required: true,
    },
    mision: {
      type: String,
      required: true,
    },
    vision: {
      type: String,
      required: true,
    },
    valors: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },

    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);
// usando validator
// CompanySchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

const Category = model("companies", CompanySchema);

module.exports = Category;
