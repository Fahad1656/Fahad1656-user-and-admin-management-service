import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GetAllUsers.css";

const GetAllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = location.state || {};
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!profile) {
      console.log("No profile found, redirecting to login.");
      navigate("/admin"); // Redirect if no profile data
      return;
    }

    console.log("Fetching all users...");
    const fetchAllUsers = async () => {
      try {
        console.log("Sending request to:", `${API_URL}/admin/users`);
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${profile.token}` },
        });
        console.log("Response received:", response.data);
        setAllUsers(response.data.users); // Use response.data.users here
      } catch (error) {
        console.error("Error fetching all users:", error);
        setError(error);
      }
    };

    fetchAllUsers();
  }, [API_URL, profile, navigate]);

  if (error) {
    console.error("Error state:", error);
    return <div>Error: {error.message}</div>;
  }

  if (!allUsers.length) {
    console.log("Loading state: No users found yet.");
    return <div>Loading...</div>;
  }

  return (
    <div className="users-container">
      <h1>All Users</h1>
      <ul className="users-list">
        {allUsers.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-details">
              <span className="user-label">Id:</span> {user.id}
              <br />
              <span className="user-label">Name:</span> {user.name}
              <br />
              <span className="user-label">Email:</span> {user.email}
              <br />
              <span className="user-label">Age:</span> {user.age}
              <br />
              <span className="user-label">Job position:</span>
              {user.posts.length > 0 ? user.posts[0].title : "N/A"}
              <br />
              <span className="user-label">User Salary:</span>
              {user.posts.length > 0 ? user.posts[0].salary : "N/A"}
              <br />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllUsers;
