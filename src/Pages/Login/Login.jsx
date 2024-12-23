import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Provider/AuthProvider";
import axiosInstance from "../../Middleware/AxiosInstance";

import orangeLogo from "/icons/orange.png"
import biwtaLogo from "/icons/biwta.png"

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("auth/login", {
        zemail: userId,
        xpassword: password,
      });

      if (response.status === 200) {
        console.log(response)
        const { zid, token, xname, zorg, xwh } = response.data;
        if (!zid) {
          console.error("zid is missing in the response");
          alert("An error occurred: zid not found.");
          return;
        }

        login(userId, zid, token, xname, zorg, xwh);
        navigate("/main");
      } else if (response.status === 401) {
        logout();
        alert("Invalid credentials");
      }
    } catch (error) {
      if (error.response) {
        logout();
        alert("Invalid credentials");
      } else {
        logout();
        alert("An Error Occurred");
      }
    }
  };

  return (
    <div
      className="flex flex-col justify-between min-h-screen"
      style={{
        backgroundImage: `url('/img/loginbackground.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Main Content */}
      <div className="flex justify-center items-center flex-grow">
        <div
          className=" mx-0 px-0 mr-40"
          style={{ borderBottom: "10px solid blue" }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              background: "rgba(187, 192, 247, 0.6)",
              padding: "10px",
              paddingBottom: "0px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
              maxWidth: "380px",
              width: "100%",
            }}
          >
            <div
              className="flex items-center mb-1"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              {/* Logo */}
              <img
                src="/img/loginlogo.png"
                alt="Logo"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  transform: "rotate(10deg)",
                }}
              />

              {/* Heading */}
              <Typography
                variant="h5"
                gutterBottom
                style={{
                  width: "350px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  overflow: "hidden",
                  fontSize: "18px",
                  color: "#333",
                  textAlign: "left",
                  transform: "translateX(-20px)",
                }}
              >
                e-Prescription and Medical Store Management System
              </Typography>
            </div>

            <div className="relative h-[4px] flex items-center justify-center my-2">
              {/* Thin Line */}
              <div className="absolute top-1/2 -translate-y-1/2 w-[80%] h-px bg-blue-800"></div>
              {/* Thicker Middle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[10%] h-[4px] bg-blue-800"></div>
            </div>

            <Box
              mb={1}
              sx={{ width: "80%", marginRight: "0", marginLeft: "auto" }}
            >
              <div className="flex flex-col  p-2 pb-0 rounded-md ">
                <Typography
                  variant="body1"
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  User ID
                </Typography>

                <div className="flex items-center bg-white">
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: 12,
                        height: 8,
                        padding: 1,
                      },
                    }}
                  />
                </div>
              </div>
            </Box>

            <Box
              mb={3}
              sx={{ width: "80%", marginRight: "0", marginLeft: "auto" }}
            >
              <div className="flex flex-col  px-2  rounded-md ">
                <Typography
                  variant="body1"
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  Password
                </Typography>

                <div className="flex items-center bg-white">
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: 12,
                        height: 8,
                        padding: 1,
                      },
                    }}
                  />
                </div>
              </div>
            </Box>

            {/* Login Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "80%",
                marginLeft: "auto",
                marginRight: 0,
              }}
            >
              <Button
                variant="outlined"
                type="submit"
                fullWidth
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  width: "200px",
                  "&:hover": {
                    backgroundColor: "#1976d2",
                    color: "white",
                    borderColor: "#155a9c",
                  },
                }}
              >
                Login
              </Button>
            </div>
            <div
              className="w-full  h-4 mt-3"
              style={{
                // position: "absolute", // Position it absolutely to the parent container
                bottom: 0, // Align it to the bottom of the parent
                left: 0, // Make sure it stretches from the left
                right: 0,
              }}
            ></div>
          </Box>
        </div>
      </div>

      {/* Footer */}
      <div className="footer bg-blue-800 text-white text-center grid grid-cols-3 items-center py-2">
        <div></div>
        <p className="text-sm">© 2025 BIWTA. All rights reserved.</p>

        <div className="icon-div flex gap-10 items-center justify-end pr-10">
          <div className="flex items-center gap-2 text-xl font-black"><img src={biwtaLogo} alt="" className="w-10" /> <span>BIWTA</span></div>
          <div className="flex items-center text-left font-black"><img src={orangeLogo} alt="" className="w-28" /></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
