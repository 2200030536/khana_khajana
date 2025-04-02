import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Tooltip,
  Divider,
  Avatar,
  Fade,
} from "@mui/material";
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import axiosInstance from "../../axiosConfig";

const ProfileNavbar = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

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

  // Generate initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AppBar
      position="sticky"
      style={{
        background: "linear-gradient(135deg, #f57c00, #ef6c00)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Toolbar style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 1.5rem" }}>
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
              letterSpacing: "0.5px",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Welcome, {user.name}
          </Typography>
          
          {user.userType === "student" && (
            <Box 
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center", 
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: "4px",
                px: 1,
                py: 0.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  fontWeight: "500",
                }}
              >
                ID: {user.id}
              </Typography>
            </Box>
          )}
          
          <Typography
            variant="body1"
            sx={{
              color: "#fff",
              fontWeight: "500",
              textTransform: "capitalize",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
              borderRadius: "4px",
              bgcolor: "rgba(255,255,255,0.1)",
              px: 1,
              py: 0.5,
              display: { xs: "none", md: "block" },
            }}
          >
            {user.userType}
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Account settings" arrow>
            <IconButton
              edge="end"
              aria-label="account settings"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleMenu}
              sx={{
                color: "#fff",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                  transform: "scale(1.05)",
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                  border: "2px solid rgba(255, 255, 255, 0.7)",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                }}
              >
                {getInitials(user.name)}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              paper: {
                elevation: 3,
                sx: {
                  overflow: "visible",
                  mt: 1.5,
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                }
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 0.5 }} />
            
            <MenuItem 
              onClick={handleClose}
              sx={{ py: 1.5, gap: 1.5 }}
            >
              <PersonIcon fontSize="small" /> Profile Details
            </MenuItem>
            
            <MenuItem 
              onClick={handleClose}
              sx={{ py: 1.5, gap: 1.5 }}
            >
              <SettingsIcon fontSize="small" /> Settings
            </MenuItem>
            
            <Divider sx={{ my: 0.5 }} />
            
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                py: 1.5, 
                gap: 1.5,
                color: "#f44336"
              }}
            >
              <LogoutIcon fontSize="small" /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ProfileNavbar;