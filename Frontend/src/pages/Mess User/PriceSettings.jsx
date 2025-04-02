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
  CircularProgress
} from '@mui/material';
import axiosInstance from '../../axiosConfig';

const PriceSettings = () => {
  const [pricePlans, setPricePlans] = useState({
    daily: 150,
    weekly: 900,
    monthly: 3500
  });
  
  const [formData, setFormData] = useState({
    daily: '',
    weekly: '',
    monthly: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        // In a real app, we'd fetch from API
        // const response = await axiosInstance.get('/prices');
        // setPricePlans(response.data);
        
        // For now, we'll use sample data
        setTimeout(() => {
          setPricePlans({
            daily: 150,
            weekly: 900,
            monthly: 3500
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setError('Failed to load price plans.');
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    // Update form data when price plans are loaded
    setFormData({
      daily: pricePlans.daily,
      weekly: pricePlans.weekly,
      monthly: pricePlans.monthly
    });
  }, [pricePlans]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');
    
    try {
      // In a real app, we'd send to API
      // await axiosInstance.post('/prices', formData);
      
      // For now, simulate API call
      setTimeout(() => {
        setPricePlans({
          daily: parseFloat(formData.daily),
          weekly: parseFloat(formData.weekly),
          monthly: parseFloat(formData.monthly)
        });
        setSuccess(true);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error updating prices:', error);
      setError('Failed to update price plans.');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Price Settings
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Current Price Plans
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {loading && !error ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1">Daily Plan</Typography>
                        <Typography variant="h6">₹{pricePlans.daily}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1">Weekly Plan</Typography>
                        <Typography variant="h6">₹{pricePlans.weekly}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1">Monthly Plan</Typography>
                        <Typography variant="h6">₹{pricePlans.monthly}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Update Price Plans
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Price plans updated successfully!
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Daily Plan Price (₹)"
                    name="daily"
                    type="number"
                    value={formData.daily}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0 } }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Weekly Plan Price (₹)"
                    name="weekly"
                    type="number"
                    value={formData.weekly}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0 } }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Monthly Plan Price (₹)"
                    name="monthly"
                    type="number"
                    value={formData.monthly}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0 } }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      bgcolor: "#f57c00",
                      '&:hover': { bgcolor: "#e65100" }
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Update Prices"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PriceSettings;