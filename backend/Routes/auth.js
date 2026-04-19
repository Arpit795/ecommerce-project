const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    (err, result) => {
      if (err) return res.send(err);
      res.send("User registered successfully");
    }
  );
});

module.exports = router;


const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // check user
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.send(err);

      if (result.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      const user = result[0];

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Wrong password" });
      }

      // create token
      const token = jwt.sign({ id: user.id }, "secretkey");

     res.json({
      id: user.id,
      email: user.email,
      token: token
      });
    }
  );
});