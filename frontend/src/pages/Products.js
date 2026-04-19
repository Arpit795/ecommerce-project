import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";



function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("NONE");
  const user = JSON.parse(localStorage.getItem("user"));

const addToCart = (productId) => {
  if (!user) {
    alert("Please login first");
    return;
  }

  axios.post("https://ecommerce-project-dd5x.onrender.com/cart/add", {
    user_id: user.id,
    product_id: productId,
    quantity: 1
  })
  .then(() => alert("Added to cart"));
};

  useEffect(() => {
    axios.get("https://ecommerce-project-dd5x.onrender.com/products")
      .then(res => setProducts(res.data));
  }, []);

  
  return (
    <div>
      <h2 style={{ textAlign: "center" }}> Product Catalog</h2>
      
      <div style={{ textAlign: "center", margin: "10px" }}>
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
        />
      </div>

      <div style={{ textAlign: "center", margin: "10px" }}>
        <select onChange={(e) => setFilter(e.target.value)}>
        <option value="ALL">All Products</option>
        <option value="LOW">Price &le;  1000</option>
        <option value="HIGH">Price &gt; 1000</option>
          <option value="SALE">On Sale</option>
          </select>
      </div>

      <div style={{ textAlign: "center", margin: "10px" }}>
        <select onChange={(e) => setSort(e.target.value)}>
          <option value="NONE">Sort</option>
          <option value="LOW_HIGH">Price Low → High</option>
          <option value="HIGH_LOW">Price High → Low</option>
        </select>
      </div>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        {products
  .filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

    let matchesFilter = true;

    if (filter === "LOW") {
      matchesFilter = p.price <= 1000;
    } else if (filter === "HIGH") {
      matchesFilter = p.price > 1000;
    } else if (filter === "SALE") {
      matchesFilter = p.is_sale === 1;
    }

    return matchesSearch && matchesFilter;
  })
  
  .sort((a, b) => {
  if (sort === "LOW_HIGH") return a.price - b.price;
  if (sort === "HIGH_LOW") return b.price - a.price;
  return 0;
})

  .map((p) => {
    const finalPrice =
      p.is_sale === 1 && p.discount > 0
        ? p.price - (p.price * p.discount / 100)
        : p.price;

    return (
      <div
        key={p.id}
        style={{
          border: "1px solid #ddd",
          margin: "15px",
          padding: "15px",
          width: "220px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <img
          src={p.image_url}
          alt={p.name}
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />

        <Link to={`/product/${p.id}`}>
          <h3>{p.name}</h3>
        </Link>

        <p>
          {p.is_sale === 1 && p.discount > 0 ? (
            <>
              <span style={{ textDecoration: "line-through", color: "gray" }}>
                ₹ {p.price}
              </span>
              <br />
              <span style={{ color: "red", fontWeight: "bold" }}>
                ₹ {finalPrice}
              </span>
              <br />
              <span style={{ color: "green" }}>{p.discount}% OFF</span>
            </>
          ) : (
            <>₹ {p.price}</>
          )}
        </p>

        <button
          onClick={() => addToCart(p.id)}
          style={{
            background: "black",
            color: "white",
            padding: "8px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>

        {p.is_sale === 1 && <p style={{ color: "red" }}>🔥 SALE</p>}
      </div>
    );
  })}
      </div>
    </div>
  );
}

export default Products;