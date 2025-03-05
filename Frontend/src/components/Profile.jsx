import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Container, Typography, Box, Paper } from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/auth/profile');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the profile.');
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Box mt={2}>
          <Typography variant="h6">Name: {user.name}</Typography>
          <Typography variant="h6">Email: {user.email}</Typography>
          <Typography variant="h6">User Type: {user.userType}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;