import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, Divider, CircularProgress, Alert } from '@mui/material';
import { People, MenuBook, MonetizationOn, RestaurantMenu } from '@mui/icons-material';
import axiosInstance from '../../axiosConfig';

const MessDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    menus: 0,
    transactions: 0,
    todayMeals: 0
  });
  
  const [todayMenu, setTodayMenu] = useState({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch all required data in parallel
      const [studentsResponse, menusResponse, transactionsResponse, todayMenuResponse] = await Promise.all([
        axiosInstance.get('/students'),
        axiosInstance.get('/menus'),
        axiosInstance.get('/transactions'),
        axiosInstance.get('/menus/')
      ]);
      
      // Extract the count of items
      const studentCount = studentsResponse.data.length;
      const menuCount = menusResponse.data.length;
      const transactionCount = transactionsResponse.data.length;
      
      // Count today's meals
      const todayMenuData = todayMenuResponse.data;
      const mealCount = Object.values(todayMenuData).filter(
        meal => Array.isArray(meal) && meal.length > 0
      ).length;
      
      // Update stats
      setStats({
        students: studentCount,
        menus: menuCount,
        transactions: transactionCount,
        todayMeals: mealCount
      });
      
      // Update today's menu
      setTodayMenu({
        breakfast: todayMenuData.breakfast || [],
        lunch: todayMenuData.lunch || [],
        snacks: todayMenuData.snacks || [],
        dinner: todayMenuData.dinner || []
      });
      
      // Fetch recent activities
      // You might need a dedicated endpoint for this, but for now we'll use recent transactions
      const recentTransactions = transactionsResponse.data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(transaction => ({
          text: `Transaction #${transaction.id} - ₹${transaction.amount} (${new Date(transaction.date).toLocaleDateString()})`,
          time: new Date(transaction.date)
        }));
        
      // Also add menu updates if available
      const recentMenuUpdates = menusResponse.data
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3)
        .map(menu => ({
          text: `Menu for ${new Date(menu.date).toLocaleDateString()} updated`,
          time: new Date(menu.updatedAt)
        }));
      
      // Combine and sort all activities
      const allActivities = [...recentTransactions, ...recentMenuUpdates]
        .sort((a, b) => b.time - a.time)
        .slice(0, 5);
        
      setRecentActivities(allActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  // Format menu items as a readable string
  const formatMenuItems = (items) => {
    if (!items || !items.length) return "Not available";
    return items.join(", ");
  };

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Dashboard Overview
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

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
            value={stats.todayMeals}
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
              <Typography>{formatMenuItems(todayMenu.breakfast)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Lunch</Typography>
              <Typography>{formatMenuItems(todayMenu.lunch)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Snacks</Typography>
              <Typography>{formatMenuItems(todayMenu.snacks)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Dinner</Typography>
              <Typography>{formatMenuItems(todayMenu.dinner)}</Typography>
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
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <Typography key={index} sx={{ mb: 1 }}>
                • {activity.text} ({formatTimeAgo(activity.time)})
              </Typography>
            ))
          ) : (
            <Typography>No recent activities found.</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMin = Math.floor(diffInMs / (1000 * 60));
  const diffInHrs = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMin < 60) {
    return `${diffInMin} ${diffInMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHrs < 24) {
    return `${diffInHrs} ${diffInHrs === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export default MessDashboard;