import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import MessUserProfile from "./MessUserProfile";
import MenuManager from "./MenuManager";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
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

function MessUser() {
  const [activeComponent, setActiveComponent] = useState("dashboard");
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

  // Map activeComponent values to their respective components
  const componentMapping = {
    dashboard: <div>Dashboard Content</div>,
    editMenu: <MenuManager />,
    setPrice: <div>Set Price Content</div>,
    students: <div>Students Content</div>,
    transactions: <div>Transactions Content</div>,
    addRevokeUser: <div>Add/Revoke User Content</div>,
    profile: <MessUserProfile />, // Render the MessUserProfile component
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
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(to right, #fbe9e7, #ffe0b2)", // Softer amber gradient background
      }}
    >
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        PaperProps={{
          style: {
            width: "240px",
            background: "linear-gradient(135deg, #f57c00, #ef6c00)", // Softer amber gradient for sidebar
            color: "#fff",
            borderRight: "none",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Typography
          variant="h6"
          align="center"
          style={{
            padding: "16px",
            fontWeight: "bold",
            color: "#fff",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          Mess User Panel
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.key}
              onClick={() => setActiveComponent(item.key)}
              style={{
                backgroundColor:
                  activeComponent === item.key ? "rgba(255, 255, 255, 0.2)" : "transparent",
                borderRadius: "8px",
                margin: "4px 8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <ListItemIcon style={{ color: "#fff" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  style: {
                    fontWeight: activeComponent === item.key ? "bold" : "normal",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
        <Box mt="auto" p={2}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            style={{
              backgroundColor: "#d84315",
              color: "#fff",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#bf360c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#d84315")}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <AppBar position="static" style={{ backgroundColor: "#f57c00" }}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Mess Dashboard
            </Typography>
            <IconButton edge="end" color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Dynamic Content */}
        <div
          style={{
            flexGrow: 1,
            padding: "16px",
            background: "url('/images/background-pattern.png') no-repeat center center fixed", // Background image
            backgroundSize: "cover",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {componentMapping[activeComponent] || <div>Component not found</div>}
        </div>
      </div>
    </div>
  );
}

export default MessUser;