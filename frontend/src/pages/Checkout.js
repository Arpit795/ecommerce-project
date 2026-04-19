import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("https://ecommerce-project-dd5x.onrender.com/cart/1")
      .then(res => setCart(res.data));
  }, []);

  const total = cart.reduce((sum, item) => {
  const finalPrice = (item.is_sale === 1 && item.discount > 0)
    ? item.price - (item.price * item.discount / 100)
    : item.price;

  return sum + finalPrice * item.quantity;
}, 0);

  const placeOrder = () => {
    console.log("User ID being sent:", user.id);
    axios.post("https://ecommerce-project-dd5x.onrender.com/order/checkout", {
      user_id: user.id,
      payment_method: paymentMethod
    })
    .then(res => {
      setOrderPlaced(true);
      setOrderId(res.data.order_id);
    })
    .catch(() => alert("Error placing order"));
  };

  // 🎉 ORDER SUCCESS UI
  if (orderPlaced) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Your Order ID: {orderId}</p>
        <a href="/orders">View Orders</a>
      </div>
    );
  }

  if (!user) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>⚠ Please login to continue</h2>
      <button onClick={() => navigate("/login")}>
        Go to Login
      </button>
    </div>
  );
}
  return (
    <div style={{ padding: "20px" }}>
      <h2>💳 Checkout</h2>

      {/* ADDRESS (dummy) */}
      <div style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "20px",
        borderRadius: "10px"
      }}>
        <h3>Delivery Address</h3>
        <p>Arpit Srivastava</p>
        <p>Delhi, India</p>
      </div>


      <div style={{
          border: "1px solid #ddd",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "10px"
        }}>
          <h3>Payment Method</h3>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ padding: "8px", width: "200px" }}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="BANK">Bank Transfer</option>
          </select>
     </div>

      {/* ORDER SUMMARY */}
      <div style={{
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "10px"
      }}>
        <h3>Order Summary</h3>

       {cart.map(item => {
  const finalPrice = (item.is_sale === 1 && item.discount > 0)
    ? item.price - (item.price * item.discount / 100)
    : item.price;

  return (
    <div key={item.id} style={{ marginBottom: "10px" }}>
      <p>{item.name} (x{item.quantity})</p>

      {(item.is_sale === 1 && item.discount > 0) ? (
        <p>
          <span style={{ textDecoration: "line-through", color: "gray" }}>
            ₹ {item.price * item.quantity}
          </span>
          <br />
          <span style={{ color: "red" }}>
            ₹ {finalPrice * item.quantity}
          </span>
        </p>
      ) : (
        <p>₹ {item.price * item.quantity}</p>
      )}
        </div>
        );
        })}

        <hr />
        <h3>Total: ₹ {total}</h3>

        <button
          onClick={placeOrder}
          style={{
            background: "green",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px"
          }}
        >
          Place Order
        </button>
      </div>

    </div>
    
  );
}

export default Checkout;