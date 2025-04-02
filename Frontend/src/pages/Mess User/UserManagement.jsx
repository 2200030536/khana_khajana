import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Tab,
  Tabs,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import axiosInstance from '../../axiosConfig';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openRevokeDialog, setOpenRevokeDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'studentUser',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In a real app, we would fetch from the API
      // const response = await axiosInstance.get('/users');
      
      // For now, use sample data
      setTimeout(() => {
        const sampleUsers = [
          { id: 1, name: 'John Doe', email: 'john.doe@example.com', userType: 'studentUser' },
          { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', userType: 'studentUser' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com', userType: 'messUser' },
          { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', userType: 'studentUser' },
          { id: 5, name: 'David Brown', email: 'david@example.com', userType: 'messUser' },
        ];
        
        setUsers(sampleUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users.');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      // In a real app, we would send to the API
      // await axiosInstance.post('/users', formData);
      
      // For now, simulate API call
      setTimeout(() => {
        const newUser = {
          id: users.length + 1,
          ...formData,
        };
        
        setUsers([...users, newUser]);
        setOpenAddDialog(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          userType: 'studentUser',
        });
        setSuccess('User added successfully!');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user.');
      setLoading(false);
    }
  };

  const handleRevokeUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      // In a real app, we would send to the API
      // await axiosInstance.delete(`/users/${selectedUser.id}`);
      
      // For now, simulate API call
      setTimeout(() => {
        const updatedUsers = users.filter(user => user.id !== selectedUser.id);
        setUsers(updatedUsers);
        setOpenRevokeDialog(false);
        setSelectedUser(null);
        setSuccess('User removed successfully!');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error removing user:', error);
      setError('Failed to remove user.');
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const filteredUsersByType = filteredUsers.filter(user => {
    if (activeTab === 0) return true; // All users
    if (activeTab === 1) return user.userType === 'studentUser';
    if (activeTab === 2) return user.userType === 'messUser';
    return false;
  });

  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight="bold">
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="All Users" />
            <Tab label="Students" />
            <Tab label="Mess Users" />
          </Tabs>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              bgcolor: "#4caf50",
              "&:hover": { bgcolor: "#388e3c" }
            }}
          >
            Add User
          </Button>
        </Box>
        
        <Box mb={3}>
          <TextField
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : filteredUsersByType.length > 0 ? (
          <List>
            {filteredUsersByType.map((user) => (
              <React.Fragment key={user.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">{user.name}</Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                        <Typography variant="caption" 
                          sx={{ 
                            bgcolor: user.userType === 'studentUser' ? '#e3f2fd' : '#fff8e1',
                            color: user.userType === 'studentUser' ? '#1976d2' : '#f57c00',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block',
                            mt: 0.5
                          }}
                        >
                          {user.userType === 'studentUser' ? 'Student' : 'Mess User'}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => {
                        setSelectedUser(user);
                        setOpenRevokeDialog(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box py={4} textAlign="center">
            <Typography color="text.secondary">
              No users found matching your criteria.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please fill the form below to add a new user to the system.
          </DialogContentText>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>User Type</InputLabel>
                <Select
                  name="userType"
                  value={formData.userType}
                  onChange={handleFormChange}
                  label="User Type"
                >
                  <MenuItem value="studentUser">Student</MenuItem>
                  <MenuItem value="messUser">Mess User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revoke User Dialog */}
      <Dialog open={openRevokeDialog} onClose={() => setOpenRevokeDialog(false)}>
        <DialogTitle>Revoke User Access</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to revoke access for {selectedUser?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRevokeDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRevokeUser} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Revoke Access"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;