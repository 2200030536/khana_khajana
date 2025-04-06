import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip
} from '@mui/material';
import {
  RestaurantMenu,
  Receipt,
  CalendarMonth,
  NotificationsActive,
  AccountBalanceWallet,
  AccessTime
} from '@mui/icons-material';
import axiosInstance from '../../axiosConfig';
import { keyframes } from '@emotion/react';

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState(null);
  const [todayMenu, setTodayMenu] = useState({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: []
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Get user profile to get the user ID
      const profileResponse = await axiosInstance.get("/auth/profile");
      const userData = profileResponse.data.user;

      if (!userData || !userData.id) {
        throw new Error("User profile information is incomplete");
      }
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayNumber = new Date().getDay() + 1;

      // Fetch all required data in parallel
      const [mealPlanResponse, menuResponse, transactionsResponse] = await Promise.all([
        axiosInstance.get(`/transactions/student/${userData.id}`),
        axiosInstance.get(`/menus/day/${dayNumber}`),
        axiosInstance.get(`/transactions/student/${userData.id}`)
      ]);

      // Process meal plan data
      setMealPlan(mealPlanResponse.data);
      // console.log(mealPlanResponse.data);

      // Process today's menu
      const menuData = menuResponse.data;
      // console.log(menuData);
      if (menuData) {
        setTodayMenu({
          breakfast: menuData.breakfast ? menuData.breakfast.split(',').map(item => item.trim()) : [],
          lunch: menuData.lunch ? menuData.lunch.split(',').map(item => item.trim()) : [],
          snacks: menuData.snacks ? menuData.snacks.split(',').map(item => item.trim()) : [],
          dinner: menuData.dinner ? menuData.dinner.split(',').map(item => item.trim()) : []
        });
      }
      // Process transactions - make sure it's an array before calling slice
      const transactions = Array.isArray(transactionsResponse.data)
        ? transactionsResponse.data
        : transactionsResponse.data?.transactions || [];

      setRecentTransactions(transactions.slice(0, 5));

      // Create some upcoming events based on meal times
      const currentDate = new Date();
      const upcomingMeals = [
        {
          title: 'Breakfast',
          time: new Date(new Date().setHours(8, 0, 0, 0)),
          icon: <RestaurantMenu />,
          color: '#42a5f5'
        },
        {
          title: 'Lunch',
          time: new Date(new Date().setHours(13, 0, 0, 0)),
          icon: <RestaurantMenu />,
          color: '#ff9800'
        },
        {
          title: 'Snacks',
          time: new Date(new Date().setHours(16, 30, 0, 0)),
          icon: <RestaurantMenu />,
          color: '#66bb6a'
        },
        {
          title: 'Dinner',
          time: new Date(new Date().setHours(20, 0, 0, 0)),
          icon: <RestaurantMenu />,
          color: '#f44336'
        }
      ];


      // Filter to only show upcoming meals
      const now = new Date();
      const upcomingMealsFiltered = upcomingMeals.filter(meal => meal.time > now);
      setUpcomingEvents(upcomingMealsFiltered);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };


  const formatMenuItems = (items) => {
    if (!items || !items.length) return "Not available";
    return items.join(", ");
  };
  const getDaysRemaining = () => {
    if (!mealPlan || !mealPlan.endDate) return 0;

    const endDate = new Date(mealPlan.endDate);
    const today = new Date();

    // Set time to midnight for both dates to get accurate day count
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMealTimingStatus = (mealType) => {
    const now = new Date();
    const hours = now.getHours();

    if (mealType === 'breakfast' && hours >= 7 && hours < 10) {
      return { status: 'active', text: 'Available Now' };
    } else if (mealType === 'lunch' && hours >= 12 && hours < 15) {
      return { status: 'active', text: 'Available Now' };
    } else if (mealType === 'snacks' && hours >= 16 && hours < 18) {
      return { status: 'active', text: 'Available Now' };
    } else if (mealType === 'dinner' && hours >= 19 && hours < 22) {
      return { status: 'active', text: 'Available Now' };
    }

    return { status: 'inactive', text: 'Check Schedule' };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" mb={4} fontWeight="bold"
        sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
        Student Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Quick Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4, animation: `${fadeIn} 0.6s ease-out` }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{
            height: '100%',
            background: 'linear-gradient(135deg, #42a5f5, #1976d2)',
            color: 'white',
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccountBalanceWallet sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Meal Plan Status</Typography>
              </Box>
              {mealPlan ? (
                <>
                  <Typography variant="h3" align="center" sx={{ mb: 1 }}>
                    {getDaysRemaining()}
                  </Typography>
                  <Typography variant="subtitle1" align="center">
                    Days Remaining
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="body2">
                      Start: {formatDate(mealPlan.startDate)}
                    </Typography>
                    <Typography variant="body2">
                      End: {formatDate(mealPlan.endDate)}
                    </Typography>
                    {mealPlan.planType && (
                      <Chip
                        label={mealPlan.planType}
                        size="small"
                        sx={{ mt: 1, bgcolor: 'rgba(255, 255, 255, 0.25)' }}
                      />
                    )}
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                    No Active Meal Plan
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                    }}
                  >
                    Browse Plans
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{
            height: '100%',
            background: 'linear-gradient(135deg, #ff9800, #f57c00)',
            color: 'white',
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarMonth sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Today's Schedule</Typography>
              </Box>

              <List dense>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <ListItem key={index} sx={{
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      mb: 1,
                      animation: `${slideIn} ${0.3 + index * 0.1}s ease-out`
                    }}>
                      <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                        <AccessTime />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1" align="center" sx={{ py: 3 }}>
                    No more meals scheduled for today
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{
            height: '100%',
            background: 'linear-gradient(135deg, #66bb6a, #43a047)',
            color: 'white',
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Receipt sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Recent Transactions</Typography>
              </Box>

              {recentTransactions.length > 0 ? (
                <List dense>
                  {recentTransactions.map((transaction, index) => (
                    <ListItem key={index} sx={{
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      mb: 1,
                      animation: `${slideIn} ${0.3 + index * 0.1}s ease-out`
                    }}>
                      <ListItemText
                        primary={`₹${transaction.amount}`}
                        secondary={
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {formatDate(transaction.date)}
                          </Typography>
                        }
                      />
                      <Chip
                        label={transaction.status || 'Completed'}
                        size="small"
                        sx={{
                          bgcolor: transaction.status === 'pending' ? 'warning.light' : 'success.light',
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" align="center" sx={{ py: 3 }}>
                  No recent transactions
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Today's Menu */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          animation: `${fadeIn} 0.7s ease-out`,
          background: 'white',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Typography variant="h5" mb={2} fontWeight="bold" display="flex" alignItems="center">
          <RestaurantMenu sx={{ mr: 1 }} />
          Today's Menu
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Breakfast */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{
              p: 2,
              borderLeft: '4px solid #42a5f5',
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight="bold">Breakfast</Typography>
                {getMealTimingStatus('breakfast').status === 'active' ? (
                  <Chip
                    label={getMealTimingStatus('breakfast').text}
                    size="small"
                    sx={{ bgcolor: '#42a5f5', color: 'white' }}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    7:00 AM - 10:00 AM
                  </Typography>
                )}
              </Box>
              <Typography variant="body2">
                {formatMenuItems(todayMenu.breakfast)}
              </Typography>
            </Card>
          </Grid>

          {/* Lunch */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{
              p: 2,
              borderLeft: '4px solid #ff9800',
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight="bold">Lunch</Typography>
                {getMealTimingStatus('lunch').status === 'active' ? (
                  <Chip
                    label={getMealTimingStatus('lunch').text}
                    size="small"
                    sx={{ bgcolor: '#ff9800', color: 'white' }}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    12:00 PM - 3:00 PM
                  </Typography>
                )}
              </Box>
              <Typography variant="body2">
                {formatMenuItems(todayMenu.lunch)}
              </Typography>
            </Card>
          </Grid>

          {/* Snacks */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{
              p: 2,
              borderLeft: '4px solid #66bb6a',
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight="bold">Snacks</Typography>
                {getMealTimingStatus('snacks').status === 'active' ? (
                  <Chip
                    label={getMealTimingStatus('snacks').text}
                    size="small"
                    sx={{ bgcolor: '#66bb6a', color: 'white' }}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    4:00 PM - 6:00 PM
                  </Typography>
                )}
              </Box>
              <Typography variant="body2">
                {formatMenuItems(todayMenu.snacks)}
              </Typography>
            </Card>
          </Grid>

          {/* Dinner */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{
              p: 2,
              borderLeft: '4px solid #f44336',
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight="bold">Dinner</Typography>
                {getMealTimingStatus('dinner').status === 'active' ? (
                  <Chip
                    label={getMealTimingStatus('dinner').text}
                    size="small"
                    sx={{ bgcolor: '#f44336', color: 'white' }}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    7:00 PM - 10:00 PM
                  </Typography>
                )}
              </Box>
              <Typography variant="body2">
                {formatMenuItems(todayMenu.dinner)}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Actions */}
      {/* <Paper 
        elevation={3} 
        sx={{ 
          p: 3,
          animation: `${fadeIn} 0.8s ease-out`,
          background: 'white',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Typography variant="h5" mb={2} fontWeight="bold">
          Quick Actions
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<RestaurantMenu />}
              onClick={() => navigate('/menu')}
              sx={{ 
                py: 1.5, 
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' }
              }}
            >
              View Weekly Menu
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth
              startIcon={<Receipt />}
              sx={{ 
                py: 1.5, 
                bgcolor: '#9c27b0',
                '&:hover': { bgcolor: '#7b1fa2' }
              }}
            >
              Meal Plan History
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              variant="contained" 
              fullWidth
              startIcon={<CalendarMonth />}
              onClick={() => navigate('/meals-plans')}
              sx={{ 
                py: 1.5, 
                bgcolor: '#ff9800',
                '&:hover': { bgcolor: '#f57c00' }
              }}
            >
              Browse Plans
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              variant="contained" 
              fullWidth
              startIcon={<NotificationsActive />}
              onClick={() => navigate('/contact')}
              sx={{ 
                py: 1.5, 
                bgcolor: '#f44336',
                '&:hover': { bgcolor: '#e53935' }
              }}
            >
              Feedback
            </Button>
          </Grid>
        </Grid>
      </Paper> */}
    </Box>
  );
};

export default StudentDashboard;