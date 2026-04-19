import { useEffect, useState } from "react";
import axios from "axios";

function OrderHistory() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);

  // ✅ Hook must always run
  useEffect(() => {
    if (user) {
      axios.get(`https://ecommerce-project-dd5x.onrender.com/order/details/${user.id}`)
        .then(res => setOrders(res.data));
    }
  }, [user]);

  // ✅ Now conditional rendering AFTER hooks
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Please login to view your orders</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 My Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((item, index) => {
        return (
          <div key={index} style={{
            border: "1px solid #ddd",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>

            <h3>Order ID: {item.order_id}</h3>
            <p>Status: {item.status}</p>

            <div style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px"
            }}>

              <img
                src={item.image_url}
                alt={item.name}
                style={{ width: "80px", marginRight: "15px" }}
              />

              <div>
                <p>{item.name}</p>
                <p>Qty: {item.quantity}</p>

                <p>
                  {item.discount > 0 ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "gray" }}>
                        ₹ {item.original_price}
                      </span>
                      <br />
                      <span style={{ color: "red" }}>
                        ₹ {item.final_price}
                      </span>
                    </>
                  ) : (
                    <>₹ {item.final_price}</>
                  )}
                </p>

              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}

export default OrderHistory;