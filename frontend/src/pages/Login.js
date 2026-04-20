import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const login = () => {
  axios.post("https://ecommerce-project-dd5x.onrender.com/auth/login", {
    email,
    password
  })
  .then(res => {
    //  success only when status 200
    localStorage.setItem("user", JSON.stringify(res.data));
    setUser(res.data);
    alert("Login Success");
    navigate("/");
  })
  .catch(err => {
    //  handle backend errors properly
    if (err.response && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert("Login failed");
    }
  });
};

  return (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h2>🔐 Login</h2>

    <input
      placeholder="Email"
      onChange={e => setEmail(e.target.value)}
      style={{ padding: "8px", margin: "5px" }}
    />
    <br />

    <input
      type="password"
      placeholder="Password"
      onChange={e => setPassword(e.target.value)}
      style={{ padding: "8px", margin: "5px" }}
    />
    <br />

    <button
      onClick={login}
      style={{
        background: "black",
        color: "white",
        padding: "10px",
        marginTop: "10px"
      }}
    >
      Login
    </button>
    <p>
  Don’t have an account? <a href="/register">Register</a>
</p>
  </div>
);
}

export default Login;