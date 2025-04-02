import React from "react";
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
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";

// Define pulse animation
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const ProfileSidebar = ({ drawerWidth, transactionStatus, activeItem, setActiveItem, fadeIn }) => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Edit Profile", icon: <EditIcon /> },
    { text: "Transactions", icon: <ReceiptIcon /> },
    { text: "Weekly Menu", icon: <MenuBookIcon /> }
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
          p: 2.5, 
          textAlign: "center",
          animation: `${fadeIn} 0.7s ease-out`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 3,
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          Your Plan Status
        </Typography>
        
        {transactionStatus === "available" ? (
          <Chip
            label="Active Plan"
            color="success"
            sx={{ 
              p: 2.5, 
              fontSize: "1rem", 
              fontWeight: 500,
              boxShadow: "0 2px 10px rgba(76, 175, 80, 0.3)",
              animation: `${pulse} 2s infinite ease-in-out`,
            }}
          />
        ) : (
          <Button
            variant="contained"
            color="error"
            sx={{ 
              px: 3,
              py: 1,
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 15px rgba(244, 67, 54, 0.4)",
              }
            }}
          >
            Apply Now
          </Button>
        )}
      </Box>
      
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      
      <List component="nav" sx={{ p: 1.5 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.text}
            button
            selected={activeItem === item.text}
            onClick={() => setActiveItem(item.text)}
            sx={{
              borderRadius: 1.5,
              mb: index < menuItems.length - 1 ? 1 : 0,
              transition: "all 0.3s ease",
              backgroundColor: activeItem === item.text ? "rgba(255,255,255,0.15)" : "transparent",
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
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: "#fff", 
                minWidth: 40,
                transition: "transform 0.2s ease",
                ...(activeItem === item.text && {
                  transform: "scale(1.2)",
                })
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: activeItem === item.text ? 600 : 400,
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default ProfileSidebar;