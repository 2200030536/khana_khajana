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
  Select,
  MenuItem
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  CheckCircle as CheckCircleIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  DateRange as DateRangeIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axiosInstance from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';

const MealPlans = () => {
  const navigate = useNavigate();

  // State for pricing data
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeMealPlan, setActiveMealPlan] = useState(null);

  // UI state
  const [activeTab, setActiveTab] = useState(0);
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  // Selected plan state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mealSelections, setMealSelections] = useState({
    breakfast: true,
    lunch: true,
    dinner: true
  });
  const [startDate, setStartDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Fetch user data and check authentication status
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await axiosInstance.get("/auth/profile");
        const userData = profileResponse.data.user;
        setUser(userData);
        setIsLoggedIn(true);

        // Fetch transaction status if user is a student
        if (userData.userType === "studentUser") {
          try {
            const transactionResponse = await axiosInstance.get(
              `/transactions/student/${userData.id}`
            );
            const studentTransaction = transactionResponse.data;

            if (studentTransaction) {
              const currentDate = new Date();
              const endDate = new Date(studentTransaction.endDate);
              
              // Only set as active meal plan if end date is in the future
              if (endDate >= currentDate) {
                setActiveMealPlan(studentTransaction);
              }
            }
          } catch (err) {
            console.error("Error fetching transaction:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch price data
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        // Update the endpoint to the correct one for your database
        const response = await axiosInstance.get('/api/prices/current');

        if (response && response.data) {
          console.log("Fetched price data:", response.data);
          setPrices(response.data);
        } else {
          throw new Error('No pricing data received');
        }
      } catch (err) {
        console.error('Error fetching prices:', err);
        setError('Failed to load meal plan prices. Please try again later.');
        // Set a fallback pricing structure in case the API call fails
        setPrices({
          breakfast: 55,
          lunch: {
            vegetarian: 70,
            nonVegetarian: 109.98
          },
          dinner: {
            vegetarian: 70,
            nonVegetarian: 100
          },
          snacks: 25,
          plans: {
            daily: {
              vegetarian: 180,
              nonVegetarian: 220
            },
            weekly: {
              vegetarian: 1200,
              nonVegetarian: 1500
            },
            monthly: {
              vegetarian: 4000,
              nonVegetarian: 4499.99
            },
            semester: {
              vegetarian: 23000,
              nonVegetarian: 25000
            }
          }
        });
        setTimeout(() => setError(''), 5000);
      } finally {
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
    if (!isLoggedIn) {
      // Prompt user to login
      setError('Please log in to subscribe to a meal plan.');
      setTimeout(() => {
        setError('');
        navigate('/login');
      }, 2000);
      return;
    }

    // Check if user already has an active plan
    if (activeMealPlan) {
      setError(`You already have an active ${activeMealPlan.planType} plan that expires on ${format(new Date(activeMealPlan.endDate), 'MMM dd, yyyy')}.`);
      setTimeout(() => setError(''), 8000);
      return;
    }

    // Check if prices are available
    if (!prices || !prices.plans) {
      setError('Unable to get pricing information. Please try again later.');
      setTimeout(() => setError(''), 5000);
      return;
    }

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
    if (!selectedPlan || !prices) return basePlanPrice;

    let totalPrice = basePlanPrice;
    const breakfastPrice = prices.breakfast || 0;
    const lunchPrice = isVegetarian ? 
      (prices.lunch ? prices.lunch.vegetarian : 0) : 
      (prices.lunch ? prices.lunch.nonVegetarian : 0);
    const dinnerPrice = isVegetarian ? 
      (prices.dinner ? prices.dinner.vegetarian : 0) : 
      (prices.dinner ? prices.dinner.nonVegetarian : 0);

    // Calculate total meal cost per day
    const totalMealPrice = breakfastPrice + lunchPrice + dinnerPrice;
    
    // If no totalMealPrice (should not happen), use simple percentage calculation
    if (totalMealPrice === 0) {
      if (!mealSelections.breakfast) {
        totalPrice = totalPrice - breakfastPrice; // Reduce by 25%
      }
      if (!mealSelections.lunch) {
        totalPrice = totalPrice - lunchPrice; // Reduce by 40%
      }
      if (!mealSelections.dinner) {
        totalPrice = totalPrice - dinnerPrice; // Reduce by 40%
      }
    } else {
      // Calculate the actual meal proportion based on real pricing
      const days = getNumberOfDays();
      let deduction = 0;
      
      if (!mealSelections.breakfast) {
        deduction += breakfastPrice * days;
      }
      
      if (!mealSelections.lunch) {
        deduction += lunchPrice * days;
      }
      
      if (!mealSelections.dinner) {
        deduction += dinnerPrice * days;
      }
      
      // Apply the deduction, but ensure we don't go below a minimum threshold
      // (assuming 20% discount is the max possible discount for meal selection)
      totalPrice = Math.max(totalPrice - deduction, totalPrice * 0.8);
    }

    return Math.round(totalPrice);
  };

  // Submit plan purchase - modified to show confirmation first
  const handleSubmitPurchase = async () => {
    try {
      setError('');
      
      if (!isLoggedIn || !user) {
        setError('You must be logged in to purchase a meal plan.');
        setTimeout(() => {
          setError('');
          setCheckoutOpen(false);
          navigate('/login');
        }, 2000);
        return;
      }

      // Check that at least one meal is selected
      if (!mealSelections.breakfast && !mealSelections.lunch && !mealSelections.dinner) {
        setError('Please select at least one meal type.');
        return;
      }
      
      // Show payment confirmation dialog instead of processing immediately
      setConfirmationOpen(true);
      
    } catch (err) {
      console.error('Error in purchase flow:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // New function to handle the actual transaction processing
  const processTransaction = async (paymentCompleted) => {
    try {
      setLoadingPlan(true);
      
      const transactionData = {
        studentId: parseInt(user.id),
        planType: selectedPlan.type,
        breakfast: mealSelections.breakfast,
        lunch: mealSelections.lunch,
        dinner: mealSelections.dinner,
        startDate: startDate.toISOString(),
        endDate: getEndDate().toISOString(),
        amount: calculateAdjustedPrice(selectedPlan.price),
        paymentStatus: paymentCompleted ? 'completed' : 'failed',
        paymentMethod: paymentMethod,
        status: paymentCompleted ? 'active' : 'canceled'
      };

      console.log('Sending transaction data:', transactionData);

      // Send the transaction to the server with credentials
      const response = await axiosInstance.post('/transactions', transactionData, {
        withCredentials: true
      });

      console.log('Transaction created:', response.data);

      // Update the active meal plan only if payment was successful
      if (paymentCompleted) {
        setActiveMealPlan(response.data);
        // Show success message
        alert('Thank you for your purchase! Your meal plan has been activated.');
      } else {
        // Show failure message
        alert('Your transaction has been marked as failed. You can try again when ready.');
      }
      
      // Close both dialogs
      setConfirmationOpen(false);
      setCheckoutOpen(false);
      
    } catch (err) {
      console.error('Error submitting transaction:', err);

      // Provide specific error message if available
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to process your transaction. Please try again.');
      }
    } finally {
      setLoadingPlan(false);
    }
  };

  // Render price card for one plan type
  const renderPlanCard = (planType, icon, title, description) => {
    if (!prices || !prices.plans) return (
      <Card elevation={3} sx={{ height: '100%', p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={40} sx={{ color: '#f57c00' }} />
      </Card>
    );

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
            disabled={!!activeMealPlan}
            sx={{
              bgcolor: activeMealPlan ? 'grey.400' : '#f57c00',
              '&:hover': { bgcolor: activeMealPlan ? 'grey.500' : '#e65100' },
              py: 1.5,
              fontWeight: 'medium',
              borderRadius: 2
            }}
            startIcon={activeMealPlan ? null : <CartIcon />}
          >
            {activeMealPlan ? 'Already Subscribed' : 'Subscribe Now'}
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

        {/* Login status indicator */}
        {!isLoggedIn && (
          <Alert
            severity="info"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate('/login')}
              >
                LOGIN
              </Button>
            }
          >
            Please log in to subscribe to a meal plan
          </Alert>
        )}

        {/* Active meal plan notification */}
        {isLoggedIn && activeMealPlan && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
          >
            You have an active {activeMealPlan.planType} plan until {format(new Date(activeMealPlan.endDate), 'MMM dd, yyyy')}
          </Alert>
        )}

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
        {loading && !prices ? (
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

        {/* Payment Confirmation Dialog */}
        <Dialog
          open={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Payment Confirmation
            </Typography>
          </DialogTitle>
          
          <DialogContent>
            <Typography variant="body1" mb={2}>
              Have you completed the payment of ₹{calculateAdjustedPrice(selectedPlan?.price || 0).toLocaleString()} through {paymentMethod}?
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Please confirm your payment status to proceed.
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ p: 2 }}>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => processTransaction(false)}
            >
              No, Payment Failed
            </Button>
            
            <Button 
              variant="contained" 
              color="success"
              onClick={() => processTransaction(true)}
            >
              Yes, Payment Completed
            </Button>
          </DialogActions>
        </Dialog>

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
              disabled={loadingPlan}
              sx={{
                bgcolor: '#f57c00',
                '&:hover': { bgcolor: '#e65100' },
              }}
              startIcon={loadingPlan ? <CircularProgress size={20} color="inherit" /> : <CartIcon />}
            >
              {loadingPlan ? 'Processing...' : 'Complete Purchase'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MealPlans;