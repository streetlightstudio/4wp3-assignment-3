const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const bcrypt = require("bcrypt");

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
  try {
    // First, find the user by username
    let results = await db.all("SELECT * FROM Users WHERE username = ?", [username]);
    
    if (results.length > 0) {
      var user = results[0];
      // Compare the entered password with the hashed password using bcrypt
      var passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return user;
      }
    }
    
    return null;
  } catch(err) {
    console.error("Error finding user:", err);
    return null;
  }
}

// Create a new user with a username, password, and access level
async function createUser(username, password, level)
{
  try {
    // Hash the password before storing it
    var hashedPassword = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO Users VALUES (?,?,?)", [username, hashedPassword, level]);
  } catch(err) {
    console.error("Error creating user:", err);
  }
}

// Return all users
async function getAllUsers()
{
  let results = await db.all("SELECT * FROM Users");
  return results;
}

// Delete a user by username and all articles authored by that user
async function deleteUser(username)
{
  try {
    // Delete all articles authored by this user
    await db.run("DELETE FROM Articles WHERE username = ?", [username]);
    // Delete the user
    await db.run("DELETE FROM Users WHERE username = ?", [username]);
  } catch(err) {
    console.error("Error deleting user:", err);
  }
}

module.exports = {findUserByUsernameAndPassword, createUser, getAllUsers, deleteUser};
