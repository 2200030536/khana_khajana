import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const DeleteMenu = () => {
  const [id, setId] = useState('');

  const handleChange = (e) => {
    setId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.delete(`/menus/${id}`);
      alert('Menu deleted: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the menu.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Delete Daily Menu
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={id}
          onChange={handleChange}
          required
        />
        <Box mt={2}>
          <Button variant="contained" color="secondary" type="submit" fullWidth>
            Delete Menu
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default DeleteMenu;