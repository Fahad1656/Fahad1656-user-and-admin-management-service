import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Adminlandingpage.css";

const AdminLandingPage = () => {
  const [userIdGet, setUserIdGet] = useState("");
  const [userIdcr, setUserIdcr] = useState("");
  const [userIdup, setUserIdup] = useState("");
  const [userIddel, setUserIddel] = useState("");
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [message, setMessage] = useState("");
  const [showGetUserByIdForm, setShowGetUserByIdForm] = useState(false);
  const [showCreateJobForm, setShowCreateJobForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = location.state || {};
  const API_URL = import.meta.env.VITE_API_URL;

  if (!profile) {
    navigate("/admin-login"); // Redirect if no profile data
    return null;
  }

  const handleGetAllUsers = () => {
    navigate("/admin/get-all-users", { state: { profile } });
  };

  const handleGetUserById = () => {
    if (userIdGet) {
      navigate(`/admin/get-user/${userIdGet}`, { state: { profile } });
    }
  };

  const handleUpdateUser = async () => {
    if (userIdup) {
      const updateData = {};
      if (title) updateData.title = title;
      if (salary) updateData.salary = salary;

      try {
        const response = await axios.patch(
          `${API_URL}/admin/update/user/${userIdup}`,
          updateData,
          {
            headers: { Authorization: `Bearer ${profile.token}` },
          }
        );
        if (response.status === 200) {
          setMessage("User has been updated successfully");
          setShowUpdateForm(false); // Hide the form after successful update
        } else {
          setMessage("Failed to update the user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        setMessage("Error updating user. Please try again.");
      }
    }
  };

  const handleDeleteUser = async () => {
    if (userIddel) {
      try {
        const response = await axios.delete(
          `${API_URL}/admin/delete/user/${userIddel}`,
          {
            headers: { Authorization: `Bearer ${profile.token}` },
          }
        );
        if (response.status === 200) {
          setMessage("The user has been deleted");
          setShowDeleteForm(false); // Hide the form after successful deletion
        } else {
          setMessage("Failed to delete the user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        setMessage("Error deleting user. Please try again.");
      }
    }
  };

  const handleCreateJobUser = async () => {
    if (userIdcr) {
      try {
        // Check if user exists
        const response = await axios.get(
          `${API_URL}/admin/getuser/${userIdcr}`,
          {
            headers: { Authorization: `Bearer ${profile.token}` },
          }
        );

        if (response.data) {
          navigate(`/admin/allocate-job/${userIdcr}`, { state: { profile } });
        }
      } catch (error) {
        console.error("User not found:", error);
        alert("User not found. Please check the User ID.");
      }
    }
  };

  return (
    <div id="admin-landing-page">
      <h1>Admin Dashboard</h1>
      <button onClick={handleGetAllUsers} className="action-button">
        Get All Users
      </button>

      <div>
        <button
          onClick={() => setShowGetUserByIdForm(!showGetUserByIdForm)}
          className="action-button"
        >
          Get User by ID
        </button>
        {showGetUserByIdForm && (
          <div>
            <input
              type="text"
              placeholder="Enter User ID"
              value={userIdGet}
              onChange={(e) => setUserIdGet(e.target.value)}
            />
            <button id="submit-button" onClick={handleGetUserById}>
              Submit
            </button>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setShowCreateJobForm(!showCreateJobForm)}
          className="action-button"
        >
          Allocate Job Position of a User
        </button>
        {showCreateJobForm && (
          <div>
            <input
              type="text"
              placeholder="Enter the ID of the User"
              value={userIdcr}
              onChange={(e) => setUserIdcr(e.target.value)}
            />
            <button id="submit-button" onClick={handleCreateJobUser}>
              Submit
            </button>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setShowUpdateForm(!showUpdateForm)}
          className="action-button"
        >
          Update User Job Position
        </button>
        {showUpdateForm && (
          <div>
            <input
              type="text"
              placeholder="Enter User ID to Update"
              value={userIdup}
              onChange={(e) => setUserIdup(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter New Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter New Salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            <button id="submit-button" onClick={handleUpdateUser}>
              Submit
            </button>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setShowDeleteForm(!showDeleteForm)}
          className="action-button"
        >
          Delete User
        </button>
        {showDeleteForm && (
          <div>
            <input
              type="text"
              placeholder="Enter User ID to Delete"
              value={userIddel}
              onChange={(e) => setUserIddel(e.target.value)}
            />
            <button id="submit-button" onClick={handleDeleteUser}>
              Submit
            </button>
          </div>
        )}
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminLandingPage;
