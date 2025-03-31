import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
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
} from '@mui/material';
import ProfileNavbar from './ProfileNavbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        setUser(response.data.user);

        if (response.data.user.userType === 'studentUser') {
          const transactionResponse = await axiosInstance.get(
            `/transactions/student/${response.data.user.id}`
          );
          const studentTransaction = transactionResponse.data;

          if (studentTransaction) {
            const currentDate = new Date();
            const endDate = new Date(studentTransaction.endDate);

            if (endDate >= currentDate) {
              setTransactionStatus('available');
            } else {
              setTransactionStatus('apply');
            }
          } else {
            setTransactionStatus('apply');
          }
        }
      } catch (error) {
        console.error('Error fetching profile or transactions:', error);
        alert('An error occurred while fetching data.');
      }
    };

    const fetchMenus = async () => {
      try {
        const response = await axiosInstance.get('/menus');
        setMenus(response.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
        alert('An error occurred while fetching the menus.');
      }
    };

    fetchProfile();
    fetchMenus();
  }, []);

  const getDayName = (day) => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Specials',
    ];
    return days[day - 1] || 'Invalid day';
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
      <Container maxWidth="lg" className="mt-6">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} sm={3}>
            <Paper
              elevation={3}
              className="p-5 bg-gradient-to-b from-amber-50 to-orange-50 shadow-lg rounded-lg h-full"
            >
              <Typography
                variant="h6"
                className="text-amber-700 font-bold text-center mb-4"
              >
                Your Plan Status
              </Typography>
              <div className="text-center mb-6">
                {transactionStatus === 'available' ? (
                  <Button
                    variant="contained"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
                  >
                    Active Plan
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
              <ul className="space-y-4">
                <li>
                  <Button
                    variant="text"
                    className="w-full text-left text-gray-700 hover:text-amber-700 hover:bg-amber-100 px-4 py-2 rounded-lg transition duration-300"
                  >
                    Dashboard
                  </Button>
                </li>
                <li>
                  <Button
                    variant="text"
                    className="w-full text-left text-gray-700 hover:text-amber-700 hover:bg-amber-100 px-4 py-2 rounded-lg transition duration-300"
                  >
                    Edit Profile
                  </Button>
                </li>
                <li>
                  <Button
                    variant="text"
                    className="w-full text-left text-gray-700 hover:text-amber-700 hover:bg-amber-100 px-4 py-2 rounded-lg transition duration-300"
                  >
                    Transactions
                  </Button>
                </li>
                <li>
                  <Button
                    variant="text"
                    className="w-full text-left text-gray-700 hover:text-amber-700 hover:bg-amber-100 px-4 py-2 rounded-lg transition duration-300"
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
              className="p-5 bg-white shadow-lg rounded-lg border-t-4 border-amber-500"
            >
              <Typography
                variant="h4"
                gutterBottom
                className="text-amber-700 font-bold"
              >
                Profile
              </Typography>
              <Box mt={2}>
                <Typography variant="h6" className="text-gray-700">
                  Name: <span className="font-medium">{user.name}</span>
                </Typography>
                <Typography variant="h6" className="text-gray-700">
                  Email: <span className="font-medium">{user.email}</span>
                </Typography>
                <Typography variant="h6" className="text-gray-700">
                  User Type: <span className="font-medium">{user.userType}</span>
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={3}
              className="p-5 mt-5 bg-gradient-to-b from-orange-50 to-amber-50 shadow-lg rounded-lg"
            >
              <Typography
                variant="h5"
                gutterBottom
                className="text-amber-700 font-bold"
              >
                {showWeeklyMenu ? 'Weekly Menu' : "Today's Menu"}
              </Typography>
              <TableContainer component={Paper} className="shadow-md">
                <Table>
                  <TableHead className="bg-amber-100">
                    <TableRow>
                      <TableCell className="font-bold text-gray-700">
                        Day
                      </TableCell>
                      <TableCell className="font-bold text-gray-700">
                        Breakfast
                      </TableCell>
                      <TableCell className="font-bold text-gray-700">
                        Lunch
                      </TableCell>
                      <TableCell className="font-bold text-gray-700">
                        Snacks
                      </TableCell>
                      <TableCell className="font-bold text-gray-700">
                        Dinner
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showWeeklyMenu ? (
                      menus.map((menu) => (
                        <TableRow
                          key={menu.id}
                          className="hover:bg-amber-50 transition duration-300"
                        >
                          <TableCell>{getDayName(menu.day)}</TableCell>
                          <TableCell>{menu.breakfast}</TableCell>
                          <TableCell>{menu.lunch}</TableCell>
                          <TableCell>{menu.snacks}</TableCell>
                          <TableCell>{menu.dinner}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      currentDayMenu && (
                        <TableRow className="hover:bg-amber-50 transition duration-300">
                          <TableCell>
                            {getDayName(currentDayMenu.day)}
                          </TableCell>
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
              className="animate-fade-in"
            >
              <Button
                variant="contained"
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
                onClick={() => setShowWeeklyMenu(!showWeeklyMenu)}
              >
                {showWeeklyMenu ? "Today's Menu" : 'Weekly Menu'}
              </Button>
              <Button
                variant="contained"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
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