import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./AllocateJob.css";

const AllocateJob = () => {
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [userid, setUserId] = useState("");
  const [error, setError] = useState(null);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = location.state || {};
  const API_URL = import.meta.env.VITE_API_URL;

  // Check if profile exists; if not, navigate to login page
  useEffect(() => {
    if (!profile) {
      navigate("/admin-login");
    }
  }, [profile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericUserId = Number(userid);

    if (isNaN(numericUserId)) {
      setError("Invalid User ID");
      return;
    }

    const payload = { title, salary, userid: numericUserId };

    try {
      const response = await axios.post(
        `${API_URL}/admin/create/userpost`,
        payload,
        {
          headers: { Authorization: `Bearer ${profile.token}` },
        }
      );
      console.log(response.data);
      setIsSuccessful(true);
    } catch (error) {
      console.error("Error allocating job:", error);
      console.error("Response data:", error.response?.data);
      setError(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isSuccessful) {
      // Pass the profile object in navigation
      navigate("/admin-landing", { state: { profile } });
    }
  }, [isSuccessful, navigate, profile]);

  return (
    <div className="allocate-job-container">
      <h1>Allocate Job Position</h1>
      <form onSubmit={handleSubmit} className="allocate-job-form">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Salary:
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          User ID:
          <input
            type="text"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Allocate Job</button>
        {error && <p className="error-message">Error: {error}</p>}
      </form>
    </div>
  );
};

export default AllocateJob;
