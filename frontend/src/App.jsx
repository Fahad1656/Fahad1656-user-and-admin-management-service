// eslint-disable-next-line no-unused-vars
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminLoginForm from "./Admin/AdminLogin";
import "./App.css";
import GetProfile from "./User/GetProfile";
import LoginForm from "./User/LoginForm";
import SignUpForm from "./User/SignUpForm";
import AdminLandingPage from "./Admin/AdminLandingPage";
import GetAllUsers from "./Admin/GetAllUsers";
import GetUserById from "./Admin/GetUserbyId";
import AllocateJob from "./Admin/AllocateJob";
import AdminSignUpForm from "./Admin/AdminSignUp";
import OtpForm from "./User/ForgetPassword";
import VerifyOtpForm from "./User/VerifyOtp";
import ResetForm from "./User/Reset";
import ChatBox from "./User/ChatBox";
import AgoraService from "./agoraService";
import useSocket from "./Socket";

///forgot-password

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/chat" element={<ChatBox />} />
        <Route path="/streaming" element={<AgoraService />} />
        <Route path="/admin" element={<AdminLoginForm />} />
        <Route path="/reset" element={<ResetForm />} />
        <Route path="/verifyOtp" element={<VerifyOtpForm />} />
        <Route path="forgot-password" element={<OtpForm />} />
        <Route path="/adminSignup" element={<AdminSignUpForm />} />
        <Route path="/admin/allocate-job/:userId" element={<AllocateJob />} />
        <Route path="/admin/get-user/:userId" element={<GetUserById />} />
        <Route path="/admin/get-all-users" element={<GetAllUsers />} />
        <Route path="/admin-landing" element={<AdminLandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/profile" element={<GetProfile />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </Router>
  );
}

export default App;
