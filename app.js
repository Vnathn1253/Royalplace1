const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes/routes");
const sequelize = require("./db/database");
const User = require("./models/user");
var session = require("express-session");
var cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000;
const os = require("os");
var numcpu = os.cpus().length;
const cluster = require("cluster");
if (cluster.isMaster) {
  console.log(`master code ${process.pid}`);
  for (let i = 0; i < numcpu; i++) {
    cluster.fork();
  }
} else {
  // const csrf = require("csurf");
  app.set("view engine", "ejs");
  app.set("views", "views");

  app.use(
    session({
      secret: "vishuroyal",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 6000 },
    })
  );
  // var csrfProtection = csrf({ cookie: true });
  app.use(cookieParser());
  app.use(express.json({ limit: "255mb" }));
  app.use(bodyParser.urlencoded({ extended: false, limit: "255mb" }));
  app.use(express.static(path.join(__dirname, "public")));
  app.use((req, res, next) => {
    if (req.cookies.userData) {
      res.locals.userData = req.cookies.userData;
    }
    // res.locals.csrfToken=req.csrfToken();
    res.locals.csrfToken = "fgfgdhfdghdfghfdhdf";
    next();
  });
  app.use(routes);

  sequelize
    // .sync({ force: true })
    .sync()
    .then((cart) => {
      const server = app.listen(port, () => {
        console.log(`server started ${port}`);
      });
      let io = require("socket.io")(server);

      io.on("connection", (socket) => {
        console.log(`New connection: ${socket.id}`);
        // Recieve event
        socket.on("comment", (data) => {
          data.time = Date();
          socket.broadcast.emit("comment", data);
        });

        socket.on("typing", (data) => {
          socket.broadcast.emit("typing", data);
        });
        socket.on("base64 file", (data) => {
          socket.broadcast.emit("base64 file", data);
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
