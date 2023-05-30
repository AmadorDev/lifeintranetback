const bcrypt = require("bcryptjs");

encrypPass = async (pass) => {
  if (pass != undefined) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
  } else {
    return null;
  }
};
matchPass = async (pass, savepass) => {
  try {
    return await bcrypt.compare(pass, savepass);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { encrypPass, matchPass };
