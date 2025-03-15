import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate to redirect

const LogoutButton = () => {
  const navigate = useNavigate(); // To navigate after logging out

  const handleLogout = () => {
    // Clear the userId from localStorage
    localStorage.removeItem("userId");

    // Optionally, you can also clear other data from localStorage or sessionStorage
    // localStorage.removeItem("someOtherKey");

    // Redirect the user to the login page
    navigate("/"); // Or wherever you want to redirect after logout
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
