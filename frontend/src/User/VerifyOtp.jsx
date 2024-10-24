// export default LoginForm;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VerifyOtp.css";

const VerifyOtpForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users/verifyotp`, {
        email,
        otp,
      });

      // Extract token from response
      //   const { token } = response.data;

      //   // Fetch user profile data using the token
      //   const profileResponse = await axios.get(`${API_URL}/users/profile`, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });

      // Navigate to profile page and pass profile data
    
       navigate("/reset");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Incorrect Otp");
    }
  };

  return (
    <div id="login-form">
      <h1>Verify Otp</h1>
      <form onSubmit={handleVerifyOtpSubmit}>
        <label htmlFor="email"> Enter your Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="otp"> Enter your Otp:</label>
        <input
          type="otp"
          id="otp"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <div></div>

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

export default VerifyOtpForm;
