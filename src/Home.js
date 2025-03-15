import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState(""); // ✅ Define username state
  const [password, setPassword] = useState(""); // ✅ Define password state
  const [message, setMessage] = useState(""); // ✅ Define message state
  const navigate = useNavigate(); // ✅ Hook to navigate after login

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId); // ✅ Store userId
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/CRUD"), 2000); // ✅ Redirect after login
      } else {
        setMessage("User ID not received, please try logging in.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login">
      <h1>MERCH COMP</h1>
      <h2>LOGIN</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
