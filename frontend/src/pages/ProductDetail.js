import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(res => setProduct(res.data));
  }, [id]);

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>₹ {product.price}</p>
    </div>
  );
}

export default ProductDetail;