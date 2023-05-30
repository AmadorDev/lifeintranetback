const { Message, Conversation, User } = require("../models");
const { update } = require("../models/User");
const { getResponse } = require("../utils/response");

// new message
const store = async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    const updateConv = await Conversation.findOneAndUpdate(
      { _id: req.body.conversationId },
      { initial: true }
    );

    getResponse(res, { code: 200, data: savedMessage });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

// obtener messages x convId
const xconversationId = async (req, res, next) => {
  try {
    // const total = await Message.find({
    //   conversationId: req.params.conversationId,
    // }).countDocuments();
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    // .sort({ createdAt: -1 })
    // .limit(3);

    getResponse(res, { code: 200, data: messages });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

// mensajes de dos usuarios x idconv
const getMessagesxCov = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.idconv,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const convdet = await Conversation.find({ _id: req.params.idconv });

    let userId = convdet[0].members.find(
      (element) => element != req.params.userId
    );
    const currentdat = await User.find({ _id: userId });
    res.status(200).json({
      msg: "ok",
      data: messages.reverse(),
      current: currentdat[0],
    });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};
// message reading

const messageRead = async (req, res, next) => {
  try {
    const updateConv = await Message.findOneAndUpdate(
      { _id: req.params.id },
      { read: true }
    );

    getResponse(res, { code: 200, data: updateConv });
  } catch (e) {
    getResponse(res, { code: 500, data: e });
  }
};

module.exports = {
  store,
  xconversationId,
  getMessagesxCov,
  messageRead,
};
