const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); 


// samler på tværs af tabeller
const db = new sqlite3.Database('./DB/users.db', (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log("Connected to the unified database.");
    }
});

// foreign key tillades
db.run(`PRAGMA foreign_keys = ON;`);

// henter produkter fra databasen
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

// tillader brugeren at placere en ordre, men dette kræver at brugeren har en gyldig JWT token
router.post('/place-order', authenticateToken, (req, res) => {
  const userId = req.user.id; // Extract userId from JWT
  const { orderItems, location, pickupTime } = req.body;

  if (!orderItems || orderItems.length === 0 || !location || !pickupTime) {
      return res.status(400).json({ error: "Invalid order data. Include productId, quantity, location, and pickup time." });
  }

  const placeholders = orderItems.map(() => '?').join(','); // bruges til dynamisk at indsætte værdier i SQL-forespørgslen
  const productIds = orderItems.map(item => item.productId); // henter produktID'er fra orderItems som bruges til parameter i SQL-forespørgslen
  const quantities = Object.fromEntries(orderItems.map(item => [item.productId, item.quantity])); // laver et objekt med produktID som nøgle og antal som værdi

  db.all(`SELECT * FROM products WHERE product_id IN (${placeholders})`, productIds, (err, rows) => { // henter produkterne fra databasen baseret på produktID
      if (err) {
          console.error("Error fetching products for order:", err.message);
          return res.status(500).json({ error: "Failed to process order." });
      }

      const order = rows.map(product => ({ // laver et array med de nødvendige felter for ordren
          productId: product.product_id,
          productName: product.product_name,
          price: product.price,
          quantity: quantities[product.product_id],
          total: product.price * quantities[product.product_id],
      }));

      const totalOrderPrice = order.reduce((sum, item) => sum + item.total, 0); // beregner den samlede pris for ordren

      db.run(
          `INSERT INTO orders (user_id, total_price, location, pickup_time) VALUES (?, ?, ?, ?)`,
          [userId, totalOrderPrice, location, pickupTime],
          function (err) {
              if (err) {
                  console.error("Error inserting order:", err.message);
                  return res.status(500).json({ error: "Failed to save order." });
              }

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
});


// orderen gemmes i databasen efter at brugeren har bekræftet ordren dette tjekkes også ved hjælp af JWT token
router.post('/save-order', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { items, totalPrice } = req.body;

  if (!items || !items.length || !totalPrice) {
      return res.status(400).json({ error: 'Invalid order data.' });
  }

  db.run( // indsætter ordren i orders tabellen
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

          items.forEach(item => { // indsætter hver vare i ordren i order_items tabellen
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
  const userId = req.user.id; // henter brugerens ID fra JWT token og bruger det til at hente brugerens ordrer fra databasen

  db.all(
    `SELECT o.order_id, o.total_price, o.location, o.pickup_time, oi.product_id, oi.quantity, oi.price, oi.total
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
            location: row.location,
            pickupTime: row.pickup_time,
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

      res.json(Object.values(orders)); // returnerer brugerens ordrer som et array
    }
  );
});


// Export the router
module.exports = router;
