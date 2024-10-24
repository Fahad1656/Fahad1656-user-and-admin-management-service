import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Getuserbyid.css";

const GetUserById = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const { profile } = location.state || {};
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/getuser/${userId}`, {
          headers: { Authorization: `Bearer ${profile.token}` },
        });
        console.log(response.data)
        setUserData(response.data);
      } catch (error) {
        console.error(
          "Error fetching user by ID:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserById();
  }, [API_URL, profile.token, userId]);

  if (!userData) {
    return <div>User Not Found</div>;
  }
console.log(userData.user.posts)
  // Use optional chaining to safely access properties
  const name = userData.user.name || "N/A";
  const age = userData.user.age || "N/A";
  const email = userData.user.email || "N/A";
  const jobPosition =
    userData.user.posts && userData.user.posts.length > 0
      ? userData.user.posts[0].title
      : "N/A";

const salary =
  userData.user.posts && userData.user.posts.length > 0
    ? userData.user.posts[0].salary
    : "N/A";

  return (
    <div className="user-data-page">
      <h1>User Data</h1>
      <div className="user-details">
        <div>
          <strong>Name:</strong> {name}
        </div>
        <div>
          <strong>Age:</strong> {age}
        </div>
        <div>
          <strong>Email:</strong> {email}
        </div>
        <div>
          <strong>Job Position:</strong> {jobPosition}
        </div>
        <div>
          <strong>User Salary:</strong> {salary}
        </div>
      </div>
    </div>
  );
};

export default GetUserById;
