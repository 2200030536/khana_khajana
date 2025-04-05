import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Divider, Grid, Card, CardContent, Alert,
  CircularProgress, Tabs, Tab, FormControlLabel, Switch, Accordion, AccordionSummary,
  AccordionDetails, InputAdornment, useTheme // Import useTheme for spacing reference if needed
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  SaveAlt as SaveIcon,
  RefreshOutlined as RefreshIcon,
  // DateRange as DateRangeIcon // Not used in DatePicker v6+ directly
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
// Assuming axiosInstance is configured correctly elsewhere
// import axiosInstance from '../../axiosConfig';

// Mock axiosInstance for demonstration if not available
const axiosInstance = {
  get: async (url) => {
    console.log(`Mock GET: ${url}`);
    if (url === '/api/prices/current') {
        // Simulate finding a current price
        await new Promise(res => setTimeout(res, 500));
        return { data: {
            _id: 'current123', breakfast: 30, lunch: { vegetarian: 60, nonVegetarian: 75 }, snacks: 20, dinner: { vegetarian: 65, nonVegetarian: 80 },
            plans: { daily: { vegetarian: 150, nonVegetarian: 170 }, weekly: { vegetarian: 950, nonVegetarian: 1100 }, monthly: { vegetarian: 3500, nonVegetarian: 4000 }, semester: { vegetarian: 13000, nonVegetarian: 15000 }},
            effectiveFrom: new Date(2023, 10, 1), notes: 'Current active prices', isActive: true
        }};
        // Simulate 404
        // await new Promise(res => setTimeout(res, 500));
        // const error = new Error("Not Found"); error.response = { status: 404 }; throw error;
    }
    if (url === '/api/prices') {
      await new Promise(res => setTimeout(res, 500));
      return { data: [
        { _id: 'hist1', effectiveFrom: new Date(2023, 5, 1), plans: { daily: { vegetarian: 140, nonVegetarian: 160 }, weekly: { vegetarian: 900, nonVegetarian: 1050 }, monthly: { vegetarian: 3300, nonVegetarian: 3800 } }, lunch: { vegetarian: 55, nonVegetarian: 70 }, dinner: { vegetarian: 60, nonVegetarian: 75 }, breakfast: 25, snacks: 15, isActive: false, notes: 'Previous Prices' },
        { _id: 'current123', effectiveFrom: new Date(2023, 10, 1), plans: { daily: { vegetarian: 150, nonVegetarian: 170 }, weekly: { vegetarian: 950, nonVegetarian: 1100 }, monthly: { vegetarian: 3500, nonVegetarian: 4000 } }, lunch: { vegetarian: 60, nonVegetarian: 75 }, dinner: { vegetarian: 65, nonVegetarian: 80 }, breakfast: 30, snacks: 20, isActive: true, notes: 'Current active prices' }
      ]};
    }
    return { data: {} };
  },
  post: async (url, data) => {
    console.log(`Mock POST: ${url}`, data);
    await new Promise(res => setTimeout(res, 1000));
    return { data: { ...data, _id: 'new456' } };
  },
  put: async (url, data) => {
    console.log(`Mock PUT: ${url}`, data);
    await new Promise(res => setTimeout(res, 1000));
    return { data: { ...data } };
  }
};


const PriceSettings = () => {
  // --- State Declarations (keep as is) ---
  const [formData, setFormData] = useState({
    breakfast: 0,
    lunch: { vegetarian: 0, nonVegetarian: 0 },
    snacks: 0,
    dinner: { vegetarian: 0, nonVegetarian: 0 },
    plans: {
      daily: { vegetarian: 0, nonVegetarian: 0 },
      weekly: { vegetarian: 0, nonVegetarian: 0 },
      monthly: { vegetarian: 0, nonVegetarian: 0 },
      semester: { vegetarian: 0, nonVegetarian: 0 }
    },
    effectiveFrom: new Date(),
    notes: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [priceId, setPriceId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  // --- End State Declarations ---

  // --- Effects and Handlers (keep as is) ---
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axiosInstance.get('/api/prices/current');
        const priceData = response.data;
        setFormData({
          breakfast: priceData.breakfast || 0,
          lunch: priceData.lunch || { vegetarian: 0, nonVegetarian: 0 },
          snacks: priceData.snacks || 0,
          dinner: priceData.dinner || { vegetarian: 0, nonVegetarian: 0 },
          plans: priceData.plans || { daily: { v: 0, nv: 0 }, weekly: { v: 0, nv: 0 }, monthly: { v: 0, nv: 0 }, semester: { v: 0, nv: 0 } },
          effectiveFrom: priceData.effectiveFrom ? new Date(priceData.effectiveFrom) : new Date(),
          notes: priceData.notes || '',
          isActive: priceData.isActive !== undefined ? priceData.isActive : true
        });
        setPriceId(priceData._id);
      } catch (error) {
        console.error('Error fetching current price:', error);
        if (error.response?.status === 404) {
          setError('No active price configuration found. Please create one.');
          // Keep default form data to create a new one
          setPriceId(null);
        } else {
          setError('Failed to load price configuration. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentPrice();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e, section, subsection, field) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value);

    if (section && subsection && field) {
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [subsection]: { ...prev[section][subsection], [field]: val } } }));
    } else if (section && subsection) {
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [subsection]: val } }));
    } else if (section) {
      setFormData(prev => ({ ...prev, [section]: val }));
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, effectiveFrom: date }));
  };

  const loadPriceHistory = async () => {
    try {
      setLoading(true); setError(''); setShowHistory(false); // Reset state
      const response = await axiosInstance.get('/api/prices');
      // Sort history by effective date descending
      const sortedHistory = response.data.sort((a, b) => new Date(b.effectiveFrom) - new Date(a.effectiveFrom));
      setPriceHistory(sortedHistory);
      setShowHistory(true);
    } catch (error) {
      console.error('Error loading price history:', error);
      setError('Failed to load price history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setSuccess(false); setError('');
    try {
      // Add basic validation for required number fields being actual numbers
      const requiredNumberPaths = [
          'breakfast', 'snacks',
          'lunch.vegetarian', 'lunch.nonVegetarian',
          'dinner.vegetarian', 'dinner.nonVegetarian',
          'plans.daily.vegetarian', 'plans.daily.nonVegetarian',
          'plans.weekly.vegetarian', 'plans.weekly.nonVegetarian',
          'plans.monthly.vegetarian', 'plans.monthly.nonVegetarian',
          'plans.semester.vegetarian', 'plans.semester.nonVegetarian',
      ];
      for (const path of requiredNumberPaths) {
          const keys = path.split('.');
          let value = formData;
          keys.forEach(key => { value = value ? value[key] : undefined; });
          if (typeof value !== 'number' || isNaN(value) || value < 0) {
              throw new Error(`Invalid input: ${path.replace('.', ' ')} must be a non-negative number.`);
          }
      }
      if (!formData.effectiveFrom || isNaN(new Date(formData.effectiveFrom).getTime())) {
          throw new Error("Effective From date is invalid.");
      }

      const submitData = { ...formData }; // No need for lastModifiedBy on frontend usually
      let response;
      if (priceId) {
        response = await axiosInstance.put(`/api/prices/${priceId}`, submitData);
      } else {
        response = await axiosInstance.post('/api/prices', submitData);
        setPriceId(response.data._id); // Update priceId if created
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      // Optionally reload current prices or history after save
      // await fetchCurrentPrice(); // Or just update state optimistically
    } catch (error) {
      console.error('Error saving price configuration:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message); // Show validation error message
      } else {
        setError('Failed to save price configuration');
      }
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'PP'); // Use 'PP' for localized 'MMM dd, yyyy'
    } catch (e) {
      return 'Invalid date';
    }
  };
  // --- End Effects and Handlers ---

  // Helper for rendering price fields
  const renderPriceField = (label, value, onChangeHandler) => (
    <TextField
      label={label}
      type="number"
      value={value === undefined || value === null || value === '' ? '' : value} // Handle empty string for input control
      onChange={onChangeHandler}
      fullWidth
      InputProps={{
        inputProps: { min: 0, step: "0.01" },
        startAdornment: <InputAdornment position="start">₹</InputAdornment>
      }}
      required
      variant="outlined" // Ensure consistent variant
      size="small"      // Make fields slightly smaller
    />
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}> {/* Add overall padding */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Price Settings
          </Typography>
          <Typography color="text.secondary">
            Set meal prices and subscription plans effective from a specific date.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={loadPriceHistory}
          disabled={loading || saving}
          sx={{ whiteSpace: 'nowrap' }} // Prevent wrapping on small screens
        >
          View History
        </Button>
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>Price configuration saved successfully!</Alert>}

      {/* Price History Section */}
      {showHistory && (
        <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
             <Typography variant="h6">Price History</Typography>
             <Button onClick={() => setShowHistory(false)} size="small">Close History</Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {priceHistory.length > 0 ? (
            priceHistory.map((price) => (
              <Accordion key={price._id} sx={{ mb: 1.5, '&:before': { display: 'none' } }} elevation={1}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body1" fontWeight="medium">{formatDate(price.effectiveFrom)}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="body2">Daily (Veg): ₹{price.plans?.daily?.vegetarian ?? 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="body2" color={price.isActive ? "success.main" : "text.secondary"}>
                        {price.isActive ? "Was Active" : "Inactive"}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#fafafa' }}>
                  <Grid container spacing={3}>
                    {/* Simplified details - add more if needed */}
                     <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>Meal Prices</Typography>
                      <Typography variant="body2">Breakfast: ₹{price.breakfast ?? 'N/A'}</Typography>
                      <Typography variant="body2">Lunch (V/NV): ₹{price.lunch?.vegetarian ?? 'N/A'} / ₹{price.lunch?.nonVegetarian ?? 'N/A'}</Typography>
                      <Typography variant="body2">Snacks: ₹{price.snacks ?? 'N/A'}</Typography>
                      <Typography variant="body2">Dinner (V/NV): ₹{price.dinner?.vegetarian ?? 'N/A'} / ₹{price.dinner?.nonVegetarian ?? 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                       <Typography variant="subtitle2" gutterBottom>Plan Prices (Monthly V/NV)</Typography>
                       <Typography variant="body2">₹{price.plans?.monthly?.vegetarian ?? 'N/A'} / ₹{price.plans?.monthly?.nonVegetarian ?? 'N/A'}</Typography>
                       {/* Add other plans if needed */}
                       {price.notes && (<Typography variant="caption" display="block" mt={1}>Notes: {price.notes}</Typography>)}
                    </Grid>
                  </Grid>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                      variant="outlined" size="small" color="secondary"
                      onClick={() => {
                        setFormData({
                          // Ensure all fields exist in the historical price object or provide defaults
                          breakfast: price.breakfast ?? 0,
                          lunch: price.lunch ?? { vegetarian: 0, nonVegetarian: 0 },
                          snacks: price.snacks ?? 0,
                          dinner: price.dinner ?? { vegetarian: 0, nonVegetarian: 0 },
                          plans: price.plans ?? { daily: {}, weekly: {}, monthly: {}, semester: {} }, // Add structure if missing
                          effectiveFrom: new Date(), // New effective date
                          notes: `Based on config from ${formatDate(price.effectiveFrom)}`,
                          isActive: true // Default to active when templating
                        });
                        setPriceId(null); // Ensure it creates a *new* record
                        setShowHistory(false);
                        setTabValue(0); // Go back to first tab
                        setSuccess(false); setError(''); // Clear messages
                      }}
                    >
                      Use as Template
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>No price history found.</Typography>
          )}
        </Paper>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
         <Grid item xs={12} md={6}>
           <Card elevation={2}>
             <CardContent>
               <Typography variant="h6" gutterBottom>Veg Plan Summary</Typography>
               <Divider sx={{ mb: 2 }} />
               <Grid container spacing={1}>
                 {['daily', 'weekly', 'monthly', 'semester'].map(plan => (
                    <Grid item xs={6} sm={3} key={plan}>
                      <Typography variant="caption" color="text.secondary" textTransform="capitalize">{plan}</Typography>
                      <Typography variant="h6">₹{formData.plans[plan]?.vegetarian ?? 0}</Typography>
                    </Grid>
                 ))}
               </Grid>
             </CardContent>
           </Card>
         </Grid>
         <Grid item xs={12} md={6}>
           <Card elevation={2}>
             <CardContent>
               <Typography variant="h6" gutterBottom>Non-Veg Plan Summary</Typography>
               <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                 {['daily', 'weekly', 'monthly', 'semester'].map(plan => (
                    <Grid item xs={6} sm={3} key={plan}>
                      <Typography variant="caption" color="text.secondary" textTransform="capitalize">{plan}</Typography>
                      <Typography variant="h6">₹{formData.plans[plan]?.nonVegetarian ?? 0}</Typography>
                    </Grid>
                 ))}
               </Grid>
             </CardContent>
           </Card>
         </Grid>
      </Grid>

      {/* Main Price Configuration Form */}
      <Paper elevation={3} sx={{ overflow: 'hidden' }}> {/* Hide potential overflow */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.100' }} // Added subtle bg color to tabs
        >
          <Tab label="Meal Prices" id="tab-meal" aria-controls="tabpanel-meal" />
          <Tab label="Plan Prices" id="tab-plan" aria-controls="tabpanel-plan" />
          <Tab label="Settings" id="tab-settings" aria-controls="tabpanel-settings" />
        </Tabs>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 4, minHeight: 200 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading Configuration...</Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Tab Panel Content */}
            <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-meal" aria-labelledby="tab-meal" sx={{ p: 3 }}>
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}><Typography variant="h6" component="h3" gutterBottom>Individual Meal Prices</Typography><Divider /></Grid>
                  <Grid item xs={12} sm={6} md={4}>{renderPriceField("Breakfast Price", formData.breakfast, (e) => handleChange(e, 'breakfast'))}</Grid>
                  <Grid item xs={12} sm={6} md={4}>{renderPriceField("Snacks Price", formData.snacks, (e) => handleChange(e, 'snacks'))}</Grid>
                  <Grid item xs={12}><Typography variant="subtitle1" sx={{ mt: 2 }} component="h4">Lunch</Typography></Grid>
                  <Grid item xs={12} sm={6}>{renderPriceField("Vegetarian Lunch", formData.lunch.vegetarian, (e) => handleChange(e, 'lunch', 'vegetarian'))}</Grid>
                  <Grid item xs={12} sm={6}>{renderPriceField("Non-Vegetarian Lunch", formData.lunch.nonVegetarian, (e) => handleChange(e, 'lunch', 'nonVegetarian'))}</Grid>
                  <Grid item xs={12}><Typography variant="subtitle1" sx={{ mt: 2 }} component="h4">Dinner</Typography></Grid>
                  <Grid item xs={12} sm={6}>{renderPriceField("Vegetarian Dinner", formData.dinner.vegetarian, (e) => handleChange(e, 'dinner', 'vegetarian'))}</Grid>
                  <Grid item xs={12} sm={6}>{renderPriceField("Non-Vegetarian Dinner", formData.dinner.nonVegetarian, (e) => handleChange(e, 'dinner', 'nonVegetarian'))}</Grid>
                </Grid>
              )}
            </Box>

            <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-plan" aria-labelledby="tab-plan" sx={{ p: 3 }}>
              {tabValue === 1 && (
                <Grid container spacing={3}>
                    <Grid item xs={12}><Typography variant="h6" component="h3" gutterBottom>Subscription Plan Prices</Typography><Divider /></Grid>

                    {/* Refactored Plan Sections */}
                    {['daily', 'weekly', 'monthly', 'semester'].map((planType) => (
                        <React.Fragment key={planType}>
                            <Grid item xs={12}><Typography variant="subtitle1" sx={{ mt: 2 }} component="h4" textTransform="capitalize">{planType} Plan</Typography></Grid>
                            <Grid item xs={12} sm={6}>{renderPriceField(`Vegetarian ${planType} Plan`, formData.plans[planType]?.vegetarian, (e) => handleChange(e, 'plans', planType, 'vegetarian'))}</Grid>
                            <Grid item xs={12} sm={6}>{renderPriceField(`Non-Vegetarian ${planType} Plan`, formData.plans[planType]?.nonVegetarian, (e) => handleChange(e, 'plans', planType, 'nonVegetarian'))}</Grid>
                        </React.Fragment>
                    ))}
                </Grid>
              )}
            </Box>

            <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-settings" aria-labelledby="tab-settings" sx={{ p: 3 }}>
              {tabValue === 2 && (
                <Grid container spacing={3} alignItems="center"> {/* Added alignItems */}
                    <Grid item xs={12}><Typography variant="h6" component="h3" gutterBottom>Configuration Settings</Typography><Divider /></Grid>
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Effective From Date"
                                value={formData.effectiveFrom}
                                onChange={handleDateChange}
                                minDate={new Date()} // Optional: Prevent setting past dates for new configs
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true,
                                        helperText: "Prices will apply from this date onwards."
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
                                    onChange={(e) => handleChange(e, 'isActive')} // Direct update for switch
                                    name="isActive" // Name is useful for forms, though handled directly here
                                    color="primary"
                                />
                            }
                            label="Set as Active Configuration"
                            sx={{ pt: { xs: 1, md: 0 } }} // Adjust top padding
                        />
                     </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Notes (Optional)"
                            multiline
                            rows={3} // Slightly smaller
                            value={formData.notes}
                            onChange={(e) => handleChange(e, 'notes')} // Direct update for notes
                            name="notes"
                            fullWidth
                            variant="outlined"
                            placeholder="Add any relevant notes about this price set (e.g., reason for change)"
                            sx={{ mt: 2 }}
                        />
                    </Grid>
                </Grid>
              )}
            </Box>

            {/* Submit Button Area */}
            <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', mt: -0.1 /* Overlap divider slightly */ }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={saving || loading}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  bgcolor: "#f17200",
                  '&:hover': { bgcolor: "#e65100" }
                }}
              >
                {saving ? "Saving..." : (priceId ? "Update Price Configuration" : "Save New Price Configuration")}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default PriceSettings;

// Remember to install date-fns if you haven't:
// npm install date-fns
// or
// yarn add date-fns