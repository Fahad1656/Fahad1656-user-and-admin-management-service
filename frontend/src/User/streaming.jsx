// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { initAgora, leaveChannel } from "../agoraService";

// const Streaming = () => {
//   const location = useLocation();
//   const { profile } = location.state || {};
//   const user = profile?.user || {};

//   const [isStreaming, setIsStreaming] = useState(false);
//   const [role, setRole] = useState(""); // Add state for role

//   useEffect(() => {
//     if (isStreaming) {
//       initAgora(role); // Pass role to initAgora

//       return () => {
//         leaveChannel();
//         setIsStreaming(false);
//       };
//     }
//   }, [isStreaming, role]); // Include role in dependency array

//   const handleCreateStream = () => {
//     if (!isStreaming) {
//       setRole("host"); // Set role to host
//       setIsStreaming(true);
//     }
//   };

//   const handleJoinStream = () => {
//     if (!isStreaming) {
//       setRole("audience"); // Set role to audience
//       setIsStreaming(true);
//     }
//   };

//   const handleLeaveStream = async () => {
//     await leaveChannel();
//     setIsStreaming(false);
//   };

//   return (
//     <div id="streaming-container">
//       <h1>Streaming Options</h1>
//       <div className="streaming-item">
//         <button onClick={handleCreateStream}>Create Stream</button>
//       </div>
//       <div className="streaming-item">
//         <button onClick={handleJoinStream}>Join Stream</button>
//       </div>
//       <div className="streaming-item">
//         <button onClick={handleLeaveStream}>Leave Stream</button>
//       </div>
//       <div id="video-container">
//         <div id="local-video" style={{ width: "400px", height: "300px" }}></div>
//         <div
//           id="remote-video-container"
//           style={{ position: "relative", width: "800px", height: "600px" }} // Adjust size for remote videos
//         >
//           {/* Display the remote video */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Streaming;
