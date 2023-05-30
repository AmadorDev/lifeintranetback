const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const mongoosePaginate = require('mongoose-paginate-v2');
const PollSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    title: {
      type: String,
      required: true,
      max: 50,
    },

    link: {
      type: String,
      required: true,
      max: 200,
    },
    type_poll: {
      type: String,
      required: true,
      max: 2,
    },
   
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);
// usando validator
PollSchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });
PollSchema.plugin(mongoosePaginate);
const Poll = model("polls", PollSchema);

module.exports = Poll;
