const sqlite3 = require('sqlite3').verbose();

// Connect to the products database
const db = new sqlite3.Database('./products.db', (err) => {
    if (err) {
        console.error("Error connecting to products database:", err.message);
    } else {
        console.log("Connected to the products database.");
    }
});

db.serialize(() => {
    // Enable foreign key constraints
    db.run(`PRAGMA foreign_keys = ON;`);

    // Attach the users database
    db.run(`ATTACH DATABASE './users.db' AS usersDb;`, (err) => {
        if (err) {
            console.error("Error attaching users database:", err.message);
        } else {
            console.log("Attached users database.");
        }
    });

    // Create the orders table (no cross-database foreign key constraint)
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_price REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `, (err) => {
        if (err) {
            console.error("Error creating orders table:", err.message);
        } else {
            console.log("Orders table created or already exists.");
        }
    });

    // Create the order_items table
    db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
            item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            total REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(product_id)
        );
    `, (err) => {
        if (err) {
            console.error("Error creating order_items table:", err.message);
        } else {
            console.log("Order_Items table created or already exists.");
        }
    });

    // Ensure the products table exists
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            price REAL NOT NULL
        );
    `, (err) => {
        if (err) {
            console.error("Error ensuring products table:", err.message);
        } else {
            console.log("Products table verified or created.");
        }
    });
});

db.close((err) => {
    if (err) {
        console.error("Error closing the database connection:", err.message);
    } else {
        console.log("Database setup complete. Connection closed.");
    }
});
