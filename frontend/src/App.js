import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import OrderHistory from "./pages/OrderHistory";

function App() {

  const navStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    padding: "5px 10px"
  };

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  //  update user if localStorage changes
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  return (
    <BrowserRouter>
      <div>

        {/* NAVBAR */}
        <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          background: "#111",
          color: "white"
        }}>

          {/* LEFT */}
          <h2 style={{ margin: 0 }}>QuickCart</h2>
          <h3>Guid :d3d0c08b-fd4b-40b4-b7dc-07d99c49ef3e</h3>
          

          {/* CENTER */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/" style={navStyle}>Products</Link>
            <Link to="/cart" style={navStyle}>Cart</Link>
            <Link to="/orders" style={navStyle}>Orders</Link>

            {!user && (
              <>
                <Link to="/login" style={navStyle}>Login</Link>
                <Link to="/register" style={navStyle}>Register</Link>
              </>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {user ? (
              <>
                <span style={{ marginRight: "10px" }}>
                  Welcome, {user.email.split("@")[0]}
                </span>

                <button onClick={() => {
                  localStorage.removeItem("user");
                  setUser(null);
                }}>
                  Logout
                </button>
              </>
            ) : (
              <span>Guest</span>
            )}
          </div>

        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;