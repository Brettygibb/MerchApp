import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./Home";
import Register from "./register";
import CRUD from "./CRUD";
import LogoutButton from "./LogoutButton"; // Import the LogoutButton component

import "./App.css";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem("userId"); // Assuming userId is used to track authentication
};

// Protected Route component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />; // Redirect to login if not authenticated
};

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Login</Link> | <Link to="/register">Register</Link> |{" "}
        <Link to="/logout">Logout</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protect the /CRUD route */}
        <Route path="/CRUD" element={<ProtectedRoute element={<CRUD />} />} />

        {/* Route for Logout */}
        <Route path="/logout" element={<LogoutButton />} />
      </Routes>
    </Router>
  );
};

export default App;
