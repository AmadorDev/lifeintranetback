const { Socket } = require("socket.io");
const { comprobarJWT } = require("../middlewares/auth");
const { ChatMensajes } = require("./ChatMensajes");

const chatMensajes = new ChatMensajes();

const socketController = async (socket, io) => {
 
  const usuario = await comprobarJWT(socket.handshake.query.token);
  if (!usuario) {
    return socket.disconnect();
  }

  // Agregar el usuario conectado
  chatMensajes.conectarUsuario(usuario);
  // console.log("--onlines--", chatMensajes.usuariosArr);
  io.emit("getUsers", chatMensajes.usuariosArr);

  socket.join(usuario.id); // global, socket.id, usuario.id

  socket.on("sendMessage", ({ senderId, receiverId, text, text_type }) => {
    io.to(receiverId).emit("getMessage", { senderId, text, text_type });
  });

  socket.on("addPos", ({ data }) => {
    socket.broadcast.emit("getPost", { data: data });
  });

  // disconnnect
  socket.on("disconnect", () => {
    chatMensajes.desconectarUsuario(usuario.id);
    io.emit("getUsers", chatMensajes.usuariosArr);
    // console.log("--onlines--", chatMensajes.usuariosArr);
  });
};

module.exports = {
  socketController,
};
