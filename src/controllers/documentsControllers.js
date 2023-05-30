const { getResponse } = require("../utils/response");
const { apiPublic } = require("../services/callEp");
const fs = require("fs");
const path = require("path");
const { User } = require("../models");
const { uploadFileAll } = require("../utils/uploadFileAll");
const { sendEmail, removeFile } = require("../services/sendEmail");

const List = async (req, res) => {
  // tipos de documentos
  try {
    let url = `${process.env.URL_LIFE}/tipos-documento`;
    const result = await apiPublic("GET", url, {}, req.user.tk_life);
    return getResponse(res, { code: 200, data: result.tipos });
  } catch (error) {
    return getResponse(res, { code: 500, data: error });
  }
};

const ListDocId = async (req, res) => {
  // prarams id = idtipodedoc
  try {
    let url = `${process.env.URL_LIFE}/lista-documentos?tipodoc=${req.params.id}`;
    const result = await apiPublic("GET", url, {}, req.user.tk_life);
    return getResponse(res, { code: 200, data: result.documentos });
  } catch (error) {
    return getResponse(res, { code: 500, data: error });
  }
};

const DowloadDoc = async (req, res) => {
  console.log("req",req.body)
  console.log("params",req.params)
  // documentId
  try {
    let url = `${process.env.URL_LIFE}/descarga-archivo?documento=${req.params.id}`;
    const result = await apiPublic("GET", url, {}, req.user.tk_life);
    // let buff = Buffer.from(result?.archivo, "base64");
    // const ruta = path.join(__dirname, "../public/pdfs/ssw.pdf");
    // fs.writeFileSync(ruta, buff);
    console.log("respuesta------------",result)
    return getResponse(res, { code: 200, data: result.archivo });
  } catch (error) {
    console.log("----- errror docdowload", error);
    return getResponse(res, { code: 500, data: error });
  }
};

const upFileAll = uploadFileAll.single("doc");
const FileAll = async (req, res) => {
  upFileAll(req, res, async function (err) {
    if (err) {
      return res.json({ send: false });
    } else {
      console.log("---",req.user)
      let txt_type = req.body.type;
      let txt_detail = req.body.detail;
      let txt_modo = req.body.modo;
      // let txt_detail = req.body.detail;
      let subject = `Nueva ${txt_modo}`;
      let content = `<div>
      <p>
      <strong>Tipo de ${txt_modo} :</strong>
      <span>${txt_type}</span>
      </p>
      <p>
      <strong>Mensaje :</strong>
      <span>${txt_detail}</span>
      </p>
      <h4>Datos:
      </h4>
      <strong>Nombres y apellidos :</strong>
      <span>${req.user.name} - ${req.user.surnames}</span><br/>
      <strong>DNI :</strong>
      <span>${req.user.dni}</span><br/>
      <strong>Correo :</strong>
      <span>${req.user.email}</span><br/>
      <strong>Cargo :</strong>
      <span>${req.user.puesto}</span><br/>
      <strong>Aréa :</strong>
      <span>${req.user.area[0].name}</span><br/>
      
      </div>`;
      if (req.file) {
        let url = `${process.env.PATH_HOST}/filesforms/${req.file.filename}`;
        let filename = req.file.originalname;
        try {
          let result = await sendEmail(url, filename, subject, content);
         
           removeFile(req.file.filename)
          return res.json({ status: true,msg:result });
        } catch (error) {
          return res.json({ status: false ,msg:error});
        }
      } else {

        try {
          let result = await sendEmail(null, null, subject, content);
          
          return res.json({ status: true ,msg:result});
        } catch (error) {
          return res.json({ status: false,msg:error });
        }
      }
    }
  });
};

module.exports = { ListDocId, DowloadDoc, List, FileAll };
