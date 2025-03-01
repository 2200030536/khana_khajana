import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { Container, TextField, Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const MenuCrud = () => {
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

  const handleCreate = async (e) => {
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/menus/${formData.id}`, formData);
      alert('Menu updated: ' + JSON.stringify(response.data));
      fetchMenus();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the menu.');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.delete(`/menus/${formData.id}`);
      alert('Menu deleted: ' + JSON.stringify(response.data));
      fetchMenus();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the menu.');
    }
  };

  const getDayName = (day) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Specials"];
    return days[day - 1] || "Invalid day";
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Daily Menu CRUD Operations
      </Typography>
      <Box mb={2}>
        <Button variant="contained" color="primary" component={Link} to="/create-menu" style={{ marginRight: '10px' }}>
          Create Menu
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/view-menus" style={{ marginRight: '10px' }}>
          View Menus
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/update-menu" style={{ marginRight: '10px' }}>
          Update Menu
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/delete-menu">
          Delete Menu
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom style={{ marginTop: '30px' }}>
        View All Menus
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

export default MenuCrud;