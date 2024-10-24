

// export default LoginForm;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Forgetpassword.css";

const OtpForm = () => {
  
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;



  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
     
      await axios.patch(`${API_URL}/users/forgetPassword`, {
        email,
      });

      // Extract token from response
    //   const { token } = response.data;

    //   // Fetch user profile data using the token
    //   const profileResponse = await axios.get(`${API_URL}/users/profile`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });

    
      // Navigate to profile page and pass profile data
      alert("otp Sent")
      navigate("/verifyOtp");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to send otp");
    }
  };

  return (
    <div id="login-form">
      <h1>Send Otp</h1>
      <form onSubmit={handleOtpSubmit}>
        <label htmlFor="email"> Enter your Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>

        </div>

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

export default OtpForm;
