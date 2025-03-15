import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState(""); // ✅ Define username state
  const [password, setPassword] = useState(""); // ✅ Define password state
  const [email, setEmail] = useState(""); // ✅ Define email state
  const [message, setMessage] = useState(""); // ✅ Define message state
  const [userId, setUserId] = useState(null); // ✅ Define userId state

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
        email, // Send email to backend
      });

      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId); // ✅ Store userId in localStorage
        setUserId(response.data.userId); // ✅ Update userId state
        setMessage("Registration successful!");

        // Optionally, you could send a success email here too.
      } else {
        setMessage("User ID not received, please try logging in.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button onClick={handleRegister}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
