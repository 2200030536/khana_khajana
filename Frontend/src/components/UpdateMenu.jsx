import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const UpdateMenu = () => {
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
      const response = await axiosInstance.put(`/menus/${formData.id}`, formData);
      alert('Menu updated: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the menu.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Update Daily Menu
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
        />
        <TextField
          label="Lunch"
          variant="outlined"
          fullWidth
          margin="normal"
          name="lunch"
          value={formData.lunch}
          onChange={handleChange}
        />
        <TextField
          label="Snacks"
          variant="outlined"
          fullWidth
          margin="normal"
          name="snacks"
          value={formData.snacks}
          onChange={handleChange}
        />
        <TextField
          label="Dinner"
          variant="outlined"
          fullWidth
          margin="normal"
          name="dinner"
          value={formData.dinner}
          onChange={handleChange}
        />
        <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel id="day-label">Day</InputLabel>
          <Select
            labelId="day-label"
            label="Day"
            name="day"
            value={formData.day}
            onChange={handleChange}
          >
            <MenuItem value={1}>Sunday</MenuItem>
            <MenuItem value={2}>Monday</MenuItem>
            <MenuItem value={3}>Tuesday</MenuItem>
            <MenuItem value={4}>Wednesday</MenuItem>
            <MenuItem value={5}>Thursday</MenuItem>
            <MenuItem value={6}>Friday</MenuItem>
            <MenuItem value={7}>Saturday</MenuItem>
            <MenuItem value={8}>Specials</MenuItem>
          </Select>
        </FormControl>
        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Update Menu
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default UpdateMenu;