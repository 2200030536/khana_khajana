import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const CreateMenu = () => {
  const [formData, setFormData] = useState({
    id: '',
    breakfast: '',
    lunch: '',
    snacks: '',
    dinner: '',
    day: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/daily-menus', formData);
      alert('Menu created: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the menu.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Create Daily Menu
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="ID"
          variant="outlined"
          fullWidth
          margin="normal"
          name="id"
          value={formData.id}
          onChange={handleChange}
          required
        />
        <TextField
          label="Breakfast"
          variant="outlined"
          fullWidth
          margin="normal"
          name="breakfast"
          value={formData.breakfast}
          onChange={handleChange}
          required
        />
        <TextField
          label="Lunch"
          variant="outlined"
          fullWidth
          margin="normal"
          name="lunch"
          value={formData.lunch}
          onChange={handleChange}
          required
        />
        <TextField
          label="Snacks"
          variant="outlined"
          fullWidth
          margin="normal"
          name="snacks"
          value={formData.snacks}
          onChange={handleChange}
          required
        />
        <TextField
          label="Dinner"
          variant="outlined"
          fullWidth
          margin="normal"
          name="dinner"
          value={formData.dinner}
          onChange={handleChange}
          required
        />
        <TextField
          label="Day"
          variant="outlined"
          fullWidth
          margin="normal"
          name="day"
          value={formData.day}
          onChange={handleChange}
          required
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Create Menu
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateMenu;