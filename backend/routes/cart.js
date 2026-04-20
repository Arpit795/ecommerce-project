const express = require("express");
const router = express.Router();
const db = require("../db");

// Add to cart
router.post("/add", (req, res) => {
   console.log("BODY:", req.body); 
  const { user_id, product_id, quantity } = req.body;

 if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: "Missing data" });
  }

  const sql = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [user_id, product_id, quantity], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ success: true, message: "Added to cart" });
  });
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