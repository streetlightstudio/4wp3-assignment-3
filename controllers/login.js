const express = require('express');
var router = express.Router()
const ArticlesModel = require('../models/articles.js')
const UsersModel = require('../models/users.js')

// Displays the login page
router.get("/", async function(req, res)
{
  // if we had an error during form submit, display it, clear it from session
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";

  // render the login page
  res.render("login", req.TPL);
});

// Attempts to login a user
// - The action for the form submit on the login page.
router.post("/attemptlogin", async function(req, res)
{

  // Check if the username and password exist in the Users table
  var user = await UsersModel.findUserByUsernameAndPassword(req.body.username, req.body.password);

  if (user) {
    // set a session key username to login the user
    req.session.username = req.body.username;
    // store the user's access level in the session
    req.session.userlevel = user.level;

    // redirect to the appropriate page based on the user's level
    if (user.level == "editor") {
      res.redirect("/editors");
    } else {
      res.redirect("/members");
    }
  }
  else
  {
    // if we have an error, reload the login page with an error
    req.session.login_error = "Invalid username and/or password!";
    res.redirect("/login");
  }

});

// Displays the signup page
router.get("/signup", async function(req, res)
{
  // if we had an error or success message, display it, clear it from session
  req.TPL.signup_error = req.session.signup_error;
  req.TPL.signup_success = req.session.signup_success;
  req.session.signup_error = "";
  req.session.signup_success = "";

  // render the signup page
  res.render("signup", req.TPL);
});

// Attempts to signup a new user
router.post("/attemptSignup", async function(req, res)
{
  var username = req.body.username ? req.body.username.trim() : "";
  var password = req.body.password ? req.body.password.trim() : "";

  // Check if username and password are both at least 6 characters
  if (username.length < 6 || password.length < 6) {
    req.session.signup_error = "Username/password cannot be less than 6 characters in length!";
    res.redirect("/login/signup");
  } else {
    // Create the new user with member level
    await UsersModel.createUser(username, password, "member");
    req.session.signup_success = "User account created!";
    res.redirect("/login/signup");
  }
});

// Logout a user
// - Destroys the session key username that is used to determine if a user
// is logged in, re-directs them to the home page.
router.get("/logout", async function(req, res)
{
  delete(req.session.username);
  delete(req.session.userlevel);
  res.redirect("/home");
});

module.exports = router;
