const express = require("express");
const router = express.Router();
const db = require("../db");

// Add to cart
router.post("/add", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  db.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [user_id, product_id, quantity],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Added to cart");
    }
  );
});

// Get cart items
router.get("/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  db.query(
    `SELECT cart.*, products.name, products.price, products.discount, products.is_sale, products.image_url
     FROM cart 
     JOIN products ON cart.product_id = products.id 
     WHERE user_id = ?`,
    [user_id],
    (err, result) => {
      if (err) return res.send(err);
      res.json(result);
    }
  );
});

// Update quantity
router.put("/update", (req, res) => {
  const { cart_id, quantity } = req.body;

  db.query(
    "UPDATE cart SET quantity = ? WHERE id = ?",
    [quantity, cart_id],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Cart updated");
    }
  );
});

// Remove item
router.get("/remove/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM cart WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Item removed");
    }
  );
});

module.exports = router;