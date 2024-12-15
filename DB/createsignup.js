const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const dbPath = path.join(__dirname, 'users.db'); 
const db = new sqlite3.Database(dbPath, (err) => {
 if (err) {
   console.error("Error opening database:", err.message);
 } else {
   console.log("Connected to the users database.");
 }
});


db.serialize(() => {
 db.run(`
   CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     firstName TEXT,
     lastName TEXT,
     email TEXT UNIQUE,
     password TEXT
   )
 `, (err) => {
   if (err) {
     console.error("Error creating users table:", err.message);
   } else {
     console.log('User table created or already exists.');
   }
 });
});


db.close((err) => {
 if (err) {
   console.error("Error closing database:", err.message);
 } else {
   console.log('Closed the database connection.');
 }
});
