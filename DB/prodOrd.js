const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to the unified database.");
    }
});

db.serialize(() => {
    // Enable foreign key constraints
    db.run(`PRAGMA foreign_keys = ON;`);

    // Create the Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phoneNumber TEXT UNIQUE
        )
    `, (err) => {
        if (err) {
            console.error("Error creating users table:", err.message);
        } else {
            console.log("Users table created or already exists.");
        }
    });

    // Create the Products table
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            price REAL NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Error creating products table:", err.message);
        } else {
            console.log("Products table created or already exists.");
        }
    });

    // Create the Orders table
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_price REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error("Error creating orders table:", err.message);
        } else {
            console.log("Orders table created or already exists.");
        }
    });

    // Create the Order Items table
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
        )
    `, (err) => {
        if (err) {
            console.error("Error creating order_items table:", err.message);
        } else {
            console.log("Order items table created or already exists.");
        }
    });

    // Insert sample products data (optional)
    const insertProducts = `
        INSERT INTO products (product_name, price) VALUES
        ('Turkey', 75.00),
        ('JOE''s Club', 75.00),
        ('Serrano', 75.00),
        ('Tunacado', 75.00),
        ('Americano', 36.00),
        ('Latte', 55.00),
        ('Cappuccino', 49.00),
        ('Iced Latte', 55.00),
        ('Espresso', 30.00),
        ('Power Shake', 65.00),
        ('Pick Me Up', 65.00),
        ('Green Tonic', 65.00),
        ('Go Away DOC', 65.00),
        ('Sports Juice', 65.00)
    `;

    db.run(insertProducts, (err) => {
        if (err) {
            console.error("Error inserting products data:", err.message);
        } else {
            console.log("Sample products data inserted successfully.");
        }
    });
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error("Error closing database connection:", err.message);
    } else {
        console.log("Database setup complete. Connection closed.");
    }
});
