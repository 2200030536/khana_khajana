import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { Container, TextField, Button, Typography, Box, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText } from '@mui/material';

const ViewMenus = () => {
  const [formData, setFormData] = useState({
    id: '',
    breakfast: '',
    lunch: '',
    snacks: '',
    dinner: '',
    day: ''
  });
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axiosInstance.get('/menus');
      setMenus(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching the menus.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/menus', formData);
      alert('Menu created: ' + JSON.stringify(response.data));
      fetchMenus();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the menu.');
    }
  };

  const getDayName = (day) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Specials"];
    return days[day - 1] || "Invalid day";
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        View Daily Menus
      </Typography>
      <List>
        {menus.map((menu) => (
          <ListItem key={menu.id}>
            <ListItemText
              primary={`Day: ${getDayName(menu.day)}`}
              secondary={`Breakfast: ${menu.breakfast}, Lunch: ${menu.lunch}, Snacks: ${menu.snacks}, Dinner: ${menu.dinner}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ViewMenus;