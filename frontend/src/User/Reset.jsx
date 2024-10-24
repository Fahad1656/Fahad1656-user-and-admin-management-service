import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Reset.css";

const ResetForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users/reset`, {
        email,
        password,
        confirmPassword,
      });

      alert("Password reset successful!");
      navigate("/login");
    } catch (error) {
      console.error("Password reset failed:", error);
      alert("Password reset failed. Please try again.");
    }
  };

  return (
    <div id="reset-form">
      <h1>Reset Password</h1>
      <form onSubmit={handleResetSubmit}>
        <label htmlFor="email">Enter your Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Enter your new Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="confirm-password">Confirm your new Password:</label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <input type="submit" value="Submit" />
      </form>
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="forgot-password-button"
      >
        Back to Login?
      </button>
    </div>
  );
};

export default ResetForm;
