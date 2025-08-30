import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Fade,
} from '@mui/material';
import { AccountCircle, Notifications, Settings, Help, Logout } from '@mui/icons-material';
import axiosInstance from '../../axiosConfig';

const MessUserHeader = ({ activeComponent, setActiveComponent }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
    handleClose();
  };

  // Convert component key to display name
  const getPageTitle = () => {
    const titles = {
      dashboard: "Mess Dashboard",
      editMenu: "Menu Manager",
      setPrice: "Price Settings",
      students: "Student Details",
      transactions: "Transaction History",
      addRevokeUser: "User Management",
      profile: "My Profile",
    };
    
    return titles[activeComponent] || "Mess Dashboard";
  };
  
  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return "MU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: "#f57c00",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
          }}
        >
          {getPageTitle()}
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton color="inherit" size="large">
              <Notifications />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Help">
            <IconButton color="inherit" size="large">
              <Help />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Account Settings">
            <IconButton 
              edge="end" 
              color="inherit"
              onClick={handleMenu}
              size="large"
              sx={{
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
                }}
              >
                {user ? getInitials(user.name) : "MU"}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        
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
          {user && (
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          )}
          
          <Divider />
          
          <MenuItem onClick={() => { 
            setActiveComponent("profile"); 
            handleClose();
          }}>
            <AccountCircle sx={{ mr: 1.5 }} fontSize="small" />
            My Profile
          </MenuItem>
          
          <MenuItem onClick={handleClose}>
            <Settings sx={{ mr: 1.5 }} fontSize="small" />
            Settings
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <Logout sx={{ mr: 1.5 }} fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default MessUserHeader;