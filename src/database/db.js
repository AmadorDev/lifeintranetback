const moongose = require("mongoose");
const database = require("./config");
moongose
  .connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((rs) => console.log("conected sucess"))
  .catch((err) => console.log(err));
