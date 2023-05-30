const { User, Area } = require("../models");
const { getResponse } = require("../utils/response");
const { apiPublic } = require("../services/callEp");

const store = async (req, res, next) => {
  try {
    let url = `${process.env.URL_LIFE}/login`;
    let urlareas = `${process.env.URL_LIFE}/areas`;
    const creden = {
      empresa: req.user.empresa,
      dni: req.user.dni,
      clave: req.user.pass_code,
    };
    const result = await apiPublic("POST", url, creden, null);
    if (result) {
      const areas = await apiPublic("GET", urlareas, null, result.token);
      areas.map((item) => {
        Area.create({
          name: item.nombre,
          idEmpresa: item.idEmpresa,
          code: item.id,
        })
          .then((rs) => {})
          .catch((err) => {});
      });
      getResponse(res, { code: 200, data: "registrado correctamente" });
    } else {
      getResponse(res, { code: 500, data: "Error en el proceso" });
    }
  } catch (error) {
    getResponse(res, { code: 500, data: "Error en el proceso" });
  }
};
const list = async (req, res, next) => {
  try {
    const data = await Area.find({ idEmpresa: req.user.empresa });
    getResponse(res, { code: 200, data: data });
  } catch (error) {
    getResponse(res, { code: 500, data: "Error en el proceso" });
  }
};

module.exports = { store, list };
