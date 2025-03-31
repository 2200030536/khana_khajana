import React from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const ProfileNavbar = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      alert('Logout successful');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <AppBar position="sticky" className="bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg">
      <Toolbar className="flex justify-between">
        {/* Left Section */}
        <Box className="flex items-center space-x-4">
          <Typography variant="h6" className="text-white font-bold">
            Welcome, {user.name}
          </Typography>
          {user.userType === 'student' && (
            <Typography variant="body1" className="text-white">
              ID: {user.id}
            </Typography>
          )}
          <Typography variant="body1" className="text-white capitalize">
            ({user.userType})
          </Typography>
        </Box>

        {/* Right Section */}
        <div>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            className="text-white"
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile Details</MenuItem>
            <MenuItem onClick={handleClose}>Update Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default ProfileNavbar;