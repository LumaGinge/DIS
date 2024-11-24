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
  // Step 1: Create a new table with the desired schema
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

    // Step 2: Copy data from the old table to the new table
    db.run(`
      INSERT INTO users_new (id, firstName, lastName, email, password)
      SELECT id, firstName, lastName, email, password FROM users
    `, (err) => {
      if (err) {
        console.error("Error copying data to new table:", err.message);
        return;
      }
      console.log("Data copied to new table successfully.");

      // Step 3: Drop the old table
      db.run(`DROP TABLE users`, (err) => {
        if (err) {
          console.error("Error dropping old table:", err.message);
          return;
        }
        console.log("Old table dropped successfully.");

        // Step 4: Rename the new table to the original name
        db.run(`ALTER TABLE users_new RENAME TO users`, (err) => {
          if (err) {
            console.error("Error renaming table:", err.message);
            return;
          }
          console.log("Table renamed successfully.");
          
          // Close the database connection after all operations
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
