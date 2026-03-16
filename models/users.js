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

// Find a user by username and password
async function findUserByUsernameAndPassword(username, password)
{
  let results = await db.all("SELECT * FROM Users WHERE username = ? AND password = ?", [username, password]);
  if (results.length > 0) {
    return results[0];
  }
  return null;
}

// Create a new user with a username, password, and access level
async function createUser(username, password, level)
{
  await db.run("INSERT INTO Users VALUES (?,?,?)", [username, password, level]);
}

module.exports = {findUserByUsernameAndPassword, createUser};
