const express = require("express");
const router = express.Router();
const db = require("../db");



// GET all products
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// SEARCH products 
router.get("/search/:keyword", (req, res) => {
  const keyword = req.params.keyword;

  db.query(
    "SELECT * FROM products WHERE name LIKE ?",
    [`%${keyword}%`],
    (err, result) => {
      if (err) return res.send(err);

      if (result.length === 0) {
        return res.json({ message: "No products found" });
      }

      res.json(result);
    }
  );
});

// GET product by ID (details page)
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
    if (err) return res.send(err);

    if (result.length === 0) {
      return res.json({ message: "Product not found" });
    }

    res.json(result[0]);
  });
});

module.exports = router;