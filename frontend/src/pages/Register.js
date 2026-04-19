import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = () => {
    axios.post("https://ecommerce-project-dd5x.onrender.com/auth/register", {
      email,
      password
    })
    .then(() => {
      alert("Registered successfully");
      navigate("/login"); // go to login
    })
    .catch(() => alert("Error registering"));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>📝 Register</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "8px", margin: "5px" }}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "8px", margin: "5px" }}
      />
      <br />

      <button
        onClick={register}
        style={{
          background: "green",
          color: "white",
          padding: "10px",
          marginTop: "10px"
        }}
      >
        Register
      </button>
    </div>
  );
}

export default Register;