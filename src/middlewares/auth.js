const jwt = require("jsonwebtoken");
const { User } = require("../models");
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Acceso denegado", status: false });
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(_id);
    if (usuario) {
      req.user = usuario;
      next();
    } else {
      return res
        .status(400)
        .json({ message: "token no es válido", status: false });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ message: "token no es válido", status: false });
  }
};

const comprobarJWT = async (token = "") => {
  try {
    if (token.length < 10) {
      return null;
    }
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(_id);
    if (usuario) {
      return usuario;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// verificar roladmin
let verificarRolAdmin = (req, res, next) => {
  let usuario = req.usuario;
  if (usuario.role === "ADMIN_ROLE") {
    next();
  } else {
    res.status(401).json({
      ok: false,
      err: {
        message: "usuario no autorizado",
      },
    });
  }
};

module.exports = { authenticateJWT, comprobarJWT };
