import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Divider } from '@mui/material';
import { People, MenuBook, MonetizationOn, RestaurantMenu } from '@mui/icons-material';
import axiosInstance from '../../axiosConfig';

const MessDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    menus: 0,
    transactions: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchDashboardData = async () => {
      try {
        // In a real app, you'd fetch actual stats from backend
        // This is just a placeholder
        setStats({
          students: 120,
          menus: 7,
          transactions: 432,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon, title, value, color }) => (
    <Card 
      elevation={3}
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box 
            sx={{ 
              backgroundColor: `${color}20`, 
              borderRadius: '50%',
              p: 1.5,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h3" align="center">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<People sx={{ color: '#3f51b5', fontSize: 32 }} />}
            title="Total Students"
            value={stats.students}
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<MenuBook sx={{ color: '#f57c00', fontSize: 32 }} />}
            title="Menu Items"
            value={stats.menus}
            color="#f57c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<MonetizationOn sx={{ color: '#4caf50', fontSize: 32 }} />}
            title="Transactions"
            value={stats.transactions}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<RestaurantMenu sx={{ color: '#e91e63', fontSize: 32 }} />}
            title="Today's Meals"
            value={3}
            color="#e91e63"
          />
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" mb={2}>
          Today's Menu
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Breakfast</Typography>
              <Typography>Idli, Sambhar, Chutney</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Lunch</Typography>
              <Typography>Rice, Dal, Paneer Curry, Salad</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Snacks</Typography>
              <Typography>Tea, Biscuits, Samosa</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Dinner</Typography>
              <Typography>Roti, Rice, Mixed Veg, Curd</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Recent Activity
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box>
          <Typography>• Menu for Wednesday updated (1 hour ago)</Typography>
          <Typography>• 3 new student meal plans activated (3 hours ago)</Typography>
          <Typography>• Meal price updated (Yesterday)</Typography>
          <Typography>• 5 transactions processed (Yesterday)</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default MessDashboard;