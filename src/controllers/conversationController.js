const { Conversation, User, Message } = require("../models");
const { getResponse } = require("../utils/response");

const store = async (req, res, next) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    getResponse(res, { code: 200, data: savedConversation });
  } catch (e) {
    getResponse(res, { code: 500, data: e.errors });
  }
};

// Obtener conv de una usuario
const xUser = async (req, res, next) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
      initial: true,
    });

    getResponse(res, { code: 200, data: conversation });
  } catch (e) {
    getResponse(res, { code: 500, data: e.errors });
  }
};

// listado de conversaciones de un usuario
// lista el ultimo mensaje enviado del usuario contrario
// esta concatenado con los usuarios
const cnvPersonaliza = async (req, res, next) => {
  const iduser = req.params.userId;
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
      initial: true,
    })
      .select({
        _id: 1,
        members: 1,
      })
      .sort({ createdAt: -1 })
      .limit(10);

    const convs = [];
    for (const f of conversation) {
      let userId = f.members.find((element) => element != iduser);
      const resps = await Message.find({})
        .where("conversationId")
        .equals(f._id)
        .where("sender")
        .equals(userId)
        .populate("sender", "profilePicture _id name")
        .sort({ createdAt: -1 })
        .limit(1);
      if (resps.length > 0) {
        convs.push(resps[0]);
      }
    }

    getResponse(res, { code: 200, data: convs.reverse() });
  } catch (e) {
    getResponse(res, { code: 500, data: e.errors });
  }
};

// get conv incluye dos userId
const includeDosUsers = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    if (conversation !== null) {
      getResponse(res, { code: 200, data: conversation });
    } else {
      const newvC = new Conversation({
        members: [req.params.firstUserId, req.params.secondUserId],
      });
      const savCv = await newvC.save();
      getResponse(res, { code: 200, data: savCv });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// get conv detalle
const getDetalleCov = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id });
    getResponse(res, { code: 200, data: conversation });
  } catch (error) {
    res.status(500).json(err);
  }
};

module.exports = {
  store,
  xUser,
  includeDosUsers,
  getDetalleCov,
  cnvPersonaliza,
};
