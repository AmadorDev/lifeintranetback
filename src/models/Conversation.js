const { Schema, model } = require("mongoose");
const conversationSchema = new Schema(
  {
    members: {
      type: Array,
    },
    initial: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Conversation = model("conversations", conversationSchema);
module.exports = Conversation;
