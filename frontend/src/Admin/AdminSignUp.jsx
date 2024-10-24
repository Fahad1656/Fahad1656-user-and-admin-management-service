// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminSignUp.css";

const AdminSignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Signing up with:", { name, email, age, password });
  // };

  const handleLogin = () => {
    navigate("/admin");
  };
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request with email and password
      await axios.post(`${API_URL}/admin/register`, {
        name,
        email,
       
        password,
      });
      setMessage("A new Admin has been registered.");
      console.log("dp");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please check your credentials and try again.");
    }
  };

  return (
    <div id="signup-form">
      <h1>Admin Sign Up</h1>
      <form onSubmit={handleAdminSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <input type="submit" value="Sign Up" />
      </form>
      <button onClick={handleLogin} className="login-button">
        Login
      </button>
      <div> {message && <p className="succsess">{message}</p>}</div>
    </div>
  );
};

export default AdminSignUpForm;
