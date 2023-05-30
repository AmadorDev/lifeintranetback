const { Schema, model } = require("mongoose");
const MessageSchema = new Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    text: {
      type: String,
    },
    text_type: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);
// text_type=text,pdf,execel,word,image
const Message = model("messages", MessageSchema);
module.exports = Message;
