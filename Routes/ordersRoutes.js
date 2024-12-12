const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); // Import the authentication middleware


// Unified database connection
const db = new sqlite3.Database('./DB/users.db', (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to the unified database.");
    }
});

// Enable foreign key constraints
db.run(`PRAGMA foreign_keys = ON;`);

// Endpoint to fetch products
router.get('/products', (req, res) => {
    const productName = req.query.name;

    if (productName) {
        db.get(
            'SELECT product_id FROM products WHERE product_name = ?',
            [productName],
            (err, row) => {
                if (err) {
                    console.error("Error fetching product ID:", err.message);
                    return res.status(500).json({ error: "Failed to fetch product ID" });
                }
                if (row) {
                    res.json(row);
                } else {
                    res.status(404).json({ error: "Product not found" });
                }
            }
        );
    } else {
        db.all('SELECT * FROM products', [], (err, rows) => {
            if (err) {
                console.error("Error fetching products:", err.message);
                res.status(500).json({ error: "Failed to fetch products" });
            } else {
                res.json(rows);
            }
        });
    }
});

// Endpoint to place an order
router.post('/place-order', authenticateToken, (req, res) => {
  const userId = req.user.id; // Extract userId from JWT
  const { orderItems } = req.body;

  if (!orderItems || orderItems.length === 0 || !orderItems.every(item => item.productId && item.quantity)) {
      return res.status(400).json({ error: "Invalid order data. Include productId and quantity." });
  }

  processOrder(userId, orderItems, res);
});

function processOrder(userId, orderItems, res) {
  const placeholders = orderItems.map(() => '?').join(',');
  const productIds = orderItems.map(item => item.productId);
  const quantities = Object.fromEntries(orderItems.map(item => [item.productId, item.quantity]));

  db.all(`SELECT * FROM products WHERE product_id IN (${placeholders})`, productIds, (err, rows) => {
      if (err) {
          console.error("Error fetching products for order:", err.message);
          return res.status(500).json({ error: "Failed to process order." });
      }

      const order = rows.map(product => ({
          productId: product.product_id,
          productName: product.product_name,
          price: product.price,
          quantity: quantities[product.product_id],
          total: product.price * quantities[product.product_id],
      }));

      const totalOrderPrice = order.reduce((sum, item) => sum + item.total, 0);

      db.run(
        `INSERT INTO orders (user_id, total_price) VALUES (?, ?)`,
        [userId, totalOrderPrice],
        function (err) {
            if (err) {
                console.error("Error inserting order:", err.message);
                return res.status(500).json({ error: "Failed to save order." });
            }
    
            // Debugging log
            console.log(`Placing order for user ID: ${userId}`);
    
            const orderId = this.lastID;
            console.log(`Order inserted with ID: ${orderId}, for user ID: ${userId}`);
    
            const insertItems = db.prepare(`
                INSERT INTO order_items (order_id, product_id, quantity, price, total)
                VALUES (?, ?, ?, ?, ?)
            `);
    
            order.forEach(item => {
                insertItems.run(orderId, item.productId, item.quantity, item.price, item.total);
            });
    
            insertItems.finalize(err => {
                if (err) {
                    console.error("Error finalizing order items:", err.message);
                    return res.status(500).json({ error: "Failed to save order items." });
                }
    
                res.json({ message: 'Order placed successfully', orderId, totalOrderPrice, order });
            });
        }
    );
    
  });
}

// Endpoint to save order explicitly
router.post('/save-order', authenticateToken, (req, res) => {
  const userId = req.user.id; // Extract userId from JWT
  const { items, totalPrice } = req.body;

  if (!items || !items.length || !totalPrice) {
      return res.status(400).json({ error: 'Invalid order data.' });
  }

  db.run(
      `INSERT INTO orders (user_id, total_price) VALUES (?, ?)`,
      [userId, totalPrice],
      function (err) {
          if (err) {
              console.error("Error inserting order:", err.message);
              return res.status(500).json({ error: "Failed to save order." });
          }

          const orderId = this.lastID;
          console.log("Order inserted with ID:", orderId);

          const insertItems = db.prepare(`
              INSERT INTO order_items (order_id, product_id, quantity, price, total)
              VALUES (?, ?, ?, ?, ?)
          `);

          items.forEach(item => {
              insertItems.run(orderId, item.productId, item.quantity, item.price, item.quantity * item.price);
          });

          insertItems.finalize(err => {
              if (err) {
                  console.error("Error finalizing order items:", err.message);
                  return res.status(500).json({ error: "Failed to save order items." });
              }

              res.json({ message: 'Order saved successfully', orderId });
          });
      }
  );
});


router.get('/get-orders', authenticateToken, (req, res) => {
  const userId = req.user.id; // Extract the user ID from the verified token

  db.all(
    `SELECT o.order_id, o.total_price, oi.product_id, oi.quantity, oi.price, oi.total
     FROM orders o
     JOIN order_items oi ON o.order_id = oi.order_id
     WHERE o.user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching user orders:", err.message);
        return res.status(500).json({ error: "Failed to fetch orders." });
      }

      const orders = rows.reduce((acc, row) => {
        if (!acc[row.order_id]) {
          acc[row.order_id] = {
            orderId: row.order_id,
            totalPrice: row.total_price,
            items: [],
          };
        }
        acc[row.order_id].items.push({
          productId: row.product_id,
          quantity: row.quantity,
          price: row.price,
          total: row.total,
        });
        return acc;
      }, {});

      res.json(Object.values(orders)); // Return the structured orders
    }
  );
});

// Export the router
module.exports = router;
