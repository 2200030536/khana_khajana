import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import {
  Container,
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
} from "@mui/material";
import ProfileNavbar from "./ProfileNavbar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile");
        setUser(response.data.user);

        if (response.data.user.userType === "studentUser") {
          const transactionResponse = await axiosInstance.get(
            `/transactions/student/${response.data.user.id}`
          );
          const studentTransaction = transactionResponse.data;

          if (studentTransaction) {
            const currentDate = new Date();
            const endDate = new Date(studentTransaction.endDate);

            if (endDate >= currentDate) {
              setTransactionStatus("available");
            } else {
              setTransactionStatus("apply");
            }
          } else {
            setTransactionStatus("apply");
          }
        }
      } catch (error) {
        console.error("Error fetching profile or transactions:", error);
        alert("An error occurred while fetching data.");
      }
    };

    const fetchMenus = async () => {
      try {
        const response = await axiosInstance.get("/menus");
        setMenus(response.data);
      } catch (error) {
        console.error("Error fetching menus:", error);
        alert("An error occurred while fetching the menus.");
      }
    };

    fetchProfile();
    fetchMenus();
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
    const currentDay = new Date().getDay() + 1;
    return menus.find((menu) => menu.id === currentDay);
  };

  const currentDayMenu = getCurrentDayMenu();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography className="text-2xl font-bold text-gray-600 animate-pulse">
          Loading...
        </Typography>
      </div>
    );
  }

  return (
    <>
      <ProfileNavbar user={user} />
      <Container maxWidth="lg" style={{ marginTop: "20px" }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} sm={3}>
            <Paper
              elevation={3}
              style={{
                padding: "20px",
                background: "linear-gradient(to bottom, #fff8e1, #ffe0b2)",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="h6"
                style={{
                  color: "#f57c00",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                Your Plan Status
              </Typography>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                {transactionStatus === "available" ? (
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    Active Plan
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#f44336",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
              <ul style={{ listStyle: "none", padding: "0" }}>
                <li style={{ marginBottom: "12px" }}>
                  <Button
                    variant="text"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      color: "#616161",
                      padding: "10px",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ffe0b2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    Dashboard
                  </Button>
                </li>
                <li style={{ marginBottom: "12px" }}>
                  <Button
                    variant="text"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      color: "#616161",
                      padding: "10px",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ffe0b2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    Edit Profile
                  </Button>
                </li>
                <li style={{ marginBottom: "12px" }}>
                  <Button
                    variant="text"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      color: "#616161",
                      padding: "10px",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ffe0b2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    Transactions
                  </Button>
                </li>
                <li>
                  <Button
                    variant="text"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      color: "#616161",
                      padding: "10px",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ffe0b2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    Weekly Menu
                  </Button>
                </li>
              </ul>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} sm={9}>
            <Paper
              elevation={3}
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                borderTop: "4px solid #f57c00",
              }}
            >
              <Typography
                variant="h4"
                style={{
                  color: "#f57c00",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                Profile
              </Typography>
              <Box>
                <Typography variant="h6" style={{ color: "#616161" }}>
                  Name: <span style={{ fontWeight: "500" }}>{user.name}</span>
                </Typography>
                <Typography variant="h6" style={{ color: "#616161" }}>
                  Email: <span style={{ fontWeight: "500" }}>{user.email}</span>
                </Typography>
                <Typography variant="h6" style={{ color: "#616161" }}>
                  User Type:{" "}
                  <span style={{ fontWeight: "500" }}>{user.userType}</span>
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={3}
              style={{
                padding: "20px",
                marginTop: "20px",
                background: "linear-gradient(to bottom, #fff8e1, #ffe0b2)",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  color: "#f57c00",
                  fontWeight: "bold",
                  marginBottom: "16px",
                }}
              >
                {showWeeklyMenu ? "Weekly Menu" : "Today's Menu"}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead style={{ backgroundColor: "#ffe0b2" }}>
                    <TableRow>
                      <TableCell style={{ fontWeight: "bold", color: "#616161" }}>
                        Day
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#616161" }}>
                        Breakfast
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#616161" }}>
                        Lunch
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#616161" }}>
                        Snacks
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold", color: "#616161" }}>
                        Dinner
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showWeeklyMenu ? (
                      menus.map((menu) => (
                        <TableRow key={menu.day}>
                          <TableCell>{getDayName(menu.day)}</TableCell>
                          <TableCell>{menu.breakfast}</TableCell>
                          <TableCell>{menu.lunch}</TableCell>
                          <TableCell>{menu.snacks}</TableCell>
                          <TableCell>{menu.dinner}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      currentDayMenu && (
                        <TableRow>
                          <TableCell>{getDayName(currentDayMenu.day)}</TableCell>
                          <TableCell>{currentDayMenu.breakfast}</TableCell>
                          <TableCell>{currentDayMenu.lunch}</TableCell>
                          <TableCell>{currentDayMenu.snacks}</TableCell>
                          <TableCell>{currentDayMenu.dinner}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Box
              mt={3}
              display="flex"
              justifyContent="space-between"
              style={{ animation: "fade-in 0.3s ease" }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#f57c00",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
                onClick={() => setShowWeeklyMenu(!showWeeklyMenu)}
              >
                {showWeeklyMenu ? "Today's Menu" : "Weekly Menu"}
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#2196f3",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                Browse Plans
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Profile;