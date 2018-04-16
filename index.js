const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(
  session({
    secret: "keyboard cat",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: false
  })
);

app.use(bodyParser.json());

app.post("/user/authenticate", (req, res) => {
  if (req.body.password === "p" && req.body.login === "flo") {
    req.session.user = {
      name: "Flo",
      login: req.body.login
    };
    res.json({ success: true });
  } else {
    res.status(400);
    res.json({ success: false });
  }
});

app.get("/user/session", (req, res) => {
  if (req.session.user && Object.keys(req.session.user).length) {
    res.json(req.session.user);
  } else {
    res.status(401);
    res.end();
  }
});

app.get("/user/logout", (req, res) => {
  if (req.session.user && Object.keys(req.session.user).length) {
    delete req.session.user;
    req.session.destroy();
    res.json({ success: true });
  } else {
    res.status(401);
    res.end();
  }
});

app.listen(3100, () => {
  console.log("Example app listening on port 3100!");
});
