const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function checkToken(token) {
  let data = null;
  try {
    const { _id } = await jwt.decode(token);
    data = _id;
  } catch (error) {
    return false;
  }
  const user = await User.findOne({ _id: data });
  if (user) {
    const token = await jwt.sign({ _id: data }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIN,
    });
    return { token, rol: user.rol };
  } else {
    return false;
  }
}

// construccion del token
let encode = async (_id) => {
  const token = await jwt.sign({ _id: _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIN,
  });
  return token;
};

let decode = async (token) => {
  try {
    const { _id } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id });
    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (error) {
    const newToken = await checkToken(token);
    return newToken;
  }
};
module.exports = {
  encode,
  decode,
};
