const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
require("dotenv").config();

const { socketController } = require("./socket/socketController");

const server = http.createServer(app);

const port = process.env.PORT || 3001;

let corsOptions = {
  origin: [process.env.PATH_CLI,process.env.PATH_CLI_NAME],
  optionsSuccessStatus: 200,
};

/*db*/
require("./database/db.js");
// require("./models");

/*middleware*/
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false  }));
app.options("*", cors());
// static
app.use(express.static(path.join(__dirname, "public")));
// app.use("/users", express.static(path.join(__dirname, "public/users")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// routes

app.get("/", function (req, res) {
  res.render("index", { title: "Hey", message: "Hello there!" });
});
app.get("/stream", function (req, res) {
  res.render("stream", { title: "Hey", message: "Hello there!" });
});
app.use("/api", require("./routes/index"));
/*socket*/

const io = require("socket.io")(server, {
  cors: {
    origins:[ process.env.PATH_CLI,process.env.PATH_CLI_NAME],
    // allowedHeaders: ["custom-header-intranet"],
    // credentials: true,
    methods: ["GET", "POST"],
  },
});
// sockets
io.on("connection", (socket) => socketController(socket, io));

// run
server.listen(port, () => {
  console.log("run server");
});
