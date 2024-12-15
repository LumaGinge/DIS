const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    return;
  }
  console.log("Connected to the users database.");
});

db.serialize(() => {
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      email TEXT UNIQUE,
      password TEXT,
      phoneNumber TEXT UNIQUE
    )
  `, (err) => {
    if (err) {
      console.error("Error creating new table:", err.message);
      return;
    }
    console.log("New table created successfully.");

   
    db.run(`
      INSERT INTO users_new (id, firstName, lastName, email, password)
      SELECT id, firstName, lastName, email, password FROM users
    `, (err) => {
      if (err) {
        console.error("Error copying data to new table:", err.message);
        return;
      }
      console.log("Data copied to new table successfully.");

      
      db.run(`DROP TABLE users`, (err) => {
        if (err) {
          console.error("Error dropping old table:", err.message);
          return;
        }
        console.log("Old table dropped successfully.");

        
        db.run(`ALTER TABLE users_new RENAME TO users`, (err) => {
          if (err) {
            console.error("Error renaming table:", err.message);
            return;
          }
          console.log("Table renamed successfully.");
          
          
          db.close((err) => {
            if (err) {
              console.error("Error closing database:", err.message);
            } else {
              console.log("Closed the database connection.");
            }
          });
        });
      });
    });
  });
});
