import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GetProfile.css";

const GetProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = location.state || {};
  const user = profile?.user || {};

  const hasJobPosition = user.posts && user.posts.length > 0;
  const title = hasJobPosition ? user.posts[0].title : "Not Assigned Yet";
  const salary = hasJobPosition ? user.posts[0].salary : "N/A";

  if (!user) {
    return <div>No profile data available.</div>;
  }

  const handleJoinChat = () => {
    navigate("/chat", { state: { profile } });
  };
  const handleJoinstreaming=()=>{
    navigate("/streaming",{state:{profile}})

  }

  return (
    <div id="profile-container">
      <h1>User Profile</h1>
      <div className="profile-item">
        <strong>Name:</strong> {user.name}
      </div>
      <div className="profile-item">
        <strong>Email:</strong> {user.email}
      </div>
      <div className="profile-item">
        <strong>Age:</strong> {user.age}
      </div>
      <div className="profile-item">
        <strong>Job position:</strong> {title}
      </div>
      <div className="profile-item">
        <strong>Salary:</strong> {salary}
      </div>
      <button onClick={handleJoinChat}>Join Chat Room</button>

      <div>
        <button onClick={handleJoinstreaming}>Join in Stream</button>
      </div>
    </div>
  );
};

export default GetProfile;
