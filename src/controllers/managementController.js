const { Slider, VideoX } = require("../models");
const { getResponse } = require("../utils/response");
const { apiPublic } = require("../services/callEp");
const { uploadCover } = require("../utils/uploadCover");
const { uploadDocs } = require("../utils/uploadDocs");

//------------------------------ slider-----------------------------
//get list
const sliders = async (req, res) => {
  try {
    const slides = await Slider.find();
    res.json({ status: true, data: slides });
  } catch (err) {
    res.json({ status: false, message: err });
  }
};

//get by section
const sliderSection = async (req, res) => {
  try {
    const s = req.params.s;
    const cate = req.query.cate;
    const slides = await Slider.find({ section: s ,category:cate});
    res.json({ status: true, data: slides });
  } catch (err) {
    res.json({ status: false, message: err });
  }
};


//register
const uploadSlider = uploadCover.single("cover");
const sliderStore = async (req, res) => {
  uploadSlider(req, res, async function (err) {
    console.log(req.body);
    if (err) return res.json({ status: false, message: err });
    if (!req.file)
      return res.json({
        status: false,
        message: "required type file _image_ ",
      });

    let patch = `${process.env.PATH_HOST}/${process.env.UP_USER}/${req.file.filename}`;
    try {
      const slide = new Slider({
        link: req.body.link,
        image: patch,
        category:req.body.category || '',
        section: req.body.section,
      });
      await slide.save();
      res.json({ status: true, data: slide,message:"Procesado correctamente !" });
    } catch (err) {
      res.json({ status: false, message: err });
    }
  });
};

const uploadDoc = uploadDocs.single("doc");
const sliderStoreDocs = async (req, res) => {
  uploadDoc(req, res, async function (err) {
    console.log(req.body);
    if (err) return res.json({ status: false, message: err });
    if (!req.file)
      return res.json({
        status: false,
        message: "required type file _doc_ ",
      });

    let patch = `${process.env.PATH_HOST}/${process.env.UP_DOCS_RUTA}/${req.file.filename}`;
    try {
      const slide = new Slider({
        link: req.body.link,
        image: patch,
        name:req.body.name || '',
        category:req.body.category || '',
        section: req.body.section,
      });
      await slide.save();
      res.json({ status: true, data: slide, message:"Procesado correctamente !" });
    } catch (err) {
      res.json({ status: false, message: err });
    }
  });
};


//delete all sliders
const sliderDestroyAll = async (req, res) => {
  try {
    const data = await Slider.deleteMany();
    res.json({ status: true, data: data });
  } catch (err) {
    res.json({ status: false, message: err });
  }
};

//delete by _id
const sliderDestroy = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Slider.deleteMany({ _id: id });
    res.json({
      status: true,
      data: data,
      message: "Eliminado correctamente!",
    });
  } catch (err) {
    res.json({ status: false, message: err });
  }
};

//------------------------------ slider-----------------------------

//------------------------------ video examen-----------------------------

//video list
const videosX = async (req, res) => {
  try {
    const videos = await VideoX.find();
    res.json({ status: true, data: videos });
  } catch (err) {
    res.json({ status: false, message: err });
  }
};

//search section and cate
const videosFind = async (req, res) => {
  try {
    const section = req.params.s;
    const cate = req.params.c;
    const videos = await VideoX.find({ section: section, cate: cate });
    res.json({ status: true, data: videos });
  } catch (err) {
    res.json({ status: false, message: err });
  }
};


//videos store
const videosXStore = async (req, res) => {
  try {
    let body = req.body;
    const video = new VideoX({
      link: body.link,
      name: body.name ?? "",
      cate: body.cate,
      section: body.section,
    });
    await video.save();
    res.json({ status: true, data: video, message: "Guardado correctamente!" });
  } catch (err) {
    res.json({ status: false, message: err });
  }
};

//delete all videos
const videosXDestroyAll = async (req, res) => {
  try {
    const videos = await VideoX.deleteMany();
    res.json({ status: true, data: videos });
  } catch (err) {
    res.json({ status: false, message: err });
  }
};


//delete by id videos
const videosXDestroy = async (req, res) => {
  try {
    const id = req.params.id;

    const videos = await VideoX.deleteMany({ _id: id });
    res.json({
      status: true,
      data: videos,
      message: "Eliminado correctamente!",
    });
  } catch (err) {
    res.json({ status: false, message: err });
  }
};
//------------------------------ video examen-----------------------------

module.exports = {
  sliders,
  sliderSection,
  sliderStore,
  sliderStoreDocs,
  sliderDestroyAll,
  sliderDestroy,
  videosX,
  videosXStore,
  videosXDestroy,
  videosXDestroyAll,
  videosFind,
};

//---------------------------------------- SSOMA----------------------------------------------------
