const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const FriendSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    friends: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);
// usando validator
FriendSchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

const Friend = model("friends", FriendSchema);

module.exports = Friend;
