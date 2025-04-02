import React, { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import axiosInstance from "../../axiosConfig";
import ProfileNavbar from "./ProfileNavbar";
import ProfileSidebar from "./ProfileSidebar";
import ProfileDetails from "./ProfileDetails";
import MenuDisplay from "./MenuDetails";
import ActionButtons from "./ActionButtons";
import { keyframes } from "@emotion/react";

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState("Dashboard");
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = 240;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await axiosInstance.get("/auth/profile");
        const userData = profileResponse.data.user;
        setUser(userData);

        // Fetch transaction status if user is a student
        if (userData.userType === "studentUser") {
          try {
            const transactionResponse = await axiosInstance.get(
              `/transactions/student/${userData.id}`
            );
            const studentTransaction = transactionResponse.data;

            if (studentTransaction) {
              const currentDate = new Date();
              const endDate = new Date(studentTransaction.endDate);
              setTransactionStatus(endDate >= currentDate ? "available" : "apply");
            } else {
              setTransactionStatus("apply");
            }
          } catch (err) {
            console.error("Error fetching transaction:", err);
            setTransactionStatus("apply");
          }
        }

        // Fetch menus
        const menusResponse = await axiosInstance.get("/menus");
        setMenus(menusResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCurrentDayMenu = () => {
    const currentDay = new Date().getDay() + 1; // 1 = Sunday, 2 = Monday, etc.
    return menus.find((menu) => menu.day === currentDay);
  };

  const currentDayMenu = getCurrentDayMenu();

  if (loading) {
    return <ProfileLoading drawerWidth={drawerWidth} />;
  }

  return (
    <>
      <ProfileNavbar user={user} />
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        <ProfileSidebar 
          drawerWidth={drawerWidth} 
          transactionStatus={transactionStatus} 
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          fadeIn={fadeIn}
        />
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            marginLeft: isMobile ? 0 : '0px',
            width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
            overflowY: "auto",
            backgroundColor: "rgba(255, 248, 225, 0.1)",
            animation: `${fadeIn} 0.5s ease-out`,
          }}
        >
          <ProfileDetails user={user} />
          
          <MenuDisplay 
            showWeeklyMenu={showWeeklyMenu}
            setShowWeeklyMenu={setShowWeeklyMenu}
            menus={menus}
            currentDayMenu={currentDayMenu}
          />
          
          <ActionButtons />
        </Box>
      </Box>
    </>
  );
};

// Loading component
const ProfileLoading = ({ drawerWidth }) => (
  <Box sx={{ display: "flex" }}>
    <Box 
      sx={{ 
        width: drawerWidth,
        flexShrink: 0,
        backgroundColor: "rgba(245, 124, 0, 0.1)",
        height: "calc(100vh - 64px)"
      }} 
    />
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Skeleton content here */}
    </Box>
  </Box>
);

export default Profile;