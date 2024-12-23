// src/components/Navbar.jsx
import React from "react";
import { FaHome, FaListAlt, FaSignOutAlt, FaUnlockAlt } from "react-icons/fa";
import { useAuth } from "../Provider/AuthProvider";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
        logout();
        navigate('/');
    }
};

const handleHomeClick = () => {
  navigate('/main'); // Navigate to the home screen ("/" is the route for the home page)
};

  return (
    <div className="bg-zab-navbar  text-white p-4 h-14">
    <div className=" ml-10 flex justify-between items-center h-full">
      {/* Left Section */}
      <div className="flex justify-evenly items-center gap-2 flex-1">
        <div className="btn-nav">
          <FaListAlt />
        </div>
        <div className="btn-nav">
          <FaUnlockAlt />
        </div>
        <div className="btn-nav">
          <FaHome onClick={handleHomeClick} />
        </div>
      </div>
  
      {/* Right Section */}
      <div className="flex justify-end items-center flex-1 text-3xl text-zab-hombtn">
        {/* <FaSignOutAlt /> */}
      </div>

      <div className="flex justify-end items-center flex-1 text-3xl text-zab-hombtn">
        {/* <FaSignOutAlt /> */}
      </div>

      <div className="flex justify-end items-center flex-1 text-3xl text-zab-hombtn btn-nav">
        <FaSignOutAlt onClick={handleLogout}/>
      </div>
    </div>
  </div>
  
  );
};

export default Navbar;
