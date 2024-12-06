const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const db = new sqlite3.Database('./DB/products.db');

// Endpoint to fetch products
router.get('/products', (req, res) => {
  const productName = req.query.name;

  if (productName) {
    db.get(
      'SELECT product_id FROM Products WHERE product_name = ?',
      [productName],
      (err, row) => {
        if (err) {
          console.error("Error fetching product ID:", err.message);
          return res.status(500).json({ error: "Failed to fetch product ID" });
        }
        if (row) {
          res.json(row); // Send the product ID
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      }
    );
  } else {
    db.all('SELECT * FROM Products', [], (err, rows) => {
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
router.post('/place-order', (req, res) => {
  const { orderItems } = req.body;
  console.log("Received order items:", orderItems);

  if (!orderItems || orderItems.length === 0 || !orderItems.every(item => item.productId)) {
    return res.status(400).json({ error: "Order items must include productId and quantity." });
  }

  const placeholders = orderItems.map(() => '?').join(',');
  const productIds = orderItems.map(item => item.productId);
  const quantities = Object.fromEntries(orderItems.map(item => [item.productId, item.quantity]));

  db.all(`SELECT * FROM Products WHERE product_id IN (${placeholders})`, productIds, (err, rows) => {
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

    console.log("Order cookie:", JSON.stringify(order));

    res.cookie('order', JSON.stringify(order), {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'Lax',
    });

    res.json({ order, totalOrderPrice });
  });
});

db.serialize(() => {
    db.run(`ATTACH DATABASE './DB/users.db' AS usersDb`, (err) => {
        if (err) {
            console.error("Error attaching users database:", err.message);
        } else {
            console.log("Users database attached successfully.");
        }
    });
});

router.post('/save-order', (req, res) => {
  const { userId, items, totalPrice } = req.body;

  // Validate input
  if (!userId || !items || !items.length || !totalPrice) {
      return res.status(400).json({ error: 'Invalid order data' });
  }

  // Validate user in the users database
  db.get(
      `SELECT id FROM usersDb.users WHERE id = ?`,
      [userId],
      (err, row) => {
          if (err) {
              console.error("Error validating user:", err.message);
              return res.status(500).json({ error: "Failed to validate user" });
          }

          if (!row) {
              return res.status(400).json({ error: "Invalid user ID" });
          }

          console.log("User validated:", row);

          // Insert the order into the orders table
          db.run(
              `INSERT INTO orders (user_id, total_price) VALUES (?, ?)`,
              [userId, totalPrice],
              function (err) {
                  if (err) {
                      console.error("Error inserting order:", err.message);
                      return res.status(500).json({ error: "Failed to save order" });
                  }

                  const orderId = this.lastID; // Get the newly created order ID
                  console.log("Order inserted with ID:", orderId);

                  // Insert items into the order_items table
                  const insertItems = db.prepare(`
                      INSERT INTO order_items (order_id, product_id, quantity, price, total)
                      VALUES (?, ?, ?, ?, ?)
                  `);

                  items.forEach(item => {
                      insertItems.run(
                          orderId,
                          item.productId,
                          item.quantity,
                          item.price,
                          item.quantity * item.price,
                          (err) => {
                              if (err) {
                                  console.error("Error inserting order item:", err.message);
                              }
                          }
                      );
                  });

                  insertItems.finalize(err => {
                      if (err) {
                          console.error("Error finalizing item inserts:", err.message);
                          return res.status(500).json({ error: "Failed to save order items" });
                      }

                      res.json({ message: 'Order saved successfully', orderId });
                  });
              }
          );
      }
  );
});

// Endpoint to get orders for a specific user
router.get('/get-orders/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
  }

  db.all(
      `SELECT o.order_id, o.total_price, oi.product_id, oi.quantity, oi.price, oi.total
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.user_id = ?`,
      [userId],
      (err, rows) => {
          if (err) {
              console.error("Error fetching user orders:", err.message);
              return res.status(500).json({ error: "Failed to fetch orders" });
          }

          // Group items by order
          const orders = rows.reduce((acc, row) => {
              if (!acc[row.order_id]) {
                  acc[row.order_id] = {
                      orderId: row.order_id,
                      totalPrice: row.total_price,
                      items: []
                  };
              }
              acc[row.order_id].items.push({
                  productId: row.product_id,
                  quantity: row.quantity,
                  price: row.price,
                  total: row.total
              });
              return acc;
          }, {});

          res.json(Object.values(orders)); // Return grouped orders
      }
  );
});



// Export the router
module.exports = router;
