const express = require('express');
var router = express.Router()
const ArticlesModel = require('../models/articles.js')
const UsersModel = require('../models/users.js')

// Login page
router.get("/", async function(req, res)
{
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";
  res.render("login", req.TPL);
});

// Login form submission
router.post("/attemptlogin", async function(req, res)
{
  var user = await UsersModel.findUserByUsernameAndPassword(req.body.username, req.body.password);

  if (user) {
    req.session.username = req.body.username;
    req.session.userlevel = user.level;

    if (user.level == "editor") {
      res.redirect("/editors");
    } else {
      res.redirect("/members");
    }
  } else {
    req.session.login_error = "Invalid username and/or password!";
    res.redirect("/login");
  }
});

// Signup page
router.get("/signup", async function(req, res)
{
  req.TPL.signup_error = req.session.signup_error;
  req.TPL.signup_success = req.session.signup_success;
  req.session.signup_error = "";
  req.session.signup_success = "";

  res.render("signup", req.TPL);
});

// Signup form submission
router.post("/attemptSignup", async function(req, res)
{
  var username = req.body.username ? req.body.username.trim() : "";
  var password = req.body.password ? req.body.password.trim() : "";

  if (username.length < 6 || password.length < 6) {
    req.session.signup_error = "Username/password cannot be less than 6 characters in length!";
    res.redirect("/login/signup");
  } else {
    await UsersModel.createUser(username, password, "member");
    req.session.signup_success = "User account created!";
    res.redirect("/login/signup");
  }
});

// Logout
router.get("/logout", function(req, res) {
  delete(req.session.username);
  delete(req.session.userlevel);
  res.redirect("/home");
});

module.exports = router;
