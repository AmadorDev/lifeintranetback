// conectar
users = [];
idsockets = [];
listuser = [];

io.on("connection", (socket) => {
  console.log("conexion-socketid", socket.id);

  socket.on("addUser", (idUser) => {
    if (idUser) {
      users[socket.id] = idUser;
      if (idsockets[idUser] == null) {
        idsockets[idUser] = [];
      }
      idsockets[idUser].push(socket.id);

      const conectados = [];
      for (let er in idsockets) {
        conectados.push(er);
      }
      console.log("--conentados cone--", conectados);
      io.emit("getUsers", conectados);
    }
  });
  socket.on("sendMessage", ({ senderId, receiverId, text, text_type }) => {
    if (idsockets[receiverId]) {
      for (let [index, item] of idsockets[receiverId].entries()) {
        io.to(item).emit("getMessage", { senderId, text, text_type });
      }
    }
  });

  // desconectado
  socket.on("disconnect", (reason) => {
    if (users[socket.id]) {
      let user = users[socket.id]; //almacenamos el usuario
      delete users[socket.id]; // eliminamos de users
      delete idsockets[user]; //eliminamos los idsockes del usuario
      const conectados = [];
      for (let er in idsockets) {
        conectados.push(er);
      }
      console.log("--conentados des--", conectados);
      io.emit("getUsers", conectados);

      // for (let [index, items] of idsockets[user].entries()) {
      //   if (socket.id == items) {
      //     idsockets[user].splice(index, 1);
      //   }
      // }
    }
  });
});
