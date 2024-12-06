const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the database file
const dbPath = path.join(__dirname, 'products.db'); // This will create DB/products.db
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the products database.");
    }
});

// Serialize the operations to ensure execution order
db.serialize(() => {
    // Create the Products table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS Products (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            price REAL NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Error creating Products table:", err.message);
        } else {
            console.log("Products table created or already exists.");
        }
    });

    // Insert product data
    // Insert product data
const insertProducts = `
INSERT INTO Products (product_name, price) VALUES
('Turkey', 75.00),
('JOE''s Club', 75.00), -- Escaping the single quote by doubling it
('Serrano', 75.00),
('Tunacado', 75.00),
('Americano', 36.00),
('Latte', 55.00),
('Cappuccino', 49.00),
('Iced Latte', 55.00),
('Espresso', 30.00),
('Power Shake', 65.00),
('Pick Me up', 65.00),
('Green Tonic', 65.00),
('Go Away DOC', 65.00),
('Sports Juice', 65.00)
`;

db.run(insertProducts, (err) => {
if (err) {
    console.error("Error inserting products:", err.message);
} else {
    console.log("Products data inserted successfully.");
}
});
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error("Error closing database:", err.message);
    } else {
        console.log("Closed the database connection.");
    }
});
