import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Container, Typography, Box, Paper, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ProfileNavbar from './ProfileNavbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('An error occurred while fetching the profile.');
      }
    };

    const fetchMenus = async () => {
      try {
        const response = await axiosInstance.get('/menus');
        console.log('Fetched menus:', response.data);
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
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Specials"];
    return days[day - 1] || "Invalid day";
  };

  const getCurrentDayMenu = () => {
    const currentDay = new Date().getDay() + 1; // getDay() returns 0 for Sunday, 1 for Monday, etc.
    return menus.find(menu => menu.id === currentDay);
  };

  const currentDayMenu = getCurrentDayMenu();

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <ProfileNavbar user={user} />
      <Container maxWidth="lg" className="mt-24">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Paper elevation={3} className="p-5">
              <Typography variant="h6">Your Plan Status</Typography>
              {/* Add content for plan status */}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Paper elevation={3} className="p-5">
              <Typography variant="h4" gutterBottom>
                Profile
              </Typography>
              <Box mt={2}>
                <Typography variant="h6">Name: {user.name}</Typography>
                <Typography variant="h6">Email: {user.email}</Typography>
                <Typography variant="h6">User Type: {user.userType}</Typography>
              </Box>
            </Paper>
            <Paper elevation={3} className="p-5 mt-5">
              <Typography variant="h5" gutterBottom>
                {showWeeklyMenu ? 'Weekly Menu' : "Today's Menu"}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Breakfast</TableCell>
                      <TableCell>Lunch</TableCell>
                      <TableCell>Snacks</TableCell>
                      <TableCell>Dinner</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showWeeklyMenu ? (
                      menus.map((menu) => (
                        <TableRow key={menu.id}>
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
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowWeeklyMenu(!showWeeklyMenu)}
              >
                {showWeeklyMenu ? "Today's Menu" : 'Weekly Menu'}
              </Button>
              <Button variant="contained" color="secondary">Browse Plans</Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Profile;