const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const NotificationSchema = new Schema(
  {
    mentioned: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
      default: 1,
    },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser unico",
});

const Notification = model("notifications", NotificationSchema);

module.exports = Notification;
