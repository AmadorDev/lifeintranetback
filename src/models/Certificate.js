const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const CertificateSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    title: {
      type: String,
      required: true,
      max: 50,
    },
    date_to: {
      type: Date,
      required: true,
    },
    date_from: {
      type: Date,
      required: true,
    },
    file_url: {
      type: String,
      required: true,
      max: 200,
    },
    file_name: {
        type: String,
        required: true,
        max: 50,
      },

    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);
// usando validator
CertificateSchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

const Certificate = model("certificates", CertificateSchema);

module.exports = Certificate;
