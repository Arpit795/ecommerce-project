const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/product");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const express = require("express");
const app = express();

app.use(express.json());

app.use(cors());
// connect auth routes
app.use("/auth", authRoutes);

app.use("/products", productRoutes);

app.use("/cart", cartRoutes);

app.use("/order", orderRoutes);

app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running ");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
