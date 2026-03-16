const express = require("express");
const app = express();
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const fs = require("fs");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  var date = new Date();
  var requestPath = req.path;
  var ipAddress = req.ip;
  var queryParams = JSON.stringify(req.query);
  var bodyParams = JSON.stringify(req.body);

  var logEntry =
    date +
    "," +
    requestPath +
    "," +
    ipAddress +
    "," +
    queryParams +
    "," +
    bodyParams;

  fs.appendFile(__dirname + "/log.txt", logEntry + "\n", function (err) {
    if (err) {
      console.error("Error writing to log.txt:", err);
    }
  });

  next();
});

app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false }),
);

app.use(function (req, res, next) {
  req.TPL = {};

  req.TPL.displaylogin = !req.session.username;
  req.TPL.displaylogout = req.session.username;

  next();
});

app.use("/home", function (req, res, next) {
  req.TPL.homenav = true;
  next();
});
app.use("/articles", function (req, res, next) {
  req.TPL.articlesnav = true;
  next();
});
app.use("/members", function (req, res, next) {
  req.TPL.membersnav = true;
  next();
});
app.use("/editors", function (req, res, next) {
  req.TPL.editorsnav = true;
  next();
});
app.use("/login", function (req, res, next) {
  req.TPL.loginnav = true;
  next();
});

// protect access to the members page, re-direct user to home page if nobody is logged in
app.use("/members", function (req, res, next) {
  if (req.session.username) next();
  else res.redirect("/home");
});

// protect access to the editors page, re-direct user to home page if nobody is logged in
app.use("/editors", function (req, res, next) {
  if (req.session.username) next();
  else res.redirect("/home");
});

app.use("/home", require("./controllers/home"));
app.use("/articles", require("./controllers/articles"));
app.use("/members", require("./controllers/members"));
app.use("/editors", require("./controllers/editors"));
app.use("/login", require("./controllers/login"));

//redirect to /home by default
app.get("/", function (req, res) {
  res.redirect("/home");
});

//catch-all router case
app.get(/^(.+)$/, function (req, res) {
  res.sendFile(__dirname + req.params[0]);
});

//start the server
var server = app.listen(8081, function () {
  console.log("Server listening...");
});
