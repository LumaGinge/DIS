const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to the unified database.");
    }
});

db.serialize(() => {
    db.run(`PRAGMA foreign_keys = ON;`);

    // Fetch the schema of the orders table
    db.all(`PRAGMA table_info(orders)`, (err, tableInfo) => {
        if (err) {
            console.error("Error checking orders table schema:", err.message);
            return closeDatabase();
        }

        const columns = tableInfo.map((column) => column.name);
        let tasks = [];

        // Add 'location' column if it does not exist
        if (!columns.includes('location')) {
            tasks.push(new Promise((resolve, reject) => {
                db.run(`ALTER TABLE orders ADD COLUMN location TEXT NOT NULL DEFAULT ''`, (err) => {
                    if (err) {
                        console.error("Error adding 'location' column to orders table:", err.message);
                        reject(err);
                    } else {
                        console.log("'location' column added to orders table.");
                        resolve();
                    }
                });
            }));
        }

        // Add 'pickup_time' column if it does not exist
        if (!columns.includes('pickup_time')) {
            tasks.push(new Promise((resolve, reject) => {
                db.run(`ALTER TABLE orders ADD COLUMN pickup_time DATETIME`, (err) => {
                    if (err) {
                        console.error("Error adding 'pickup_time' column to orders table:", err.message);
                        reject(err);
                    } else {
                        console.log("'pickup_time' column added to orders table.");
                        resolve();
                    }
                });
            }));
        }

        // Wait for all tasks to finish before closing the database
        Promise.all(tasks)
            .then(() => {
                console.log("All modifications completed.");
                closeDatabase();
            })
            .catch(() => {
                console.error("Error during modifications.");
                closeDatabase();
            });
    });
});

function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error("Error closing database connection:", err.message);
        } else {
            console.log("Database modification complete. Connection closed.");
        }
    });
}
