// // eslint-disable-next-line no-unused-vars
// import axios from "axios";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./AdminLogin.css";

// const AdminLoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   let [message, setmessage] = useState("");
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_URL;
//   let flag=true



//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Send login request with email and password
//       const response = await axios.post(`${API_URL}/auth/admin/login`, {
//         email,
//         password,
//       });

//       // Extract token from response
//       const { token } = response.data;
//       console.log(token);
     
//       if ( token){
//          //alert("Admin Logged in succesfully"); 
//         navigate("/admin-landing", { state: { profile: { token } } });

//       }
//       else{
//         alert("Incorrect Password")
//         flag=false
        
//         navigate("/admin")

//       }
//         // Fetch user profile data using the token
//         //const profileResponse = await axios.get(`${API_URL}/users/profile`, {
//         // headers: { Authorization: `Bearer ${token}` },
//         //});

//         //const profile = profileResponse.data;

//         // Navigate to profile page and pass profile data
        
//     } catch (error) {
//       console.error(" Admin Login failed:", error);
//       alert(
//         " Admin Login failed. Please check your credentials and try again."
//       );
//     }
//   };
//   if(flag==false){
//       const handleError = async (e) => {
//         e.preventDefault();
//         message = "incorrect Password";
//         setmessage(message);
//       };
//   }

//   return (
//     <div id="login-form">
//       <h1> Admin Login</h1>
//       <form onSubmit={handleLoginSubmit}>
//         <label htmlFor="email">Email:</label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <label htmlFor="password">Password:</label>
//         <input
//           type="password"
//           id="password"
//           name="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input type="submit" value="Submit" />
//         <p>{message}</p>
//       </form>
//       <button
//         onClick={() => navigate("/admin-landing")}
//         className="signup-button"
//       >
//         Sign Up
//       </button>
//     </div>
//   );
// };

// export default AdminLoginForm;
// eslint-disable-next-line no-unused-vars
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request with email and password
      const response = await axios.post(`${API_URL}/auth/admin/login`, {
        email,
        password,
      });

      // Extract token from response
      const { token } = response.data;
      console.log(token);
     
      if (token) {
        navigate("/admin-landing", { state: { profile: { token } } });
      } else {
        setMessage("Incorrect Password");
      }
    } catch (error) {
      console.error("Admin Login failed:", error);
      setMessage("Admin Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div id="login-form">
      <h1>Admin Login</h1>
      <form onSubmit={handleLoginSubmit}>
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
        <input type="submit" value="Submit" />
        {message && <p className="error-message">{message}</p>}
      </form>
      <button
        onClick={() => navigate("/adminSignup")}
        className="signup-button"
      >
        Sign Up
      </button>
    </div>
  );
};

export default AdminLoginForm;
