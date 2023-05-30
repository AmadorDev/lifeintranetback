const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  role: { type: String },
  dni: { type: String, required: true, maxLength: 50, unique: true },
  name: { type: String, required: true, maxLength: 50 },
  surnames: { type: String, required: true, maxLength: 150 },
  date_birth: { type: String },
  hb: { type: String },
  gender: { type: String, maxLength: 20 },
  phone: { type: String, maxLength: 20 },
  email: { type: String, maxLength: 100 },
  area: {
    type: Array,
    default: [],
  },
  empresa: { type: String },
  puesto: { type: String, required: true, maxLength: 100 },
  favorites: { type: Array, default: [] },
  password: { type: String, required: true, maxLength: 100 },
  pass_code: { type: String, required: true, maxLength: 100 },
  tk_life: { type: String, maxLength: 255 },
  profilePicture: {
    type: String,
    default: "",
  },
  cover_page: {
    type: String,
    default: "",
  },
  login: { type: Number, default: 0 },
 
  createAt: { type: Date, default: Date.now },
});

// {
//   "id": 8,
//   "dni": "46455181",
//   "apepat": "Velasquez",
//   "apemat": "Portugal",
//   "nombres": "Miguel Alfonso",
//   "fechanac": null,
//   "sexo": null,
//   "telefono": "932819630",
//   "email": "mvelasquez@corporacionlife.com.pe",
//   "area": "Sistemas",
//   "puesto": "Analista Programador",
//   "activo": "S"
// }

// no retornar password
userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

const User = model("users", userSchema);
module.exports = User;
