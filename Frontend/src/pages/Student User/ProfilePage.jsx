import React, { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme, CircularProgress } from "@mui/material";
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from "../../axiosConfig";
import ProfileNavbar from "./ProfileNavbar";
import ProfileSidebar from "./ProfileSidebar";
import ProfileDetails from "./ProfileDetails";
import MenuDisplay from "./MenuDetails";
import ActionButtons from "./ActionButtons";
import { keyframes } from "@emotion/react";
import MealsPlans from "../Student User/MealsPlans";
import StudentDashboard from "./StudentDashboard";
// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Profile = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const { user } = useAuth();

  const [menus, setMenus] = useState([]);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = 240;

  // This effect monitors changes to activeComponent
  useEffect(() => {
    console.log("Active component changed to:", activeComponent);
  }, [activeComponent]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use user from AuthContext
        if (!user || !user.id) {
          setLoading(false);
          return;
        }

        // Fetch transaction status if user is a student
        if (user.userType === "studentUser") {
          try {
            const transactionResponse = await axiosInstance.get(
              `/transactions/student/${user.id}`
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

  // Map activeComponent values to their respective components with proper props
  const renderActiveComponent = () => {
    switch(activeComponent) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'browsePlans':
        return <MealsPlans />;
      case 'profile': // Changed to lowercase to match key in menuItems
        return <ProfileDetails user={user} />;
      case 'weeklyMenu':
        return <MenuDisplay 
              showWeeklyMenu={showWeeklyMenu}
              setShowWeeklyMenu={setShowWeeklyMenu}
              menus={menus}
              currentDayMenu={currentDayMenu}
            />
      default:
        return (
          <>
            <ProfileDetails user={user} />
            <MenuDisplay 
              showWeeklyMenu={showWeeklyMenu}
              setShowWeeklyMenu={setShowWeeklyMenu}
              menus={menus}
              currentDayMenu={currentDayMenu}
            />
            <ActionButtons />
          </>
        );
    }
  };

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
          activeItem={activeComponent}
          setActiveItem={setActiveComponent}
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
          {renderActiveComponent()}
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
    <Box 
      sx={{ 
        flexGrow: 1, 
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CircularProgress />
    </Box>
  </Box>
);

export default Profile;