import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Chip,
  Divider,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  MenuBook as MenuBookIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import ProfileNavbar from "./ProfileNavbar";

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
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
        console.log("Fetched menus:", menusResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDayName = (day) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Specials",
    ];
    return days[day - 1] || "Invalid day";
  };

  const getCurrentDayMenu = () => {
    const currentDay = new Date().getDay() + 1; // 1 = Sunday, 2 = Monday, etc.
    console.log("Current day:", currentDay);
    const todayMenu = menus.find((menu) => menu.day === currentDay);
    console.log("Today's menu:", todayMenu);
    return todayMenu;
  };

  const currentDayMenu = getCurrentDayMenu();

  // Menu items for sidebar
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Edit Profile", icon: <EditIcon /> },
    { text: "Transactions", icon: <ReceiptIcon /> },
    { text: "Weekly Menu", icon: <MenuBookIcon /> }
  ];

  if (loading) {
    return (
      <>
        <ProfileNavbar user={{ name: "", email: "", userType: "" }} />
        <Box sx={{ display: "flex" }}>
          <Skeleton
            variant="rectangular"
            width={drawerWidth}
            height="calc(100vh - 64px)"
            sx={{ flexShrink: 0 }}
          />
          <Box sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px` }}>
            <Skeleton variant="rectangular" height={200} />
            <Box mt={3}>
              <Skeleton variant="rectangular" height={300} />
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <ProfileNavbar user={user} />
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        {/* Fixed Sidebar */}
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
          {/* <Box
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
          </Box> */}

          {/* <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} /> */}
          <br></br>
          <br></br>
          <br></br>
          <br></br>

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

        {/* Main Content - Ensure it doesn't overlap with sidebar */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: isMobile ? 0 : '0px', // No need for margin as Drawer is outside the flow
            width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
            overflowY: "auto",
            backgroundColor: "rgba(255, 248, 225, 0.1)",
            animation: `${fadeIn} 0.5s ease-out`,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: "#ffffff",
              borderRadius: 2,
              borderTop: "4px solid #f57c00",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
              }
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "#f57c00",
                fontWeight: 600,
                mb: 3,
              }}
            >
              Profile Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Full Name
                  </Typography>
                  <Typography variant="h6">{user.name}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email Address
                  </Typography>
                  <Typography variant="h6">{user.email}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    User Type
                  </Typography>
                  <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                    {user.userType}
                  </Typography>
                </Box>
              </Grid>

              {user.id && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ID Number
                    </Typography>
                    <Typography variant="h6">{user.id}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 3,
              background: "linear-gradient(to bottom, #fff8e1, #ffe0b2)",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
              }
            }}
          >
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#f57c00",
                  fontWeight: 600,
                }}
              >
                {showWeeklyMenu ? "Weekly Menu" : "Today's Menu"}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => setShowWeeklyMenu(!showWeeklyMenu)}
                sx={{
                  color: "#f57c00",
                  borderColor: "#f57c00",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#e65100",
                    backgroundColor: "rgba(245, 124, 0, 0.04)",
                    transform: "translateX(3px)",
                  }
                }}
              >
                {showWeeklyMenu ? "View Today's Menu" : "View Weekly Menu"}
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                borderRadius: 1.5,
                overflow: "hidden"
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: "#f57c00" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                      Day
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                      Breakfast
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                      Lunch
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                      Snacks
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                      Dinner
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showWeeklyMenu ? (
                    menus.length > 0 ? (
                      menus.map((menu) => (
                        <TableRow
                          key={menu.day}
                          sx={{
                            "&:nth-of-type(odd)": { backgroundColor: "rgba(255, 248, 225, 0.5)" },
                            transition: "all 0.2s",
                            "&:hover": { backgroundColor: "rgba(255, 224, 178, 0.5)" }
                          }}
                        >
                          <TableCell><strong>{getDayName(menu.day)}</strong></TableCell>
                          <TableCell>{menu.breakfast}</TableCell>
                          <TableCell>{menu.lunch}</TableCell>
                          <TableCell>{menu.snacks}</TableCell>
                          <TableCell>{menu.dinner}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">No menu data available</Typography>
                        </TableCell>
                      </TableRow>
                    )
                  ) : currentDayMenu ? (
                    <TableRow>
                      <TableCell><strong>{getDayName(currentDayMenu.day)}</strong></TableCell>
                      <TableCell>{currentDayMenu.breakfast}</TableCell>
                      <TableCell>{currentDayMenu.lunch}</TableCell>
                      <TableCell>{currentDayMenu.snacks}</TableCell>
                      <TableCell>{currentDayMenu.dinner}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">No menu available for today</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "#2196f3",
                color: "#fff",
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 500,
                boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#1976d2",
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(33, 150, 243, 0.4)",
                }
              }}
            >
              Browse Plans
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;