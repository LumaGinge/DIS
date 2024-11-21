const sqlite3 = require('sqlite3').verbose();

// Connect to the database
let db = new sqlite3.Database('newsletterDB.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the newsletterDB database.');
});

// Create table
db.run(`CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Table created or already exists.');
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the database connection.');
});