import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  CardActions,
  Button, 
  Chip,
  CircularProgress,
  Alert, 
  Tabs,
  Tab,
  Divider,
  Container,
  Paper,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { 
  Restaurant as RestaurantIcon,
  CheckCircle as CheckCircleIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon, // Fixed: Using DinnerDining instead of Dinner
  DateRange as DateRangeIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axiosInstance from '../../axiosConfig';

const MealPlans = () => {
  // State for pricing data
  const [prices, setPrices] = useState({
    breakfast: 50,
    lunch: {
      vegetarian: 80,
      nonVegetarian: 120
    },
    dinner: {
      vegetarian: 80,
      nonVegetarian: 120
    },
    snacks: 30,
    plans: {
      daily: {
        vegetarian: 200,
        nonVegetarian: 280
      },
      weekly: {
        vegetarian: 1200,
        nonVegetarian: 1800
      },
      monthly: {
        vegetarian: 4500,
        nonVegetarian: 6000
      },
      semester: {
        vegetarian: 25000,
        nonVegetarian: 32000
      }
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // UI state
  const [activeTab, setActiveTab] = useState(0);
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  // Selected plan state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mealSelections, setMealSelections] = useState({
    breakfast: true,
    lunch: true,
    dinner: true
  });
  const [startDate, setStartDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Fetch price data
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        // Commented out actual API call for now to use mock data
        // const response = await axiosInstance.get('/api/prices/current');
        // setPrices(response.data);
        
        // Simulate API delay with mock data
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching prices:', err);
        setError('Failed to load meal plan prices. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPrices();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Toggle vegetarian preference
  const handleDietToggle = () => {
    setIsVegetarian(!isVegetarian);
  };

  // Handle meal selection changes
  const handleMealSelectionChange = (meal) => {
    setMealSelections({
      ...mealSelections,
      [meal]: !mealSelections[meal]
    });
  };

  // Calculate end date based on plan type
  const getEndDate = () => {
    if (!selectedPlan) return new Date();
    
    switch (selectedPlan.type) {
      case 'daily':
        return addDays(startDate, 1);
      case 'weekly':
        return addWeeks(startDate, 1);
      case 'monthly':
        return addMonths(startDate, 1);
      case 'semester':
        return addMonths(startDate, 6);
      default:
        return addDays(startDate, 1);
    }
  };
  
  // Get number of days in the plan
  const getNumberOfDays = () => {
    if (!selectedPlan) return 1;
    
    switch (selectedPlan.type) {
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'monthly': return 30;
      case 'semester': return 180;
      default: return 1;
    }
  };

  // Open checkout dialog
  const handleSelectPlan = (planType) => {
    setSelectedPlan({
      type: planType,
      price: isVegetarian ? 
        prices.plans[planType].vegetarian : 
        prices.plans[planType].nonVegetarian
    });
    setCheckoutOpen(true);
  };
  
  // Calculate adjusted price based on selections
  const calculateAdjustedPrice = (basePlanPrice) => {
    if (!selectedPlan) return basePlanPrice;
    
    let totalPrice = basePlanPrice;
    
    // Simple calculation - if a meal is deselected, reduce by percentage
    if (!mealSelections.breakfast) {
      totalPrice = totalPrice * 0.85; // Reduce by 15%
    }
    
    if (!mealSelections.lunch) {
      totalPrice = totalPrice * 0.75; // Reduce by 25%
    }
    
    if (!mealSelections.dinner) {
      totalPrice = totalPrice * 0.75; // Reduce by 25%
    }
    
    return Math.round(totalPrice);
  };

  // Submit plan purchase
  const handleSubmitPurchase = () => {
    // In a real app, you'd send an API request here
    alert('Thank you for your purchase! Your meal plan will be activated soon.');
    setCheckoutOpen(false);
  };

  // Render price card for one plan type
  const renderPlanCard = (planType, icon, title, description) => {
    if (!prices) return null;
    
    const price = isVegetarian ? 
      prices.plans[planType].vegetarian : 
      prices.plans[planType].nonVegetarian;
    
    return (
      <Card 
        elevation={3} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
          },
          borderRadius: 2,
          position: 'relative',
          overflow: 'visible'
        }}
      >
        {/* Highlight for semester plan */}
        {planType === 'semester' && (
          <Chip
            label="Best Value"
            color="error"
            sx={{ 
              position: 'absolute', 
              top: -12, 
              right: 16,
              fontWeight: 'bold',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
        )}
        
        <CardHeader
          avatar={icon}
          title={
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
          }
          sx={{ 
            bgcolor: planType === 'semester' ? '#fff8e1' : 'transparent',
            borderBottom: '1px solid #f0f0f0'
          }}
        />
        
        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
          <Box mb={2}>
            <Typography 
              variant="h4" 
              component="div" 
              fontWeight="bold" 
              color="#f57c00"
            >
              ₹{price.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {planType === 'daily' ? 'per day' : 
               planType === 'weekly' ? 'per week' : 
               planType === 'monthly' ? 'per month' : 
               'per semester'}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={2}>
            {description}
          </Typography>
          
          <Box mt={2}>
            {/* Plan features */}
            <Box display="flex" alignItems="center" mb={1}>
              <CheckCircleIcon fontSize="small" sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="body2">
                {planType === 'daily' ? '3 meals for a day' : 
                 planType === 'weekly' ? '21 meals for a week' : 
                 planType === 'monthly' ? '90 meals for a month' : 
                 '540+ meals for a semester'}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={1}>
              <CheckCircleIcon fontSize="small" sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="body2">
                {isVegetarian ? 'Vegetarian meals' : 'Non-vegetarian option'}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center">
              <CheckCircleIcon fontSize="small" sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="body2">
                {planType !== 'daily' ? 'Save up to ' + 
                  (planType === 'weekly' ? '10%' : 
                   planType === 'monthly' ? '15%' : '25%') : 
                  'Flexible meal choice'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button 
            variant="contained" 
            fullWidth
            color="primary"
            size="large"
            onClick={() => handleSelectPlan(planType)}
            sx={{ 
              bgcolor: '#f57c00',
              '&:hover': { bgcolor: '#e65100' },
              py: 1.5,
              fontWeight: 'medium',
              borderRadius: 2
            }}
            startIcon={<CartIcon />}
          >
            Subscribe Now
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box pt={4} pb={8}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          Meal Plan Subscriptions
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Choose the perfect meal plan that fits your schedule and budget
        </Typography>
        
        {/* Diet preference toggle */}
        <Box 
          mb={4} 
          mt={2} 
          display="flex" 
          justifyContent="flex-end"
        >
          <Paper 
            elevation={1}
            sx={{ 
              p: 1, 
              px: 2, 
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>Diet Preference:</Typography>
            <FormControlLabel
              control={
                <Switch 
                  checked={!isVegetarian}
                  onChange={handleDietToggle}
                  color="primary"
                />
              }
              label={
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" fontWeight={isVegetarian ? 'bold' : 'normal'} color={isVegetarian ? 'success.main' : 'text.secondary'}>
                    Vegetarian
                  </Typography>
                  <Typography variant="body2" mx={1}>|</Typography>
                  <Typography variant="body2" fontWeight={!isVegetarian ? 'bold' : 'normal'} color={!isVegetarian ? 'error.main' : 'text.secondary'}>
                    Non-Vegetarian
                  </Typography>
                </Box>
              }
            />
          </Paper>
        </Box>
        
        {/* Error message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        
        {/* Plan duration tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="All Plans" />
            <Tab label="Daily Plans" />
            <Tab label="Weekly Plans" />
            <Tab label="Monthly Plans" />
            <Tab label="Semester Plans" />
          </Tabs>
        </Box>
        
        {/* Loading state */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} sx={{ color: '#f57c00' }} />
          </Box>
        ) : (
          /* Plan cards section */
          <Grid container spacing={4}>
            {/* Daily Plan */}
            {(activeTab === 0 || activeTab === 1) && (
              <Grid item xs={12} sm={6} md={3}>
                {renderPlanCard(
                  'daily',
                  <RestaurantIcon sx={{ color: '#f57c00' }} />,
                  'Daily Plan',
                  'Perfect for trying out our meals or for occasional visits'
                )}
              </Grid>
            )}
            
            {/* Weekly Plan */}
            {(activeTab === 0 || activeTab === 2) && (
              <Grid item xs={12} sm={6} md={3}>
                {renderPlanCard(
                  'weekly',
                  <RestaurantIcon sx={{ color: '#f57c00' }} />,
                  'Weekly Plan',
                  'Our most popular plan for regular students with 10% savings'
                )}
              </Grid>
            )}
            
            {/* Monthly Plan */}
            {(activeTab === 0 || activeTab === 3) && (
              <Grid item xs={12} sm={6} md={3}>
                {renderPlanCard(
                  'monthly',
                  <RestaurantIcon sx={{ color: '#f57c00' }} />,
                  'Monthly Plan',
                  'Great value with 15% savings for the entire month'
                )}
              </Grid>
            )}
            
            {/* Semester Plan */}
            {(activeTab === 0 || activeTab === 4) && (
              <Grid item xs={12} sm={6} md={3}>
                {renderPlanCard(
                  'semester',
                  <RestaurantIcon sx={{ color: '#f57c00' }} />,
                  'Semester Plan',
                  'Maximize your savings with our semester package at 25% off'
                )}
              </Grid>
            )}
          </Grid>
        )}
        
        {/* Benefits section */}
        <Box mt={8}>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Why Choose Our Meal Plans?
          </Typography>
          
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <BreakfastIcon sx={{ fontSize: 48, color: '#f57c00', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">Nutritious Meals</Typography>
                <Typography variant="body2" color="text.secondary">
                  Balanced, fresh and nutritionally rich meals prepared daily
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <LunchIcon sx={{ fontSize: 48, color: '#f57c00', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">Cost Effective</Typography>
                <Typography variant="body2" color="text.secondary">
                  Save money with our bulk subscription plans
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <DinnerIcon sx={{ fontSize: 48, color: '#f57c00', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">Variety</Typography>
                <Typography variant="body2" color="text.secondary">
                  Diverse menu with different cuisines throughout the week
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <DateRangeIcon sx={{ fontSize: 48, color: '#f57c00', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold">Flexibility</Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose the meals you want and customize your plan
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Checkout Dialog */}
        <Dialog 
          open={checkoutOpen} 
          onClose={() => setCheckoutOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#f57c00' }}>
              Complete Your Subscription
            </Typography>
          </DialogTitle>
          
          <DialogContent dividers>
            {selectedPlan && (
              <>
                <Typography variant="h6" gutterBottom>
                  {selectedPlan.type.charAt(0).toUpperCase() + selectedPlan.type.slice(1)} Plan Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="medium" color="text.secondary">
                      Diet Type:
                    </Typography>
                    <Typography variant="body1">
                      {isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="medium" color="text.secondary">
                      Duration:
                    </Typography>
                    <Typography variant="body1">
                      {selectedPlan.type === 'daily' ? '1 Day' : 
                       selectedPlan.type === 'weekly' ? '7 Days' : 
                       selectedPlan.type === 'monthly' ? '30 Days' : 
                       '6 Months'}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Customize Your Plan
                </Typography>
                
                <FormGroup>
                  <Box mb={2}>
                    <Typography variant="body2" fontWeight="medium" color="text.secondary" mb={1}>
                      Select Meals:
                    </Typography>
                    
                    <Box display="flex" flexWrap="wrap" gap={2}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={mealSelections.breakfast}
                            onChange={() => handleMealSelectionChange('breakfast')}
                            color="primary"
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center">
                            <BreakfastIcon sx={{ mr: 0.5, fontSize: 20, color: '#f57c00' }} />
                            <Typography>Breakfast</Typography>
                          </Box>
                        }
                      />
                      
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={mealSelections.lunch}
                            onChange={() => handleMealSelectionChange('lunch')}
                            color="primary"
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center">
                            <LunchIcon sx={{ mr: 0.5, fontSize: 20, color: '#f57c00' }} />
                            <Typography>Lunch</Typography>
                          </Box>
                        }
                      />
                      
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={mealSelections.dinner}
                            onChange={() => handleMealSelectionChange('dinner')}
                            color="primary"
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center">
                            <DinnerIcon sx={{ mr: 0.5, fontSize: 20, color: '#f57c00' }} />
                            <Typography>Dinner</Typography>
                          </Box>
                        }
                      />
                    </Box>
                  </Box>
                </FormGroup>
                
                <Box mb={3}>
                  <Typography variant="body2" fontWeight="medium" color="text.secondary" mb={1}>
                    Starting Date:
                  </Typography>
                  
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={startDate}
                      onChange={(newDate) => setStartDate(newDate)}
                      minDate={new Date()}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                  
                  <Typography variant="caption" color="text.secondary">
                    Your plan will be active from {format(startDate, 'MMM dd, yyyy')} to {format(getEndDate(), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                
                <Box mb={3}>
                  <Typography variant="body2" fontWeight="medium" color="text.secondary" mb={1}>
                    Payment Method:
                  </Typography>
                  
                  <FormControl fullWidth>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <MenuItem value="cash">Cash Payment</MenuItem>
                      <MenuItem value="upi">UPI Payment</MenuItem>
                      <MenuItem value="card">Card Payment</MenuItem>
                      <MenuItem value="online">Online Bank Transfer</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box backgroundColor="#f8f8f8" p={2} borderRadius={1}>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Base Plan Price:</Typography>
                    <Typography variant="body2">₹{selectedPlan.price.toLocaleString()}</Typography>
                  </Box>
                  
                  {(!mealSelections.breakfast || !mealSelections.lunch || !mealSelections.dinner) && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Meal Selection Adjustment:</Typography>
                      <Typography variant="body2" color="error.main">
                        -₹{(selectedPlan.price - calculateAdjustedPrice(selectedPlan.price)).toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" fontWeight="bold">Total Amount:</Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      ₹{calculateAdjustedPrice(selectedPlan.price).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setCheckoutOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPurchase}
              variant="contained"
              color="primary"
              sx={{ 
                bgcolor: '#f57c00',
                '&:hover': { bgcolor: '#e65100' },
              }}
              startIcon={<CartIcon />}
            >
              Complete Purchase
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MealPlans;