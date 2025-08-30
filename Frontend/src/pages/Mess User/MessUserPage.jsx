import { useState } from "react";
import { Box } from "@mui/material";
import MessUserSidebar from "./MessUserSidebar";
import MessUserHeader from "./MessUserHeader";
import MessUserProfile from "./MessUserProfile";
import MenuManager from "./MenuManager";
import StudentDetails from "./StudentDetails";
import MessDashboard from "./MessDashboard";
import TransactionHistory from "./TransactionHistory";
import UserManagement from "./UserManagement";
import PriceSettings from "./PriceSettings";

function MessUserPage() {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  // Map activeComponent values to their respective components
  const componentMapping = {
    dashboard: <MessDashboard />,
    editMenu: <MenuManager />,
    setPrice: <PriceSettings />,
    students: <StudentDetails />,
    transactions: <TransactionHistory />,
    addRevokeUser: <UserManagement />,
    profile: <MessUserProfile />,
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <MessUserSidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(to right, #fbe9e7, #ffe0b2)",
        }}
      >
        <MessUserHeader activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
        
        <Box 
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            overflowY: "auto",
          }}
        >
          {componentMapping[activeComponent] || <div>Component not found</div>}
        </Box>
      </Box>
    </Box>
  );
}

export default MessUserPage;