const express = require('express');
var router = express.Router()
const UsersModel = require('../models/users.js')
const ArticlesModel = require('../models/articles.js')

// Display the editors page
router.get("/", async function(req, res)
{
  // Get all users and articles
  let users = await UsersModel.getAllUsers();
  let articles = await ArticlesModel.getAllArticles();
  
  // Add the data to the template
  req.TPL.users = users;
  req.TPL.articles = articles;
  
  res.render("editors", req.TPL);
});

module.exports = router;
