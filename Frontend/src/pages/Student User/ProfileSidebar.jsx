import React from "react";
import axiosInstance from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import {
  Box, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Drawer,
  Button,
  Chip
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  MenuBook as MenuBookIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon
  
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";

// Define pulse animation
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;


const ProfileSidebar = ({ drawerWidth, transactionStatus, activeItem, setActiveItem, fadeIn }) => {
    const navigate = useNavigate();
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
  
  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon />, key: "dashboard"},
    { label: "Browse Plans", icon: <ShoppingCartIcon />, key: "browsePlans"},
    { label: "Weekly Menu", icon: <MenuBookIcon />, key: "weeklyMenu"},
    { label: "Profile", icon: <EditIcon />, key: "profile"}, // Changed key to lowercase "profile"
  { label: "Transactions", icon: <ReceiptIcon />, key: "transactionsHistory"},
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          animation: `${fadeIn} 0.5s ease-out`,
        },
      }}
      PaperProps={{
        elevation: 4,
        sx: {
          width: drawerWidth,
          background: "linear-gradient(135deg, #f57c00, #ef6c00)",
          color: "#fff",
          borderRight: "none",
          boxShadow: "2px 0 15px rgba(0, 0, 0, 0.15)",
          overflowX: "hidden",
          zIndex: 10,
        },
      }}
    >
      <Box 
        sx={{ 
          p: 5, 
          textAlign: "center",
          animation: `${fadeIn} 0.7s ease-out`,
        }}
      >
      </Box>
      
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      
      <List component="nav" sx={{ p: 1.5 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.key}
            onClick={() => setActiveItem(item.key)}
            selected={activeItem === item.key}
            button // Add this prop to make it clickable
            sx={{
              borderRadius: 1.5,
              mb: index < menuItems.length - 1 ? 1 : 0,
              transition: "all 0.3s ease",
              backgroundColor: activeItem === item.key ? "rgba(255,255,255,0.15)" : "transparent",
              animation: `${fadeIn} ${0.3 + index * 0.1}s ease-out`,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: "translateX(5px)",
              },
              "&.Mui-selected": {
                backgroundColor: "rgba(255,255,255,0.15)",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "rgba(255,255,255,0.25)",
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: "#fff", 
                minWidth: 40,
                transition: "transform 0.2s ease",
                ...(activeItem === item.key && {
                  transform: "scale(1.2)",
                })
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: activeItem === item.key ? 600 : 400,
              }} 
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: "auto", p: 2 }}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#d84315",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: 2,
                  py: 1,
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(216, 67, 21, 0.3)",
                  "&:hover": {
                    backgroundColor: "#bf360c",
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 15px rgba(216, 67, 21, 0.4)",
                  }
                }}
              >
                Logout
              </Button>
            </Box>
    </Drawer>
  );
};

export default ProfileSidebar;