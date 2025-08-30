import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../axiosConfig";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Divider,
  Grid,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const MessUserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      // Use the user id from the context
      const response = await axiosInstance.put(`/messUsers/${user.id}`, formData);
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      // Refresh user data in context
      await refreshUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. " + (error.response?.data?.error || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Failed to logout. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#f57c00',
              mr: 3,
              fontSize: '2rem'
            }}
          >
            {user?.name?.charAt(0) || "M"}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {!loading && user ? user.name : "Mess User"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {!loading && user ? user.email : "Loading..."}
            </Typography>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}
        
        <Divider sx={{ mb: 4 }} />
        
        {!editMode ? (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="h6">
                  {user?.name}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="h6">
                  {user?.email}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  User Type
                </Typography>
                <Typography variant="h6">
                  {user?.userType === 'messUser' ? 'Mess User' : user?.userType || 'Unknown'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="h6">
                  {user?.id}
                </Typography>
              </Grid>
            </Grid>
            
            <Box mt={4} display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                sx={{ 
                  bgcolor: "#f57c00", 
                  '&:hover': { bgcolor: "#e65100" },
                  px: 3
                }}
              >
                Edit Profile
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  helperText="Leave blank to keep current password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            
            <Box mt={4} display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                sx={{ 
                  bgcolor: "#4caf50", 
                  '&:hover': { bgcolor: "#388e3c" },
                  px: 3
                }}
              >
                Save Changes
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default MessUserProfile;