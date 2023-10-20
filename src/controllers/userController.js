const { User, Friend, EmergencyContact, Certificate } = require("../models");
const { matchPass, encrypPass } = require("../utils/helpers");
const { encode, decode } = require("../services/token");
const { getResponse } = require("../utils/response");
const { apiPublic } = require("../services/callEp");
const os = require("os");
const fs = require("fs");
const path = require("path");

const { check, oneOf, validationResult } = require("express-validator");

const { uploadCover } = require("../utils/uploadCover");
const { uploadCertificate } = require("../utils/uploadCertificate");
// -----------------------------------------------

function removeLink(url) {
 
  let name = url.split("users")[1];
  if(name !== '/default.png'){
    const ruta = path.join(__dirname, "../public/users" + name);
    fs.access(ruta, fs.F_OK, (err) => {
      if (err) {
        return;
      }
      fs.unlink(ruta, (err) => {
        if (err) {
          return;
        }
        console.log(`${name} : File is deleted`);
      });
    });
  }
  return ;
 
}

const HappyBirtday = async (req, res, next) => {
  const date = new Date();
  let dtNowIs = `${date.getMonth() + 1}-${date.getDate()}`;
  try {
    const hbs = await User.find(
      { hb: dtNowIs },
      { _id: 1, name: 1, profilePicture: 1 }
    );
    res.status(200).json({ status: true, data: hbs });
  } catch (error) {
    res.status(500).json({ status: false, data: error.errors });
  }
};

const updateUser = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: "6169b6a0cc072e18787a610a" },
    { hb: "10-15" }
  );
  res.status(200).json({ status: true, date: user });
};

/**
 * 
 register
 */
const store = async (req, res, next) => {
  const { role, name, dni, pass } = req.body;
  let profilePicture = `${process.env.PATH_HOST}/${process.env.UP_USER}/default.png`;
  const password = await encrypPass(pass);
  try {
    const data = await User.create({
      role,
      name,
      dni,
      password,
      profilePicture,
    });
    getResponse(res, { code: 200, data: data });
  } catch (e) {
   
    getResponse(res, { code: 500, data: e.errors });
  }
};

// store all
const storeAll = async (req, res, next) => {
  const password = await encrypPass("123456");
  const users = [
    { name: "lasaga", dni: `lasaga@gmail.com`, password: password },
    { name: "juan", dni: `juan@gmail.com`, password: password },
    { name: "pepe", dni: `pepe@gmail.com`, password: password },
    { name: "lisa", dni: `lisa@gmail.com`, password: password },
    { name: "hugo", dni: `hugo@gmail.com`, password: password },
  ];
  try {
    const data = await User.insertMany(users);
    getResponse(res, { code: 200, data: data });
  } catch (e) {
   
    getResponse(res, { code: 500, data: e.errors });
  }
};

// created user
const verifyUser = async (data, pass, tk) => {
  try {
    const user = await User.findOne({ dni: data.dni });
    //si existe el uusario en la bd se creaa
    const password = await encrypPass(pass);
    let newHb = '';
    if (data.fechanac) {
      let type;
      if (data.fechanac.includes("/")) {
        type = "/";
      } else {
        type = "-";
      }
      let spl = data.fechanac.split(type);
      newHb = `${spl[1]}-${spl[2]}`;
    }

    if (user === null) {
      let profilePicture = `${process.env.PATH_HOST}/${process.env.UP_USER}/default.png`;

      const created = await User.create({
        name: data.nombres,
        dni: data.dni,
        area: [{ code: data.idarea, name: data.area }],
        surnames: `${data.apepat} ${data.apemat}`,
        date_birth: data.fechanac,
        hb: newHb,
        gender: data.sexo,
        phone: data.telefono,
        email: data.email,
        puesto: data.puesto,
        password: password,
        pass_code: pass,
        profilePicture: profilePicture,
        empresa: data.idempresa,
        role: data.tipo,
        tk_life: tk,
      });
      return created;
    } else {
      //si existe se actualiza cada inicio de session

      // const password = await encrypPass(pass);
      const updated = await User.findOneAndUpdate(
        { _id: user._id },
        {
          name: data.nombres,
          area: [{ code: data.idarea, name: data.area }],
          surnames: `${data.apepat} ${data.apemat}`,
          date_birth: data.fechanac,
          hb: newHb,
          gender: data.sexo,
          phone: data.telefono,
          email: data.email,
          puesto: data.puesto,
          password: password,
          pass_code: pass,
          empresa: data.idempresa,
          role: data.tipo,
          tk_life: tk,
        }
      );
      return updated;
    }
    // if (user.pass_code !== pass) {
    //   const password = await encrypPass(pass);
    //   const updated = await User.findOneAndUpdate(
    //     { _id: user._id },
    //     { password: password, pass_code: pass, tk_life: tk }
    //   );
    //   return updated;
    // }

    return user;
  } catch (e) {
    
    return false;
  }
};
const list = async (req, res, next) => {
  try {
    const users = await User.find({});
    getResponse(res, { code: 200, data: users });
  } catch (e) {
    getResponse(res, { code: 500, data: e.errors });
  }
};
const query = async (req, res, next) => {
  let q = req.params.q;
  let regex = new RegExp(q, "i");
  try {
    const users = await User.find({ name: regex }).limit(10);
    getResponse(res, { code: 200, data: users });
  } catch (e) {
    
    getResponse(res, { code: 500, data: e.errors });
  }
};
const getPerfil = async (req, res, next) => {
  try {
    const user = await User.find({ _id: req.params.id });
    getResponse(res, { code: 200, data: user[0] });
  } catch (e) {
   
    getResponse(res, { code: 500, data: e.errors });
  }
};


const getIdByName = async (req, res, next) => {
  try {
    
    const user = await User.findOne({ name: req.body.name }); 
  
    if (user) {
      const userId = user._id;
      getResponse(res, { code: 200, data: userId });
    } else {
      getResponse(res, { code: 500, data:'no se encontro el usuario' });
    }
  } catch (e) {
    getResponse(res, { code: 500, data: e.errors });
  }
};


const profile = async (req, res, next) => {
  if (req.file) {
    if (req.file !== undefined || req.file !== null) {
      let id = req.params.id;
      let name = `${process.env.PATH_HOST}/${process.env.UP_USER}/${req.file.filename}`;
      try {
        const users = await User.findByIdAndUpdate(
          { _id: id },
          { profilePicture: name }
        );
        removeLink(req.user.profilePicture);
        getResponse(res, { code: 200, data: users });
      } catch (e) {
        getResponse(res, { code: 500, data: e });
      }
    } else {
      getResponse(res, { code: 500, data: "file required" });
    }
  } else {
    getResponse(res, { code: 500, data: "file required" });
  }
};

const getMe = async (req, res, next) => {
  if (!req.user) {
    getResponse(res, { code: 500, data: "fails" });
  }
  try {
    // const user = await User.find({ _id: req.user._id });
    getResponse(res, { code: 200, data: req.user });
  } catch (e) {
    
    getResponse(res, { code: 500, data: e.errors });
  }
};

/*
 login
 */
const sigin = async (req, res, next) => {
  const { dni, pass } = req.body;
  try {
    let user = await User.findOne({ dni: dni });

    if (user) {
      let match = await matchPass(pass, user.password);
      console.log("----", match);
      console.log("----", dni);
      console.log("-----", pass);
      if (match) {
        let token = await encode(user._id);
        return res.status(200).json({ data: user, token: token, status: true });
      } else {
        return res
          .status(404)
          .json({ message: "Credenciales invalidas", status: false });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Credenciales invalidas", status: false });
    }
  } catch (error) {
    return res.status(500).send({ message: "Error en proceso", status: false });
  }
};

// loginapi
const loginApi = async (req, res, next) => {
  const { dni, pass, company } = req.body;
  const creden = { empresa: company, dni: dni, clave: pass };
  
  try {
    let url = `${process.env.URL_LIFE}/login`;
    let result = await apiPublic("POST", url, creden, null);
    console.log("-----------------",url)
    console.log("-----------------",result)
    console.log("-----------------",creden)
    if (result?.token) {
      let urlme = `${process.env.URL_LIFE}/me`;
      let user = await apiPublic("GET", urlme, {}, result.token);
     
     
      if (user.activo === "S") {
        let exist = await verifyUser(user, pass, result.token);
         console.log("-----------------",exist);
        if (exist !== false) {
          return await sigin(req, res);
        }
        return res
          .status(500)
          .json({ message: "error en el proceso", status: false });
      } else {
        return res
          .status(404)
          .json({ message: "credenciales incorrectas", status: false });
      }
    } else {
      return res
        .status(404)
        .json({ message: "credenciales incorrectas", status: false });
    }
  } catch (error) {
    console.log("-----------------",error);
    
    res.status(500).json({ message: "error en el proceso", status: false });
  }
};

// uplad coverpage
const uploadCv = uploadCover.single("cover");
const converPage = async (req, res, next) => {
  uploadCv(req, res, function (err) {
    if (err) return getResponse(res, { code: 500, data: err.message });
    if (!req.file)
      return getResponse(res, {
        code: 500,
        data: "required type file _cover_ ",
      });

    let ruta = `${process.env.PATH_HOST}/${process.env.UP_USER}/${req.file.filename}`;

    const user = User.findByIdAndUpdate(
      { _id: req.user._id },
      { cover_page: ruta },
      { new: true }
    )
      .then((rs) => {
        removeLink(req.user.cover_page);
        getResponse(res, { code: 200, data: ruta });
      })
      .catch((err) => {
        getResponse(res, { code: 500, data: err });
      });
  });
};

// cerrar session
const closeLogin = async (req, res, next) => {
  try {
    const upt = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { login: 0 }
    );

    res.status(200).json({ message: "logout exitoso", status: true });
  } catch (error) {
    res.status(404).json({ message: "error en el proceso", status: false });
  }
};

// validate ObjectId

const validateId = async (req, res) => {
  try {
    const isValid = await User.find({ _id: req.params.ObjectId });
    getResponse(res, { code: 200, data: isValid });
  } catch (error) {
    getResponse(res, { code: 500, data: false });
  }
};

// asistencia
// get
const attendance = async (req, res, next) => {
  let url = `${process.env.URL_LIFE}/info-asistencia`;
  try {
    const resp = await apiPublic("GET", url, {}, req.user.tk_life);
    res.status(200).json({ msg: "OK", data: resp });
  } catch (error) {
    res.status(500).json({ msg: "fails", data: error });
  }
};
// register
const attendanceStore = async (req, res, next) => {
  let url = `${process.env.URL_LIFE}/registra-marcacion`;
  try {
    const ip = await getIPAddress();
    const browser = req.headers["user-agent"];
    const resp = await apiPublic(
      "POST",
      url,
      { ip, browser },
      req.user.tk_life
    );
    res.status(200).json({ msg: "OK", data: resp });
  } catch (error) {
    res.status(500).json({ msg: "fail", data: error });
  }
};
async function getIPAddress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      )
        return alias.address;
    }
  }

  return "0.0.0.0";
}

// friends
const FriendStore = async (req, res) => {
  try {
    const resp = await Friend.find({ userId: req.user._id });
    if (resp.length === 0) {
      const resp = await Friend.create({
        userId: req.user._id,
        friends: [req.body.friends],
      });
      const users = await User.find({ _id: req.body.friends });

      return getResponse(res, { code: 200, data: users[0] });
    } else {
      const up = await Friend.updateOne(
        { _id: resp[0]._id },
        { $push: { friends: req.body.friends } }
      );
      const users = await User.find({ _id: req.body.friends });

      return getResponse(res, { code: 200, data: users[0] });
    }
  } catch (error) {
   
    getResponse(res, { code: 500, data: error });
  }
};

// remove
const FriendRemove = async (req, res) => {
  try {
    const friend = await Friend.find({ userId: req.user._id });
    const resp = await Friend.updateOne(
      { _id: friend[0]._id },
      { $pull: { friends: req.params.id } }
    );
    getResponse(res, { code: 200, data: resp });
  } catch (error) {
    getResponse(res, { code: 500, data: error });
  }
};

// list
const FriendList = async (req, res) => {
  try {
    const resp = await Friend.find({ userId: req.user._id }).populate(
      "friends"
    );
    getResponse(res, { code: 200, data: resp });
  } catch (error) {
    
    getResponse(res, { code: 500, data: error });
  }
};

// list x userId
const FriendListEx = async (req, res) => {
  try {
    const resp = await Friend.find({ userId: req.params.id }).populate(
      "friends"
    );
    getResponse(res, { code: 200, data: resp });
  } catch (error) {
   
    getResponse(res, { code: 500, data: error });
  }
};

// verificar si es amigo
const FriendVerify = async (req, res) => {


  try {
    const resp = await Friend.find({
      userId: req.user._id,
      friends: { $in: [req.params.id] },
    });
    if (resp.length > 0) {
      getResponse(res, { code: 200, data: true });
    } else {
      getResponse(res, { code: 200, data: false });
    }
  } catch (error) {
  
    getResponse(res, { code: 500, data: error });
  }
};

//contactc emergency

const ContactEmergency = async (req, res) => {
  let query = {userId:req.user._id};
  if(req.query.uk){
    query = { userId: req.query.uk }
  }
 
  try {
    const obj = await EmergencyContact.find(query);
    result = obj.length > 0 ? obj[0] : [];
    return getResponse(res, { code: 200, data: result });
  } catch (error) {
    
    getResponse(res, { code: 500, data: error });
  }
};

const ContactEmergencyAdd = async (req, res) => {
  const errors = validationResult(req);
 
  if (!errors.isEmpty()) {
    return getResponse(res, { code: 500, data: errors.array() });
  }
  try {
    const exist = await EmergencyContact.find({
      userId: req.user._id,
    }).countDocuments();
    if (exist > 0) {
      //update data
      const obj = await EmergencyContact.findOneAndUpdate(
        { userId: req.user._id },
        { name: req.body.name, phone: req.body.phone }
      );
      return getResponse(res, { code: 200, data: obj });
    } else {
      //create data
      const obj = await EmergencyContact.create({
        userId: req.user._id,
        name: req.body.name,
        phone: req.body.phone,
      });

      return getResponse(res, { code: 200, data: obj });
    }
  } catch (error) {
    getResponse(res, { code: 500, data: error });
  }
};
//*******************CERTIFICATE*************************************/
const uploadCert = uploadCertificate.single("certificate");
const CertificateAdd = async (req, res) => {
  // const errors = validationResult(req)
  // if (!errors.isEmpty()) {
  //   console.log(errors)
  //   return  getResponse(res, { code: 500, data: errors.array() });
  // }
  uploadCert(req, res, async function (err) {
    if (err) {
      return getResponse(res, { code: 500, data: err });
    } else {
      if (req.file) {
        let url = `${process.env.PATH_HOST}/certificate/${req.file.filename}`;
        let filename = req.file.originalname;
        try {
          const obj = await Certificate.create({
            userId: req.user._id,
            title: req.body.title,
            date_to: req.body.date_to,
            date_from: req.body.date_from,
            file_url: url,
            file_name: req.file.filename,
          });
          return getResponse(res, { code: 200, data: obj });
        } catch (error) {
          return getResponse(res, { code: 500, data: error });
        }
      } else {
        return getResponse(res, { code: 500, data: "file required" });
      }
    }
  });
};

const CertificateByUser = async (req, res) => {
  
  try {
    const obj = await Certificate.find({ userId: req.params.userId });
    return getResponse(res, { code: 200, data: obj });
  } catch (error) {
    
    return getResponse(res, { code: 500, data: error });
  }
};
module.exports = {
  sigin,
  store,
  storeAll,
  list,
  getPerfil,
  getMe,
  profile,
  closeLogin,
  query,
  loginApi,
  attendance,
  attendanceStore,
  FriendStore,
  FriendList,
  FriendListEx,
  FriendRemove,
  FriendVerify,
  validateId,
  converPage,
  HappyBirtday,
  updateUser,
  ContactEmergency,
  ContactEmergencyAdd,
  CertificateAdd,
  CertificateByUser,
  getIdByName
};
