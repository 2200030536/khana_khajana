import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";

const ProfileNavbar = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      alert("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <AppBar
      position="sticky"
      style={{
        background: "linear-gradient(135deg, #f57c00, #ef6c00)", // Gradient background
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow
      }}
    >
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section */}
        <Box style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Typography
            variant="h6"
            style={{
              color: "#fff",
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
            }}
          >
            Welcome, {user.name}
          </Typography>
          {user.userType === "student" && (
            <Typography
              variant="body1"
              style={{
                color: "#fff",
                fontWeight: "500",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              ID: {user.id}
            </Typography>
          )}
          <Typography
            variant="body1"
            style={{
              color: "#fff",
              fontWeight: "500",
              textTransform: "capitalize",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
            }}
          >
            ({user.userType})
          </Typography>
        </Box>

        {/* Right Section */}
        <div>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            style={{
              color: "#fff",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile Details</MenuItem>
            <MenuItem onClick={handleClose}>Update Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default ProfileNavbar;