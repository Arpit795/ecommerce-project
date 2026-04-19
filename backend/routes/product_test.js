app.get("/products-test", (req, res) => {
  connection.query("SELECT * FROM products", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(data);
  });
});