import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const ViewMenus = () => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axiosInstance.get('/daily-menus');
        setMenus(response.data);
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the menus.');
      }
    };

    fetchMenus();
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        All Daily Menus
      </Typography>
      <List>
        {menus.map((menu) => (
          <ListItem key={menu.id}>
            <ListItemText
              primary={`Day: ${menu.day}`}
              secondary={`Breakfast: ${menu.breakfast}, Lunch: ${menu.lunch}, Snacks: ${menu.snacks}, Dinner: ${menu.dinner}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ViewMenus;