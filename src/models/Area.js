const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const AreaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      uniqueCaseInsensitive: true,
    },
    code: {
      type: Number,
      unique: true,
    },
    idEmpresa: {
      type: Number,
    },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);
// usando validator
AreaSchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

const Area = model("areas", AreaSchema);

module.exports = Area;
