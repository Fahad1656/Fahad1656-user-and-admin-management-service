import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import "./LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { saveToken } = useAuth(); // Get saveToken function from context
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request with email and password
      const response = await axios.post(`${API_URL}/auth/user/login`, {
        email,
        password,
      });

      // Extract token from response
      const { token } = response.data;
      saveToken(token); // Save token in context

      // Fetch user profile data using the token
      const profileResponse = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = profileResponse.data;

      // Navigate to profile page and pass profile data
      navigate("/profile", { state: { profile } });
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Incorrect Password");
    }
  };

  return (
    <div id="login-form">
      <h1>Login</h1>
      <form onSubmit={handleLoginSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="submit" value="Submit" />
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="forgot-password-button"
        >
          Forgot Password?
        </button>
        {message && <p className="error-message">{message}</p>}
      </form>
      <button onClick={() => navigate("/signup")} className="signup-button">
        Sign Up
      </button>
    </div>
  );
};

export default LoginForm;
