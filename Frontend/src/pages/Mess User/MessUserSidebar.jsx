import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  Receipt as ReceiptIcon,
  PersonAdd as PersonAddIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const MessUserSidebar = ({ activeComponent, setActiveComponent, drawerWidth = 240 }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // You could show a toast notification here instead of alert
    }
  };

  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon />, key: "dashboard" },
    { label: "Edit Menu", icon: <MenuBookIcon />, key: "editMenu" },
    { label: "Set Price", icon: <AttachMoneyIcon />, key: "setPrice" },
    { label: "Students", icon: <GroupIcon />, key: "students" },
    { label: "Transactions", icon: <ReceiptIcon />, key: "transactions" },
    { label: "Add/Revoke User", icon: <PersonAddIcon />, key: "addRevokeUser" },
    { label: "Profile", icon: <AccountCircleIcon />, key: "profile" },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: isMobile ? 'none' : 'block', sm: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          animation: `${fadeIn} 0.5s ease-out`,
        },
      }}
      PaperProps={{
        sx: {
          width: drawerWidth,
          background: "linear-gradient(135deg, #f57c00, #ef6c00)",
          color: "#fff",
          borderRight: "none",
          boxShadow: "2px 0 15px rgba(0, 0, 0, 0.15)",
          overflowX: "hidden",
          zIndex: 10,
        }
      }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{
          padding: "16px",
          fontWeight: "bold",
          color: "#fff",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
          animation: `${fadeIn} 0.7s ease-out`,
        }}
      >
        Mess User Panel
      </Typography>
      
      <List sx={{ p: 1.5 }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={item.key}
            onClick={() => setActiveComponent(item.key)}
            sx={{
              borderRadius: 1.5,
              mb: 1,
              backgroundColor: activeComponent === item.key 
                ? "rgba(255, 255, 255, 0.2)" 
                : "transparent",
              animation: `${fadeIn} ${0.3 + index * 0.1}s ease-out`,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                transform: "translateX(5px)",
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: "#fff", 
                minWidth: 40,
                transition: "transform 0.2s ease",
                ...(activeComponent === item.key && {
                  transform: "scale(1.2)",
                })
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: activeComponent === item.key ? 600 : 400,
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

export default MessUserSidebar;