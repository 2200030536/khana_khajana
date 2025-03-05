import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
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
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel id="userType-label">User Type</InputLabel>
          <Select
            labelId="userType-label"
            label="User Type"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <MenuItem value="messUser">Mess User</MenuItem>
            <MenuItem value="studentUser">Student User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Login
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Login;