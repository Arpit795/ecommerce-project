import { useEffect, useState, useCallback } from "react";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const loadCart = useCallback(() => {
    if (!user) return;

    axios
      .get(`https://ecommerce-project-dd5x.onrender.com/cart/${user.id}`)
      .then((res) => {
          if (Array.isArray(res.data)) {
            setCart(res.data);
          } else {
            console.error("Invalid cart data:", res.data);
            setCart([]); // prevent crash
          }
      });
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);


 
  const removeItem = (id) => {
    axios.get("https://ecommerce-project-dd5x.onrender.com/cart/remove/" + id)
      .then(() => {
        alert("Item removed");
        loadCart();
      });
  };

  // 
  const total = cart.reduce((sum, item) => {
  const price = Number(item.price) || 0;
  const discount = Number(item.discount) || 0;
  const isSale = Number(item.is_sale) === 1;

  const finalPrice = (isSale && discount > 0)
    ? price - (price * discount / 100)
    : price;

  return sum + finalPrice * item.quantity;
}, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 My Cart</h2>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map(item => {
        const price = Number(item.price) || 0;
        const discount = Number(item.discount) || 0;
        const isSale = Number(item.is_sale) === 1;

        const finalPrice = (isSale && discount > 0)
          ? price - (price * discount / 100)
          : price;

        return (
          <div key={item.id} style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "10px"
          }}>

            <img
              src={item.image_url || "https://via.placeholder.com/100"}
              alt={item.name}
              style={{ width: "100px", marginRight: "15px" }}
            />

            <div style={{ flex: 1 }}>
              <h3>{item.name}</h3>

              <p>
                {(item.is_sale === 1 && item.discount > 0) ? (
                  <>
                    <span style={{ textDecoration: "line-through", color: "gray" }}>
                      ₹ {item.price}
                    </span>
                    <br />
                    <span style={{ color: "red" }}>
                      ₹ {finalPrice}
                    </span>
                  </>
                ) : (
                  <>₹ {item.price}</>
                )}
              </p>

              <p>Qty: {item.quantity}</p>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              style={{
                background: "red",
                color: "white",
                padding: "8px",
                borderRadius: "5px"
              }}
            >
              Remove
            </button>

          </div>
        );
      })}

      {cart.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Total: ₹ {total}</h3>

          <a href="/checkout">
            <button style={{
              background: "green",
              color: "white",
              padding: "10px",
              borderRadius: "5px"
            }}>
              Proceed to Checkout
            </button>
          </a>
        </div>
      )}

    </div>
  );
}

export default Cart;