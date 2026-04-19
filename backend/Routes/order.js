const express = require("express");
const router = express.Router();
const db = require("../db");


// Checkout + Place Order
router.post("/checkout", (req, res) => {
  console.log("BODY:", req.body);
  const { user_id, payment_method } = req.body;
   const method = payment_method || "COD"; // default

  // get cart items
  db.query(
    "SELECT cart.*, products.price, products.discount, products.stock FROM cart JOIN products ON cart.product_id = products.id WHERE user_id = ?",
    [user_id],
    (err, cartItems) => {
      if (err) return res.send(err);

      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      console.log("Cart items:", cartItems);

      // NEW: CHECK STOCK
      for (let item of cartItems) {
        if (item.quantity > item.stock) {
          return res.send(`Not enough stock for product ID ${item.product_id}`);
        }
      }

      // calculate total
      let total = 0;
      cartItems.forEach(item => {
        const finalPrice = item.price - (item.price * item.discount / 100);
        total += finalPrice * item.quantity;
      });

      console.log("Total:", total);
      // create order
      db.query(
        "INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES (?, ?, ?, ?)",
        [user_id, total, "PLACED", method],
        (err, result) => {
          if (err) return res.send(err);

          const orderId = result.insertId;

          // insert order items + update stock
          cartItems.forEach(item => {

             const finalPrice = item.price - (item.price * item.discount / 100);

            // insert order item
        
            db.query(
              "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
              [orderId, item.product_id, item.quantity, finalPrice]
            );

            // NEW: REDUCE STOCK
            db.query(
              "UPDATE products SET stock = stock - ? WHERE id = ?",
              [item.quantity, item.product_id]
            );
          });

          // clear cart
          db.query("DELETE FROM cart WHERE user_id = ?", [user_id]);

          res.json({
            message: "Order placed successfully",
            order_id: orderId,
            total: total
          });
        }
      );
    }
  );
});

// Get order history
router.get("/history/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  db.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [user_id],
    (err, result) => {
      if (err) return res.send(err);

      if (result.length === 0) {
        return res.send("No orders found");
      }

      res.json(result);
    }
  );
});

// Get order details with products
router.get("/details/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  db.query(
    `SELECT 
  orders.id AS order_id, 
  orders.total_amount, 
  orders.status, 
  orders.created_at,
  order_items.quantity, 
  order_items.price AS final_price,
  products.name, 
  products.image_url, 
  products.price AS original_price, 
  products.discount
FROM orders
JOIN order_items ON orders.id = order_items.order_id
JOIN products ON products.id = order_items.product_id
WHERE orders.user_id = ?`,
    [user_id],
    (err, result) => {
      if (err) return res.send(err);
      res.json(result);
    }
  );
});

module.exports = router;