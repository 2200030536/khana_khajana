import React from "react";
import axiosInstance from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import {
  Box, 
  Typography, 
  Divider, 
  List, 
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
import SidebarMenuItem from './SidebarMenuItem';

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
          <SidebarMenuItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            selected={activeItem === item.key}
            onClick={() => setActiveItem(item.key)}
            animation={fadeIn}
            delay={index}
          />
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