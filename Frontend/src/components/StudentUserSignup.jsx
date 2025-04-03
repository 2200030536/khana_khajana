import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  InputAdornment,
  Avatar, 
  CircularProgress,
  Alert,
  IconButton,
  FormHelperText
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  VpnKey as VpnKeyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

const StudentUserSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    department: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    // ID validation
    if (formData.id.trim() === '') {
      newErrors.id = 'ID is required';
    }
    
    // Department validation
    if (formData.department.trim() === '') {
      newErrors.department = 'Department is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for submission (excluding confirmPassword)
      const submissionData = {
        name: formData.name,
        id: formData.id,
        department: formData.department,
        password: formData.password,
        email: formData.email,
        userType: 'studentUser' // Important to set the user type
      };
      
      const response = await axiosInstance.post('/students/signup', submissionData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        id: '',
        department: '',
        password: '',
        confirmPassword: '',
        email: ''
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      setApiError(
        error.response?.data?.message || 
        'An error occurred while signing up. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        py: 5, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%' }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              borderTop: '4px solid #F57C00',
              background: 'linear-gradient(to bottom, #FFF8E1, #FFFFFF)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <IconButton 
                component={Link} 
                to="/signup"
                sx={{ mr: 2, color: '#F57C00' }}
              >
                <ArrowBackIcon />
              </IconButton>
              
              <Avatar 
                sx={{ 
                  bgcolor: '#F57C00', 
                  width: 50, 
                  height: 50,
                  boxShadow: '0 4px 8px rgba(245, 124, 0, 0.2)'
                }}
              >
                <SchoolIcon />
              </Avatar>
              
              <Typography 
                variant="h5" 
                component="h1" 
                sx={{ ml: 2, fontWeight: 700, color: '#E65100' }}
              >
                Student Registration
              </Typography>
            </Box>
            
            {apiError && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                onClose={() => setApiError('')}
              >
                {apiError}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ mb: 3 }}
              >
                Registration successful! Redirecting to login...
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#F57C00' }} />
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      label="Student ID"
                      variant="outlined"
                      fullWidth
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      error={!!errors.id}
                      helperText={errors.id}
                      required
                    />
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      label="Department"
                      variant="outlined"
                      fullWidth
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      error={!!errors.department}
                      helperText={errors.department}
                      required
                    />
                  </motion.div>
                </Grid>
                
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      label="Email Address"
                      variant="outlined"
                      fullWidth
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#F57C00' }} />
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      label="Password"
                      variant="outlined"
                      fullWidth
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKeyIcon sx={{ color: '#F57C00' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                    {!errors.password && (
                      <FormHelperText>
                        Password must be at least 6 characters long
                      </FormHelperText>
                    )}
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      label="Confirm Password"
                      variant="outlined"
                      fullWidth
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                  </motion.div>
                </Grid>
                
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={loading}
                      size="large"
                      sx={{
                        mt: 2,
                        py: 1.5,
                        bgcolor: '#F57C00',
                        '&:hover': { 
                          bgcolor: '#E65100',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 12px rgba(245, 124, 0, 0.3)'
                        },
                        transition: 'all 0.3s ease',
                        borderRadius: 2,
                        boxShadow: '0 4px 8px rgba(245, 124, 0, 0.2)'
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
            </form>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ 
                  color: '#F57C00', 
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Log in
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default StudentUserSignup;