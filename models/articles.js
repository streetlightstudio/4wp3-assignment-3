const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

async function init() {
  try {
    db = await sqlite.open({
      filename: 'database.db',
      driver: sqlite3.Database
    });
  } catch(err) {
      console.error(err);
  }
}

init();

// Return all of the articles
async function getAllArticles()
{
  try {
    let results = await db.all("SELECT * FROM Articles");
    return results;
  } catch(err) {
    console.error("Error getting articles:", err);
    return [];
  }
}

// Create a new article given a title, content and username
async function createArticle(article,username)
{
  try {
    await db.run("INSERT INTO Articles VALUES (?,?,?)",
           [article.title, username, article.content]);
  } catch(err) {
    console.error("Error creating article:", err);
  }
}

// Delete an article by title
async function deleteArticle(title)
{
  try {
    await db.run("DELETE FROM Articles WHERE title = ?", [title]);
  } catch(err) {
    console.error("Error deleting article:", err);
  }
}

module.exports = {getAllArticles, createArticle, deleteArticle};
