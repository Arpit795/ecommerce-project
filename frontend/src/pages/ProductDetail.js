import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios.get(`https://ecommerce-project-dd5x.onrender.com/products/${id}`)
      .then(res => setProduct(res.data));
  }, [id]);

  return (
    <div>
      <h2>{product.name}</h2>
      
      <ul style={{ 
        paddingLeft: "20px", 
        lineHeight: "1.8",
        fontSize: "14px",
        color: "#444"
        }}>
        {product.description?.split("\n").map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>

      <p>₹ {product.price}</p>
    </div>
  );
}

export default ProductDetail;