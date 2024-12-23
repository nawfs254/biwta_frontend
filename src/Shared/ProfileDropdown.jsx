import React, { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
  Button,
  TextField,
  Box,
  Modal,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Provider/AuthProvider";

const ProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const open = Boolean(anchorEl);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    handleClose();
  };

  const handleSubmit = () => {
    console.log("submit button clicked");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
      handleClose();
    }
  };

  const handleChangePassword = () => {
    console.log("Navigate to Change Password");
    handleClose();
  };

  return (
    <div>
      <Avatar
        sx={{
          cursor: "pointer",
          width: 30, // Set the width
          height: 30, // Set the height
          bgcolor: "primary.main",
          fontSize:13
        }}
        onClick={handleClick}
      >
        MR
      </Avatar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            overflow: "visible",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography sx={{ px: 2, pt: 1, fontWeight: "bold" }}>
          Moshiur Rahman
        </Typography>

        <Divider />
        <MenuItem onClick={handleOpenModal}>
          <ListItemIcon>
            <LockResetIcon fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" onClick={handleLogout} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="reset-password-modal"
        aria-describedby="reset-password-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="reset-password-modal"
            variant="h6"
            component="h2"
            mb={2}
          >
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Previous Password"
              type="password"
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              required
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, width: "100%" }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileDropdown;
