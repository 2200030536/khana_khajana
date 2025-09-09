import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Paper,
  Divider,
  Chip,
  Avatar,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Today as TodayIcon,
  Restaurant as RestaurantIcon,
  FreeBreakfast as BreakfastIcon,
  Fastfood as LunchIcon,
  LocalCafe as SnacksIcon,
  DinnerDining as DinnerIcon, // Changed from 'Dinner' to 'DinnerDining'
  Save as SaveIcon,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounceIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  70% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const MenuManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Function to get current date in the required format
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
  };
  
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
  const CURRENT_DATE = getCurrentDate();

  // State variables
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [menus, setMenus] = useState([]);
  const [activeTab, setActiveTab] = useState('view');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animateCard, setAnimateCard] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    breakfast: '',
    lunch: '',
    snacks: '',
    dinner: '',
    day: '',
    lastModifiedBy: '',
    lastModifiedAt: CURRENT_DATE,
  });

  // First load user data
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  // After user is loaded, update form data and fetch menus
  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({
        ...prev,
        lastModifiedBy: user.id
      }));
      fetchMenus();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError("");
    try {
      // Make sure this matches your backend route exactly
      const response = await axiosInstance.get("/auth/profile");
      
      console.log("Profile data:", response.data); // Debug
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setError("Invalid response from server");
        showNotification("Invalid response from server", "error");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized access - redirect to login
        setError("Session expired. Please login again.");
        showNotification("Session expired. Please login again.", "error");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to fetch profile. " + (error.response?.data?.error || "Please try again."));
        showNotification("Failed to fetch profile", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dayValue) => {
    const day = DAYS_OF_WEEK.find(day => day.value === String(dayValue));
    return day ? day.label : 'Invalid day';
  };

  const getDayColor = (dayValue) => {
    const colors = {
      '1': '#FF5722', // Sunday - Deep Orange
      '2': '#2196F3', // Monday - Blue
      '3': '#4CAF50', // Tuesday - Green
      '4': '#9C27B0', // Wednesday - Purple
      '5': '#FF9800', // Thursday - Orange
      '6': '#F44336', // Friday - Red
      '7': '#00BCD4', // Saturday - Cyan
      '8': '#673AB7', // Specials - Deep Purple
    };
    return colors[dayValue] || '#607D8B'; // Default - Blue Grey
  };

  const getMealColor = (mealType) => {
    switch(mealType) {
      case 'breakfast': return theme.palette.info.main; // Blue
      case 'lunch': return theme.palette.warning.main; // Orange/Amber
      case 'snacks': return theme.palette.success.main; // Green
      case 'dinner': return theme.palette.error.main; // Red
      default: return theme.palette.primary.main;
    }
  };

  const getMealIcon = (mealType) => {
    switch(mealType) {
      case 'breakfast': return <BreakfastIcon />;
      case 'lunch': return <LunchIcon />;
      case 'snacks': return <SnacksIcon />;
      case 'dinner': return <DinnerIcon />;
      default: return <RestaurantIcon />;
    }
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
      lastModifiedBy: user?.id || '',
      lastModifiedAt: CURRENT_DATE,
    }));

    if (activeTab === 'update' && name === 'day') {
      const menuForDay = menus.find(menu => menu.day === value);
      if (menuForDay) {
        setFormData({
          ...menuForDay,
          lastModifiedBy: user?.id || '',
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
          lastModifiedBy: user?.id || '',
          lastModifiedAt: CURRENT_DATE,
        }));
        setSelectedMenu(null);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user?.id) {
      showNotification('You must be logged in to create a menu', 'error');
      return;
    }
    
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
        lastModifiedBy: user.id,
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
        lastModifiedBy: user.id,
        lastModifiedAt: CURRENT_DATE,
      });
      
      // Animate the newly created menu
      setTimeout(() => {
        setAnimateCard(response.data._id || response.data.day);
        setTimeout(() => setAnimateCard(null), 2000);
      }, 300);
      
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error creating menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user?.id) {
      showNotification('You must be logged in to update a menu', 'error');
      return;
    }
    
    setLoading(true);

    if (!formData.day) {
      showNotification('Please select a day to update', 'warning');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.put(`/menus/day/${formData.day}`, {
        ...formData,
        lastModifiedBy: user.id,
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
        lastModifiedBy: user.id,
        lastModifiedAt: CURRENT_DATE,
      });
      
      // Animate the updated menu
      setTimeout(() => {
        setAnimateCard(response.data._id || response.data.day);
        setTimeout(() => setAnimateCard(null), 2000);
      }, 300);
      
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error updating menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user?.id) {
      showNotification('You must be logged in to delete a menu', 'error');
      return;
    }
    
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
        lastModifiedBy: user?.id || '',
        lastModifiedAt: CURRENT_DATE,
      });
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error deleting menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const MenuField = ({ label, value, icon, mealType }) => {
    const color = getMealColor(mealType);
    
    return (
      <Box mb={2} sx={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        animation: `${slideIn} 0.4s ease-out forwards`
      }}>
        <Avatar 
          sx={{ 
            bgcolor: alpha(color, 0.1), 
            color: color,
            mr: 2
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" color={color} fontWeight="medium">
            {label}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {value || 'Not specified'}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderMenuCards = () => (
    <Grid container spacing={3}>
      {menus
        .sort((a, b) => parseInt(a.day) - parseInt(b.day))
        .map((menu, index) => (
          <Grid item xs={12} sm={6} md={4} key={menu._id || menu.day}
            sx={{ 
              animation: `${fadeIn} ${0.2 + index * 0.1}s ease-out forwards`,
            }}
          >
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[10],
                },
                overflow: 'hidden',
                borderRadius: 2,
                ...(animateCard === (menu._id || menu.day) && {
                  animation: `${pulse} 1s ease-in-out`
                })
              }}
            >
              <Box 
                sx={{ 
                  height: 12, 
                  backgroundColor: getDayColor(menu.day),
                }}
              />
              <CardContent sx={{ flexGrow: 1, pb: 2, pt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      sx={{ 
                        bgcolor: getDayColor(menu.day),
                        mr: 2
                      }}
                    >
                      {getDayName(menu.day).charAt(0)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {getDayName(menu.day)}
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title="Edit Menu">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setFormData({
                            ...menu,
                            lastModifiedBy: user?.id || '',
                            lastModifiedAt: CURRENT_DATE,
                          });
                          setActiveTab('update');
                        }}
                        sx={{ 
                          '&:hover': { 
                            color: theme.palette.warning.main,
                            transform: 'rotate(10deg)'
                          },
                          transition: 'all 0.2s ease'
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
                            lastModifiedBy: user?.id || '',
                            lastModifiedAt: CURRENT_DATE,
                          });
                          setActiveTab('delete');
                        }}
                        sx={{ 
                          '&:hover': { 
                            color: theme.palette.error.main,
                            transform: 'rotate(10deg)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <MenuField 
                  label="Breakfast" 
                  value={menu.breakfast} 
                  icon={<BreakfastIcon />} 
                  mealType="breakfast" 
                />
                <MenuField 
                  label="Lunch" 
                  value={menu.lunch} 
                  icon={<LunchIcon />} 
                  mealType="lunch" 
                />
                <MenuField 
                  label="Snacks" 
                  value={menu.snacks} 
                  icon={<SnacksIcon />} 
                  mealType="snacks" 
                />
                <MenuField 
                  label="Dinner" 
                  value={menu.dinner} 
                  icon={<DinnerIcon />}
                  mealType="dinner" 
                />
                {menu.lastModifiedBy && (
                  <Box mt={2} pt={2} borderTop={1} borderColor="divider">
                    <Typography variant="caption" color="textSecondary">
                      Last modified by: <Chip size="small" label={menu.lastModifiedBy} />
                      <br />
                      at: {menu.lastModifiedAt}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );

  const ActionButtons = () => (
    <Paper
      elevation={4}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: theme.palette.background.default,
        py: 2,
        px: 3,
        mb: 4,
        borderRadius: 2,
        animation: `${bounceIn} 0.6s`,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant={activeTab === 'view' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('view')}
            startIcon={<RefreshIcon />}
            color="primary"
            fullWidth
            sx={{
              borderRadius: '8px',
              py: 1.5,
              transition: 'all 0.3s',
              '&:hover': {
                transform: activeTab !== 'view' ? 'translateY(-3px)' : 'none',
                boxShadow: activeTab !== 'view' ? 4 : 'none',
              },
            }}
          >
            View Menus
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                lastModifiedBy: user?.id || '',
                lastModifiedAt: CURRENT_DATE,
              });
            }}
            startIcon={<AddIcon />}
            color="success"
            fullWidth
            sx={{
              borderRadius: '8px',
              py: 1.5,
              transition: 'all 0.3s',
              '&:hover': {
                transform: activeTab !== 'create' ? 'translateY(-3px)' : 'none',
                boxShadow: activeTab !== 'create' ? 4 : 'none',
              },
            }}
          >
            Create Menu
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                lastModifiedBy: user?.id || '',
                lastModifiedAt: CURRENT_DATE,
              });
            }}
            startIcon={<EditIcon />}
            color="warning"
            fullWidth
            sx={{
              borderRadius: '8px',
              py: 1.5,
              transition: 'all 0.3s',
              '&:hover': {
                transform: activeTab !== 'update' ? 'translateY(-3px)' : 'none',
                boxShadow: activeTab !== 'update' ? 4 : 'none',
              },
            }}
          >
            Update Menu
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                lastModifiedBy: user?.id || '',
                lastModifiedAt: CURRENT_DATE,
              });
            }}
            startIcon={<DeleteIcon />}
            color="error"
            fullWidth
            sx={{
              borderRadius: '8px',
              py: 1.5,
              transition: 'all 0.3s',
              '&:hover': {
                transform: activeTab !== 'delete' ? 'translateY(-3px)' : 'none',
                boxShadow: activeTab !== 'delete' ? 4 : 'none',
              },
            }}
          >
            Delete Menu
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  const FormHeaderSection = () => {
    const headerText = activeTab === 'create' 
      ? 'Create New Menu' 
      : activeTab === 'update' 
        ? 'Update Existing Menu' 
        : 'Delete Menu';
    
    const headerIcon = activeTab === 'create' 
      ? <AddIcon fontSize="large" /> 
      : activeTab === 'update' 
        ? <EditIcon fontSize="large" /> 
        : <DeleteIcon fontSize="large" />;
    
    const headerColor = activeTab === 'create' 
      ? theme.palette.success.main 
      : activeTab === 'update' 
        ? theme.palette.warning.main 
        : theme.palette.error.main;
        
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        mb={3}
        sx={{ 
          animation: `${slideIn} 0.5s ease-out`,
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(headerColor, 0.1)
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: headerColor,
            color: '#fff',
            mr: 2,
            p: 1,
            width: 56,
            height: 56
          }}
        >
          {headerIcon}
        </Avatar>
        <Typography variant="h5" fontWeight="bold" color={headerColor}>
          {headerText}
        </Typography>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, pb: 5 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      
      <Paper 
        elevation={5} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.7)})`,
          animation: `${fadeIn} 0.5s ease-out`,
        }}
      >
        <Box display="flex" alignItems="center">
          <RestaurantIcon 
            sx={{ 
              fontSize: 40, 
              mr: 2, 
              color: '#fff',
              animation: `${spin} 5s linear infinite`,
            }} 
          />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
            Menu Management
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            icon={<TodayIcon />}
            label={CURRENT_DATE}
            variant="filled"
            sx={{ 
              bgcolor: alpha('#fff', 0.2), 
              color: '#fff',
              '& .MuiChip-icon': { color: '#fff' }
            }}
          />
          <Tooltip title="Refresh Menus">
            <IconButton 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              sx={{ 
                bgcolor: alpha('#fff', 0.2), 
                color: '#fff',
                '&:hover': { bgcolor: alpha('#fff', 0.3) } 
              }}
            >
              <RefreshIcon sx={{ 
                animation: isRefreshing ? `${spin} 1s linear infinite` : 'none'
              }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <ActionButtons />

      <Box sx={{ animation: `${fadeIn} 0.7s ease-out` }}>
        {activeTab === 'view' && (
          <>
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : menus.length > 0 ? (
              renderMenuCards()
            ) : (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 6, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  borderRadius: 2,
                  animation: `${bounceIn} 0.7s`
                }}
              >
                <RestaurantIcon fontSize="large" color="disabled" sx={{ fontSize: 80, mb: 2 }} />
                <Typography align="center" variant="h6" color="textSecondary" gutterBottom>
                  No menus found
                </Typography>
                <Typography align="center" color="textSecondary" sx={{ mb: 3 }}>
                  Use the 'Create Menu' tab to add delicious meals for the week
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => setActiveTab('create')}
                  sx={{ 
                    animation: `${pulse} 2s infinite ease-in-out`,
                    borderRadius: 8,
                    px: 3,
                    py: 1
                  }}
                >
                  Create Your First Menu
                </Button>
              </Paper>
            )}
          </>
        )}

        {(activeTab === 'create' || activeTab === 'update' || activeTab === 'delete') && (
          <Paper 
            elevation={4}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              animation: `${fadeIn} 0.5s ease-out`,
            }}
          >
            <Box sx={{ p: 3 }}>
              <FormHeaderSection />
              
              <form onSubmit={activeTab === 'create' ? handleCreate : activeTab === 'update' ? handleUpdate : handleDelete}>
                <FormControl 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  required
                  sx={{ 
                    animation: `${slideIn} 0.6s ease-out`,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                >
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
                      <MenuItem key={day.value} value={day.value}>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              fontSize: '0.8rem',
                              bgcolor: getDayColor(day.value),
                              mr: 1
                            }}
                          >
                            {day.label.charAt(0)}
                          </Avatar>
                          {day.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {(activeTab !== 'delete' && (formData.day || activeTab === 'create')) && (
                  <Box 
                    sx={{ 
                      mt: 3,
                      display: 'grid',
                      gap: 3,
                      animation: `${slideIn} 0.7s ease-out`,
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                        <BreakfastIcon />
                      </Avatar>
                      <TextField
                        label="Breakfast"
                        variant="outlined"
                        fullWidth
                        name="breakfast"
                        value={formData.breakfast}
                        onChange={handleChange}
                        required
                        multiline
                        rows={2}
                        placeholder="e.g. Bread, Butter, Jam, Eggs, Tea, Coffee"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                        <LunchIcon />
                      </Avatar>
                      <TextField
                        label="Lunch"
                        variant="outlined"
                        fullWidth
                        name="lunch"
                        value={formData.lunch}
                        onChange={handleChange}
                        required
                        multiline
                        rows={2}
                        placeholder="e.g. Rice, Dal, Paneer Curry, Chapati, Salad"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                        <SnacksIcon />
                      </Avatar>
                      <TextField
                        label="Snacks"
                        variant="outlined"
                        fullWidth
                        name="snacks"
                        value={formData.snacks}
                        onChange={handleChange}
                        required
                        multiline
                        rows={2}
                        placeholder="e.g. Samosa, Tea, Biscuits"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main }}>
                        <DinnerIcon />
                      </Avatar>
                      <TextField
                        label="Dinner"
                        variant="outlined"
                        fullWidth
                        name="dinner"
                        value={formData.dinner}
                        onChange={handleChange}
                        required
                        multiline
                        rows={2}
                        placeholder="e.g. Chapati, Mixed Vegetable, Curd, Sweet"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}

                <Box 
                  mt={4}
                  sx={{ animation: `${slideIn} 0.8s ease-out` }}
                >
                  <Button
                    variant="contained"
                    color={activeTab === 'create' ? 'success' : activeTab === 'update' ? 'warning' : 'error'}
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={loading}
                    startIcon={activeTab === 'create' ? <AddIcon /> : activeTab === 'update' ? <SaveIcon /> : <DeleteIcon />}
                    sx={{
                      height: 56,
                      position: 'relative',
                      borderRadius: 2,
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: 6
                      }
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
            </Box>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ animation: `${bounceIn} 0.5s` }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: 4
          }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Backdrop 
        sx={{ 
          color: '#fff', 
          zIndex: theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)'
        }} 
        open={loading}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            color="inherit" 
            size={60}
            sx={{ mb: 2 }}
          />
          <Typography variant="h6" sx={{ animation: `${pulse} 2s infinite ease-in-out` }}>
            {activeTab === 'create' ? 'Creating Menu...' : activeTab === 'update' ? 'Updating Menu...' : activeTab==='view'? 'Detecting Menu...' : 'Deleting Menu...'}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default MenuManager;