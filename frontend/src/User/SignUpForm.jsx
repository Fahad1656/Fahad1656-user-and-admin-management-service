// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpForm.css";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
   const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Signing up with:", { name, email, age, password });
  // };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request with email and password
      await axios.post(`${API_URL}/users/register`, {
        name,
        email,
        age,
        password,
      });
      console.log("dp");
      setMessage("User has been registered")
    } catch (error) {
      console.error("Signup failed:", error);
      setMessage("User registration failed")
      // alert("Signup failed. Please check your credentials and try again.");
    }
  };

  return (
    <div id="signup-form">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
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
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
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
        {message && <p className="error-message">{message}</p>}
      </form>
      <button onClick={handleLogin} className="login-button">
        Login
      </button>
    </div>
  );
};

export default SignUpForm;
