import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      alert('Login successful: ' + JSON.stringify(response.data));
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in.');
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: isMobile ? '20px' : 0
      }}
    >
      <Paper 
        elevation={10} 
        sx={{ 
          padding: '40px',
          width: '100%',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Avatar 
            sx={{ 
              m: 1, 
              bgcolor: 'primary.main',
              width: 64,
              height: 64
            }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography 
            variant="h4" 
            fontWeight="600" 
            sx={{ 
              color: 'primary.main',
              mt: 2,
              fontFamily: '"Poppins", sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Login
          </Typography>
          <Divider 
            sx={{ 
              width: '50px', 
              height: '4px', 
              backgroundColor: 'primary.main',
              mt: 1,
              mb: 3,
              borderRadius: '2px'
            }} 
          />
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& label.Mui-focused': {
                color: 'primary.main',
              },
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& label.Mui-focused': {
                color: 'primary.main',
              },
            }}
          />
          <FormControl 
            variant="outlined" 
            fullWidth 
            margin="normal" 
            required
            sx={{
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& label.Mui-focused': {
                color: 'primary.main',
              },
            }}
          >
            <InputLabel id="userType-label">User Type</InputLabel>
            <Select
              labelId="userType-label"
              label="User Type"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              startAdornment={
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              }
            >
              <MenuItem value="messUser">Mess User</MenuItem>
              <MenuItem value="studentUser">Student User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth
            size="large"
            sx={{
              borderRadius: '10px',
              padding: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 20px rgba(25, 118, 210, 0.4)',
              },
            }}
          >
            Log In
          </Button>
          
          <Box 
            mt={3} 
            display="flex" 
            justifyContent="center"
          >
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{' '}
              <Typography 
                component="span" 
                color="primary" 
                sx={{ 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Typography>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;