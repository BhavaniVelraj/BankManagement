// src/LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:8000/user/login", {
        params: { email, password },
      });

      setMessage(res.data.message);

      if (res.data.status === "Success") {
        localStorage.setItem("token", res.data.data.verify_token);
        localStorage.setItem("userId", res.data.data._id);
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Banking Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>{message}</p>
      <p>
        <a href="/kyc">Update KYC</a>
      </p>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "100px",
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    fontSize: "16px"
  },
  button: {
    padding: "10px",
    backgroundColor: "#1e90ff",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default LoginPage;
