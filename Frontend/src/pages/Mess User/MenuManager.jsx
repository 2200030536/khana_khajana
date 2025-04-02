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
  Fade,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Backdrop,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Today as TodayIcon,
} from '@mui/icons-material';

const MenuManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Constants
  const DAYS_OF_WEEK = [
    { value: '1', label: 'Sunday' },
    { value: '2', label: 'Monday' },
    { value: '3', label: 'Tuesday' },
    { value: '4', label: 'Wednesday' },
    { value: '5', label: 'Thursday' },
    { value: '6', label: 'Friday' },
    { value: '7', label: 'Saturday' },
    { value: '8', label: 'Specials' },
  ];

  const CURRENT_USER = '2200030536';
  const CURRENT_DATE = '2025-04-02 11:53:55';

  // State
  const [formData, setFormData] = useState({
    breakfast: '',
    lunch: '',
    snacks: '',
    dinner: '',
    day: '',
    lastModifiedBy: CURRENT_USER,
    lastModifiedAt: CURRENT_DATE,
  });
  
  const [menus, setMenus] = useState([]);
  const [activeTab, setActiveTab] = useState('view');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const getDayName = (dayValue) => {
    const day = DAYS_OF_WEEK.find(day => day.value === String(dayValue));
    return day ? day.label : 'Invalid day';
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/menus');
      setMenus(response.data);
    } catch (error) {
      showNotification('Error fetching menus: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMenus();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
      lastModifiedBy: CURRENT_USER,
      lastModifiedAt: CURRENT_DATE,
    }));

    if (activeTab === 'update' && name === 'day') {
      const menuForDay = menus.find(menu => menu.day === value);
      if (menuForDay) {
        setFormData({
          ...menuForDay,
          lastModifiedBy: CURRENT_USER,
          lastModifiedAt: CURRENT_DATE,
        });
        setSelectedMenu(menuForDay);
      } else {
        setFormData(prev => ({
          ...prev,
          breakfast: '',
          lunch: '',
          snacks: '',
          dinner: '',
          day: value,
          lastModifiedBy: CURRENT_USER,
          lastModifiedAt: CURRENT_DATE,
        }));
        setSelectedMenu(null);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = ['breakfast', 'lunch', 'snacks', 'dinner', 'day'];
    if (requiredFields.some(field => !formData[field])) {
      showNotification('Please fill in all required fields', 'warning');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/menus', {
        ...formData,
        lastModifiedBy: CURRENT_USER,
        lastModifiedAt: CURRENT_DATE
      });

      setMenus(prevMenus => [...prevMenus, response.data]);
      showNotification('Menu created successfully!');
      setActiveTab('view');
      setFormData({
        breakfast: '',
        lunch: '',
        snacks: '',
        dinner: '',
        day: '',
        lastModifiedBy: CURRENT_USER,
        lastModifiedAt: CURRENT_DATE,
      });
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error creating menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.day) {
      showNotification('Please select a day to update', 'warning');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.put(`/menus/day/${formData.day}`, {
        ...formData,
        lastModifiedBy: CURRENT_USER,
        lastModifiedAt: CURRENT_DATE
      });

      setMenus(prevMenus => 
        prevMenus.map(menu => 
          menu.day === response.data.day ? response.data : menu
        )
      );
      showNotification('Menu updated successfully!');
      setActiveTab('view');
      setFormData({
        breakfast: '',
        lunch: '',
        snacks: '',
        dinner: '',
        day: '',
        lastModifiedBy: CURRENT_USER,
        lastModifiedAt: CURRENT_DATE,
      });
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error updating menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!formData.day) {
      showNotification('Please select a day to delete', 'warning');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the menu for ${getDayName(formData.day)}?`)) {
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.delete(`/menus/day/${formData.day}`);
      setMenus(prevMenus => prevMenus.filter(menu => menu.day !== formData.day));
      showNotification('Menu deleted successfully!');
      setActiveTab('view');
      setFormData({
        breakfast: '',
        lunch: '',
        snacks: '',
        dinner: '',
        day: '',
        lastModifiedBy: CURRENT_USER,
        lastModifiedAt: CURRENT_DATE,
      });
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error deleting menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const MenuField = ({ label, value }) => (
    <Box mb={1}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        <strong>{label}:</strong> {value}
      </Typography>
    </Box>
  );

  const renderMenuCards = () => (
    <Grid container spacing={3}>
      {menus
        .sort((a, b) => parseInt(a.day) - parseInt(b.day))
        .map((menu) => (
          <Grid item xs={12} sm={6} md={4} key={menu._id || menu.day}>
            <Fade in timeout={500}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {getDayName(menu.day)}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit Menu">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setFormData({
                              ...menu,
                              lastModifiedBy: CURRENT_USER,
                              lastModifiedAt: CURRENT_DATE,
                            });
                            setActiveTab('update');
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Menu">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setFormData({
                              ...menu,
                              lastModifiedBy: CURRENT_USER,
                              lastModifiedAt: CURRENT_DATE,
                            });
                            setActiveTab('delete');
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <MenuField label="Breakfast" value={menu.breakfast} />
                  <MenuField label="Lunch" value={menu.lunch} />
                  <MenuField label="Snacks" value={menu.snacks} />
                  <MenuField label="Dinner" value={menu.dinner} />
                  {menu.lastModifiedBy && (
                    <Box mt={2} pt={2} borderTop={1} borderColor="divider">
                      <Typography variant="caption" color="textSecondary">
                        Last modified by: {menu.lastModifiedBy}
                        <br />
                        at: {menu.lastModifiedAt}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
    </Grid>
  );

  const ActionButtons = () => (
    <Box
      mb={4}
      display="flex"
      justifyContent="center"
      gap={2}
      flexWrap="wrap"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: 'background.default',
        py: 2,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Button
        variant={activeTab === 'view' ? 'contained' : 'outlined'}
        onClick={() => setActiveTab('view')}
        startIcon={<RefreshIcon />}
        color="primary"
      >
        View Menus
      </Button>
      <Button
        variant={activeTab === 'create' ? 'contained' : 'outlined'}
        onClick={() => {
          setActiveTab('create');
          setFormData({
            breakfast: '',
            lunch: '',
            snacks: '',
            dinner: '',
            day: '',
            lastModifiedBy: CURRENT_USER,
            lastModifiedAt: CURRENT_DATE,
          });
        }}
        startIcon={<AddIcon />}
        color="success"
      >
        Create Menu
      </Button>
      <Button
        variant={activeTab === 'update' ? 'contained' : 'outlined'}
        onClick={() => {
          setActiveTab('update');
          setFormData({
            breakfast: '',
            lunch: '',
            snacks: '',
            dinner: '',
            day: '',
            lastModifiedBy: CURRENT_USER,
            lastModifiedAt: CURRENT_DATE,
          });
        }}
        startIcon={<EditIcon />}
        color="warning"
      >
        Update Menu
      </Button>
      <Button
        variant={activeTab === 'delete' ? 'contained' : 'outlined'}
        onClick={() => {
          setActiveTab('delete');
          setFormData({
            breakfast: '',
            lunch: '',
            snacks: '',
            dinner: '',
            day: '',
            lastModifiedBy: CURRENT_USER,
            lastModifiedAt: CURRENT_DATE,
          });
        }}
        startIcon={<DeleteIcon />}
        color="error"
      >
        Delete Menu
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 5, pb: 5 }}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Menu Management
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="textSecondary">
            <TodayIcon sx={{ fontSize: 'small', mr: 0.5, verticalAlign: 'middle' }} />
            {CURRENT_DATE}
          </Typography>
          <Tooltip title="Refresh Menus">
            <IconButton onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshIcon sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <ActionButtons />

      <Fade in timeout={500}>
        <Box>
          {activeTab === 'view' && (
            <>
              {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : menus.length > 0 ? (
                renderMenuCards()
              ) : (
                <Typography align="center">No menus found. Use the 'Create Menu' tab to add one.</Typography>
              )}
            </>
          )}

          {(activeTab === 'create' || activeTab === 'update' || activeTab === 'delete') && (
            <Card sx={{ p: 3, boxShadow: 3 }}>
              <form onSubmit={activeTab === 'create' ? handleCreate : activeTab === 'update' ? handleUpdate : handleDelete}>
                <FormControl variant="outlined" fullWidth margin="normal" required>
                  <InputLabel id="day-label">Day</InputLabel>
                  <Select
                    labelId="day-label"
                    label="Day"
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                  >
                    <MenuItem value="" disabled><em>Select a day...</em></MenuItem>
                    {DAYS_OF_WEEK.map(day => (
                      <MenuItem key={day.value} value={day.value}>{day.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {(activeTab !== 'delete' && (formData.day || activeTab === 'create')) && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      label="Breakfast"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="breakfast"
                      value={formData.breakfast}
                      onChange={handleChange}
                      required
                      multiline
                      rows={2}
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
                      multiline
                      rows={2}
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
                      multiline
                      rows={2}
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
                      multiline
                      rows={2}
                    />
                  </Box>
                )}

                <Box mt={3}>
                  <Button
                    variant="contained"
                    color={activeTab === 'create' ? 'success' : activeTab === 'update' ? 'warning' : 'error'}
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      height: 56,
                      position: 'relative',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ position: 'absolute' }} />
                    ) : (
                      `${activeTab === 'create' ? 'Create' : activeTab === 'update' ? 'Update' : 'Delete'} Menu`
                    )}
                  </Button>
                </Box>
              </form>
            </Card>
          )}
        </Box>
      </Fade>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Backdrop sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default MenuManager;