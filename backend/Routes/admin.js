const express = require("express");
const router = express.Router();
const db = require("../db");

// Add product
router.post("/add-product", (req, res) => {
  const { name, description, price, stock } = req.body;

  db.query(
    "INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)",
    [name, description, price, stock],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Product added");
    }
  );
});

// Update product
router.put("/update-product/:id", (req, res) => {
  const id = req.params.id;
  const { name, price, stock } = req.body;

  db.query(
    "UPDATE products SET name=?, price=?, stock=? WHERE id=?",
    [name, price, stock, id],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Product updated");
    }
  );
});

// Delete product
router.get("/delete-product/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.send(err);

      if (result.affectedRows === 0) {
        return res.send("Product not found");
      }

      res.send("Product deleted");
    }
  );
});

module.exports = router;