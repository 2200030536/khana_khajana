import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
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
  Card,
  CardContent,
  Grid,
} from '@mui/material';

const MenuManager = () => {
  const [formData, setFormData] = useState({
    breakfast: '',
    lunch: '',
    snacks: '',
    dinner: '',
    day: '',
  });
  const [menus, setMenus] = useState([]);
  const [activeTab, setActiveTab] = useState('view'); // Tabs: 'view', 'create', 'update', 'delete'

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axiosInstance.get('/menus');
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
      alert('An error occurred while fetching the menus.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // If updating and the day is selected, fetch the menu data for that day
    if (activeTab === 'update' && e.target.name === 'day') {
      const selectedDay = e.target.value;
      const menuForDay = menus.find((menu) => menu.day === parseInt(selectedDay));
      if (menuForDay) {
        setFormData({
          breakfast: menuForDay.breakfast,
          lunch: menuForDay.lunch,
          snacks: menuForDay.snacks,
          dinner: menuForDay.dinner,
          day: selectedDay,
        });
      } else {
        // Clear the form if no menu is found for the selected day
        setFormData({
          breakfast: '',
          lunch: '',
          snacks: '',
          dinner: '',
          day: selectedDay,
        });
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
  
    // Debugging: Log the formData before sending the request
    console.log('Creating menu with data:', formData);
  
    // Validate formData
    if (!formData.day || !formData.breakfast || !formData.lunch || !formData.snacks || !formData.dinner) {
      alert('Please fill in all fields before creating the menu.');
      return;
    }
  
    try {
      const response = await axiosInstance.post('/menus', formData);
      console.log('Menu created successfully:', response.data); // Debugging: Log the response
      alert('Menu created successfully!');
      fetchMenus(); // Refresh the menus list
      setFormData({ breakfast: '', lunch: '', snacks: '', dinner: '', day: '' }); // Clear the form
    } catch (error) {
      console.error('Error creating menu:', error.response?.data || error.message); // Debugging: Log the error
      alert('An error occurred while creating the menu. Please try again.');
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/menus/day/${formData.day}`, formData); // Update by day
      alert('Menu updated successfully!');
      fetchMenus();
      setFormData({ breakfast: '', lunch: '', snacks: '', dinner: '', day: '' });
    } catch (error) {
      console.error('Error updating menu:', error);
      alert('An error occurred while updating the menu.');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.delete(`/menus/day/${formData.day}`); // Delete by day
      alert('Menu deleted successfully!');
      fetchMenus();
      setFormData({ breakfast: '', lunch: '', snacks: '', dinner: '', day: '' });
    } catch (error) {
      console.error('Error deleting menu:', error);
      alert('An error occurred while deleting the menu.');
    }
  };

  const getDayName = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Specials'];
    return days[day - 1] || 'Invalid day';
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#3f51b5' }}>
        Menu Management
      </Typography>

      {/* Tabs for CRUD Operations */}
      <Box mb={3} display="flex" justifyContent="center" gap={2}>
        <Button
          variant={activeTab === 'view' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('view')}
          color="primary"
        >
          View Menus
        </Button>
        <Button
          variant={activeTab === 'create' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('create')}
          color="success"
        >
          Create Menu
        </Button>
        <Button
          variant={activeTab === 'update' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('update')}
          color="warning"
        >
          Update Menu
        </Button>
        <Button
          variant={activeTab === 'delete' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('delete')}
          color="error"
        >
          Delete Menu
        </Button>
      </Box>

      {/* Dynamic Content Based on Active Tab */}
      {activeTab === 'view' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            All Menus
          </Typography>
          <Grid container spacing={3}>
            {menus.map((menu) => (
              <Grid item xs={12} sm={6} md={4} key={menu.day}>
                <Card
                  style={{
                    backgroundColor: '#f5f5f5',
                    transition: 'transform 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <CardContent>
                    <Typography variant="h6" style={{ fontWeight: 'bold', color: '#3f51b5' }}>
                      {getDayName(menu.day)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Breakfast:</strong> {menu.breakfast}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Lunch:</strong> {menu.lunch}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Snacks:</strong> {menu.snacks}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Dinner:</strong> {menu.dinner}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {(activeTab === 'create' || activeTab === 'update') && (
        <form onSubmit={activeTab === 'create' ? handleCreate : handleUpdate}>
          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel id="day-label">Day</InputLabel>
            <Select labelId="day-label" label="Day" name="day" value={formData.day} onChange={handleChange}>
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
          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              {activeTab === 'create' ? 'Create Menu' : 'Update Menu'}
            </Button>
          </Box>
        </form>
      )}

      {activeTab === 'delete' && (
        <form onSubmit={handleDelete}>
          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel id="day-label">Day</InputLabel>
            <Select labelId="day-label" label="Day" name="day" value={formData.day} onChange={handleChange}>
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
            <Button variant="contained" color="secondary" type="submit" fullWidth>
              Delete Menu
            </Button>
          </Box>
        </form>
      )}
    </Container>
  );
};

export default MenuManager;