import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  SaveAlt as SaveIcon,
  RefreshOutlined as RefreshIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import axiosInstance from '../../axiosConfig';

const PriceSettings = () => {
  // Main form state
  const [formData, setFormData] = useState({
    breakfast: 0,
    lunch: {
      vegetarian: 0,
      nonVegetarian: 0
    },
    snacks: 0,
    dinner: {
      vegetarian: 0,
      nonVegetarian: 0
    },
    plans: {
      daily: {
        vegetarian: 0,
        nonVegetarian: 0
      },
      weekly: {
        vegetarian: 0,
        nonVegetarian: 0
      },
      monthly: {
        vegetarian: 0,
        nonVegetarian: 0
      },
      semester: {
        vegetarian: 0,
        nonVegetarian: 0
      }
    },
    effectiveFrom: new Date(),
    notes: '',
    isActive: true
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [priceId, setPriceId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch current price configuration
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axiosInstance.get('/api/prices/current');
        const priceData = response.data;
        
        setFormData({
          breakfast: priceData.breakfast,
          lunch: priceData.lunch,
          snacks: priceData.snacks,
          dinner: priceData.dinner,
          plans: priceData.plans,
          effectiveFrom: new Date(priceData.effectiveFrom),
          notes: priceData.notes || '',
          isActive: priceData.isActive
        });
        
        setPriceId(priceData._id);
        
      } catch (error) {
        console.error('Error fetching current price:', error);
        
        if (error.response?.status === 404) {
          // No price configuration found, keep default values
          setError('No price configuration found. Create your first one!');
        } else {
          setError('Failed to load price configuration. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPrice();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle form field changes
  const handleChange = (e, section, subsection, field) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    if (section && subsection && field) {
      // Deep nested property (e.g., plans.daily.vegetarian)
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [field]: value
          }
        }
      }));
    } else if (section && subsection) {
      // Two level nesting (e.g., lunch.vegetarian)
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: value
        }
      }));
    } else if (section) {
      // One level (e.g., breakfast)
      setFormData(prev => ({
        ...prev,
        [section]: value
      }));
    } else {
      // Direct field (e.g., notes, isActive)
      setFormData(prev => ({
        ...prev,
        [e.target.name]: value
      }));
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      effectiveFrom: date
    }));
  };

  // Load price history
  const loadPriceHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/prices');
      setPriceHistory(response.data);
      setShowHistory(true);
    } catch (error) {
      console.error('Error loading price history:', error);
      setError('Failed to load price history');
    } finally {
      setLoading(false);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    
    try {
      const submitData = {
        ...formData,
        lastModifiedBy: 1 // Default value since we're not using authentication
      };
      
      let response;
      
      if (priceId) {
        // Update existing price configuration
        response = await axiosInstance.put(`/api/prices/${priceId}`, submitData);
      } else {
        // Create new price configuration
        response = await axiosInstance.post('/api/prices', submitData);
        setPriceId(response.data._id);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error saving price configuration:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setError(`Validation errors: ${error.response.data.errors.join(', ')}`);
      } else {
        setError('Failed to save price configuration');
      }
    } finally {
      setSaving(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "rgba(255, 248, 225, 0.1)" }}>
      <Typography variant="h4" mb={2} fontWeight="bold" color="#f57c00">
        Price Settings
      </Typography>
      
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography color="text.secondary">
          Set meal prices and subscription plans
        </Typography>
        
        <Button 
          variant="outlined" 
          sx={{ 
            color: '#f57c00',
            borderColor: '#f57c00',
            '&:hover': {
              borderColor: '#e65100',
              backgroundColor: 'rgba(245, 124, 0, 0.04)'
            }
          }}
          startIcon={<RefreshIcon />}
          onClick={loadPriceHistory}
          disabled={loading}
        >
          View Price History
        </Button>
      </Box>
      
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
          Price configuration saved successfully!
        </Alert>
      )}
      
      {/* Price Summary Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} md={6} p={4}>
      <Card elevation={2} sx={{ 
            borderRadius: 2,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent>
              <Typography  variant="h6" gutterBottom fontWeight="medium" color="#f57c00">Vegetarian Plans</Typography>
              <Divider sx={{  mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Daily</Typography>
                  <Typography variant="h6">₹{formData.plans.daily.vegetarian}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Weekly</Typography>
                  <Typography variant="h6">₹{formData.plans.weekly.vegetarian}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monthly</Typography>
                  <Typography variant="h6">₹{formData.plans.monthly.vegetarian}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Semester</Typography>
                  <Typography variant="h6">₹{formData.plans.semester.vegetarian}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} p={4}>
          <Card elevation={2} sx={{ 
            borderRadius: 2,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="medium" color="#f57c00">Non-Vegetarian Plans</Typography>
              <Divider sx={{   mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Daily</Typography>
                  <Typography variant="h6">₹{formData.plans.daily.nonVegetarian}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Weekly</Typography>
                  <Typography variant="h6">₹{formData.plans.weekly.nonVegetarian}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monthly</Typography>
                  <Typography variant="h6">₹{formData.plans.monthly.nonVegetarian}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Semester</Typography>
                  <Typography variant="h6">₹{formData.plans.semester.nonVegetarian}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Price History Dialog */}
      {showHistory && priceHistory.length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            my: 4, 
            borderRadius: 2,
            backgroundColor: 'white'
          }}
        >
          <Typography variant="h6" mb={2} fontWeight="medium" color="#f57c00">
            Price History
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {priceHistory.map((price) => (
            <Accordion 
              key={price._id} 
              sx={{ 
                mb: 1,
                borderRadius: '4px',
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: '#f57c00' }} />}
                sx={{
                  backgroundColor: 'rgba(255, 248, 225, 0.4)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 248, 225, 0.7)',
                  }
                }}
              >
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Typography>{formatDate(price.effectiveFrom)}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>
                      Daily (Veg): ₹{price.plans.daily.vegetarian}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color={price.isActive ? "success.main" : "text.secondary"}>
                      {price.isActive ? "Active" : "Inactive"}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="#f57c00" fontWeight="medium">Meal Prices</Typography>
                    <Box mt={1}>
                      <Typography>Breakfast: ₹{price.breakfast}</Typography>
                      <Typography>Lunch (Veg): ₹{price.lunch.vegetarian}</Typography>
                      <Typography>Lunch (Non-Veg): ₹{price.lunch.nonVegetarian}</Typography>
                      <Typography>Snacks: ₹{price.snacks}</Typography>
                      <Typography>Dinner (Veg): ₹{price.dinner.vegetarian}</Typography>
                      <Typography>Dinner (Non-Veg): ₹{price.dinner.nonVegetarian}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="#f57c00" fontWeight="medium">Plan Prices</Typography>
                    <Box mt={1}>
                      <Typography>Daily (Veg): ₹{price.plans.daily.vegetarian}</Typography>
                      <Typography>Daily (Non-Veg): ₹{price.plans.daily.nonVegetarian}</Typography>
                      <Typography>Weekly (Veg): ₹{price.plans.weekly.vegetarian}</Typography>
                      <Typography>Weekly (Non-Veg): ₹{price.plans.weekly.nonVegetarian}</Typography>
                      <Typography>Monthly (Veg): ₹{price.plans.monthly.vegetarian}</Typography>
                      <Typography>Monthly (Non-Veg): ₹{price.plans.monthly.nonVegetarian}</Typography>
                    </Box>
                  </Grid>
                  {price.notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="#f57c00" fontWeight="medium">Notes</Typography>
                      <Typography>{price.notes}</Typography>
                    </Grid>
                  )}
                </Grid>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      color: '#f57c00',
                      borderColor: '#f57c00',
                      '&:hover': {
                        borderColor: '#e65100',
                        backgroundColor: 'rgba(245, 124, 0, 0.04)'
                      }
                    }}
                    onClick={() => {
                      setFormData({
                        breakfast: price.breakfast,
                        lunch: price.lunch,
                        snacks: price.snacks,
                        dinner: price.dinner,
                        plans: price.plans,
                        effectiveFrom: new Date(),
                        notes: `Based on configuration from ${formatDate(price.effectiveFrom)}`,
                        isActive: true
                      });
                      setPriceId(null); // Create new record based on this
                      setShowHistory(false);
                      setTabValue(0);
                    }}
                  >
                    Use as Template
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
          
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button 
              onClick={() => setShowHistory(false)}
              sx={{ 
                color: '#f57c00',
                '&:hover': {
                  backgroundColor: 'rgba(245, 124, 0, 0.04)'
                }
              }}
            >
              Close History
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Main Price Configuration Form */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 0, 
          mb: 4, 
          borderRadius: 2,
          overflow: 'hidden', 
          backgroundColor: 'white'
        }}
      >
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 'medium',
              color: 'text.primary',
            },
            '& .Mui-selected': {
              color: '#f57c00',
              fontWeight: 'bold',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#f57c00',
            }
          }}
        >
          <Tab label="Meal Prices" />
          <Tab label="Plan Prices" />
          <Tab label="Settings" />
        </Tabs>
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={4} height="300px" alignItems="center">
            <CircularProgress sx={{ color: '#f57c00' }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Meal Prices Tab */}
            <Box role="tabpanel" hidden={tabValue !== 0} p={3}>
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" mb={2} fontWeight="medium" color="#f57c00">Individual Meal Prices</Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Breakfast Price (₹)"
                      type="number"
                      value={formData.breakfast}
                      onChange={(e) => handleChange(e, 'breakfast')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Snacks Price (₹)"
                      type="number"
                      value={formData.snacks}
                      onChange={(e) => handleChange(e, 'snacks')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" mb={2} fontWeight="medium" color="#f57c00">Lunch Prices</Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Vegetarian Lunch (₹)"
                      type="number"
                      value={formData.lunch.vegetarian}
                      onChange={(e) => handleChange(e, 'lunch', 'vegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Non-Vegetarian Lunch (₹)"
                      type="number"
                      value={formData.lunch.nonVegetarian}
                      onChange={(e) => handleChange(e, 'lunch', 'nonVegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" mb={2} fontWeight="medium" color="#f57c00">Dinner Prices</Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Vegetarian Dinner (₹)"
                      type="number"
                      value={formData.dinner.vegetarian}
                      onChange={(e) => handleChange(e, 'dinner', 'vegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Non-Vegetarian Dinner (₹)"
                      type="number"
                      value={formData.dinner.nonVegetarian}
                      onChange={(e) => handleChange(e, 'dinner', 'nonVegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
            
            {/* Plan Prices Tab */}
            <Box role="tabpanel" hidden={tabValue !== 1} p={3}>
              {tabValue === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" mb={2} fontWeight="medium" color="#f57c00">Subscription Plan Prices</Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" mb={2} fontWeight="medium" color="#f57c00">Daily Plan</Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Vegetarian Daily Plan (₹)"
                      type="number"
                      value={formData.plans.daily.vegetarian}
                      onChange={(e) => handleChange(e, 'plans', 'daily', 'vegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Non-Vegetarian Daily Plan (₹)"
                      type="number"
                      value={formData.plans.daily.nonVegetarian}
                      onChange={(e) => handleChange(e, 'plans', 'daily', 'nonVegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" mb={2} fontWeight="medium" color="#f57c00">Weekly Plan</Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Vegetarian Weekly Plan (₹)"
                      type="number"
                      value={formData.plans.weekly.vegetarian}
                      onChange={(e) => handleChange(e, 'plans', 'weekly', 'vegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Non-Vegetarian Weekly Plan (₹)"
                      type="number"
                      value={formData.plans.weekly.nonVegetarian}
                      onChange={(e) => handleChange(e, 'plans', 'weekly', 'nonVegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" mb={2} fontWeight="medium" color="#f57c00">Monthly Plan</Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Vegetarian Monthly Plan (₹)"
                      type="number"
                      value={formData.plans.monthly.vegetarian}
                      onChange={(e) => handleChange(e, 'plans', 'monthly', 'vegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Non-Vegetarian Monthly Plan (₹)"
                      type="number"
                      value={formData.plans.monthly.nonVegetarian}
                      onChange={(e) => handleChange(e, 'plans', 'monthly', 'nonVegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" mb={2} fontWeight="medium" color="#f57c00">Semester Plan</Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Vegetarian Semester Plan (₹)"
                      type="number"
                      value={formData.plans.semester.vegetarian}
                      onChange={(e) => handleChange(e, 'plans', 'semester', 'vegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Non-Vegetarian Semester Plan (₹)"
                      type="number"
                      value={formData.plans.semester.nonVegetarian}
                      onChange={(e) => handleChange(e, 'plans', 'semester', 'nonVegetarian')}
                      fullWidth
                      InputProps={{ 
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                      required
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
            
            {/* Settings Tab */}
            <Box role="tabpanel" hidden={tabValue !== 2} p={3}>
              {tabValue === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" mb={2} fontWeight="medium" color="#f57c00">Configuration Settings</Typography>
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Effective From"
                        value={formData.effectiveFrom}
                        onChange={handleDateChange}
                        slotProps={{ 
                          textField: { 
                            fullWidth: true,
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                  borderColor: '#f57c00',
                                },
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: '#f57c00',
                              },
                            }
                          } 
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={formData.isActive}
                          onChange={(e) => handleChange(e, 'isActive')}
                          name="isActive"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#f57c00',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#f57c00',
                            },
                          }}
                        />
                      }
                      label="Set as Active Price Configuration"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Notes"
                      multiline
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => handleChange(e, 'notes')}
                      name="notes"
                      fullWidth
                      placeholder="Add any notes about this price configuration"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#f57c00',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#f57c00',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
            
            {/* Submit Button - Always visible */}
            <Box p={3} pt={0}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={saving || loading}
                startIcon={saving ? null : <SaveIcon />}
                sx={{
                  py: 1.5,
                  bgcolor: "#f57c00",
                  '&:hover': { bgcolor: "#e65100" },
                  borderRadius: 2,
                  fontWeight: 'medium',
                  boxShadow: 'none',
                  '&:disabled': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)'
                  }
                }}
              >
                {saving ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Save Price Configuration"}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default PriceSettings;