const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
var db = new sqlite3.Database("database.db");

async function init() {
  const saltRounds = 10;

  const mem1Hash = await bcrypt.hash('mem1', saltRounds);
  const mem2Hash = await bcrypt.hash('mem2', saltRounds);
  const edit1Hash = await bcrypt.hash('edit1', saltRounds);
  const edit2Hash = await bcrypt.hash('edit2', saltRounds);

  db.serialize(function(){

    // Create an initial table of users
    db.run("DROP TABLE IF EXISTS Users");
    db.run("CREATE TABLE Users (username TEXT, password TEXT, level TEXT)");
    db.run("INSERT INTO Users VALUES (?,?,?)", ['mem1', mem1Hash, 'member']);
    db.run("INSERT INTO Users VALUES (?,?,?)", ['mem2', mem2Hash, 'member']);
    db.run("INSERT INTO Users VALUES (?,?,?)", ['edit1', edit1Hash, 'editor']);
    db.run("INSERT INTO Users VALUES (?,?,?)", ['edit2', edit2Hash, 'editor']);

    // create an initial table of articles
    db.run("DROP TABLE IF EXISTS Articles");
    db.run("CREATE TABLE Articles (title TEXT, username TEXT, content TEXT)");
    db.run("INSERT INTO Articles VALUES (?,?,?)",
            ["My favourite places to eat",
             "mem1",
              "<p>My favourite places to eat are The Keg, Boston Pizza and" +
              "   McDonalds</p><p>What are your favourite places to eat?</p>"]);
    db.run("INSERT INTO Articles VALUES (?,?,?)",
            ["Tips for NodeJS",
             "mem2",
              "<p>The trick to understanding NodeJS is figuring out how " +
              "async I/O works.</p> <p>Callback functions are also very " +
              "important!</p>"]);
    db.run("INSERT INTO Articles VALUES (?,?,?)",
            ["Ontario's top hotels",
             "edit1",
              "<p>The best hotel in Ontario is the Motel 8 on highway 234</p>" +
              "<p>The next best hotel is The Sheraton off main street.</p>"]);

    console.log("Database initialized with hashed passwords.");
  });
}

init().catch(console.error);
