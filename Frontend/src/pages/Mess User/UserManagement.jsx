import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon
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
    id: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Modified to fetch actual users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch both student and mess users and combine them - using correct API paths
      const [studentsResponse, messUsersResponse] = await Promise.all([
        axiosInstance.get('/students'),
        axiosInstance.get('/messUsers')
      ]);
      
      const studentUsers = studentsResponse.data.map(user => ({
        ...user,
        userType: 'studentUser'
      }));
      
      const messUsers = messUsersResponse.data.map(user => ({
        ...user,
        userType: 'messUser'
      }));
      
      // Combine both user types
      const allUsers = [...studentUsers, ...messUsers];
      setUsers(allUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. ' + (error.response?.data?.error || error.message));
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

  // Updated to add user to the correct backend endpoint
  const handleAddUser = async () => {
    try {
      // Validation
      const requiredFields = ['name', 'email', 'password', 'id'];
      if (formData.userType === 'studentUser') requiredFields.push('department');
      
      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        setError(`Please fill all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      setLoading(true);
      setError('');
      
      // Determine which API endpoint to use based on user type - using correct API paths
      const endpoint = formData.userType === 'studentUser' ? '/students' : '/messUsers';
      
      // Create payload based on user type
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        id: formData.id
      };
      
      // Add department field for student users
      if (formData.userType === 'studentUser') {
        payload.department = formData.department;
      }
      
      const response = await axiosInstance.post(endpoint, payload);
      
      // Add the user type to the response data
      const newUser = {
        ...response.data,
        userType: formData.userType
      };
      
      setUsers([...users, newUser]);
      setOpenAddDialog(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        userType: 'studentUser',
        id: '',
        department: '',
      });
      setSuccess('User added successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user. ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  // Updated to delete user from the correct backend endpoint
  const handleRevokeUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Determine which API endpoint to use based on user type - using correct API paths
      const endpoint = selectedUser.userType === 'studentUser' 
        ? `/students/${selectedUser.id}` 
        : `/messUsers/${selectedUser.id}`;
      
      await axiosInstance.delete(endpoint);
      
      const updatedUsers = users.filter(user => !(user.id === selectedUser.id && user.userType === selectedUser.userType));
      setUsers(updatedUsers);
      setOpenRevokeDialog(false);
      setSelectedUser(null);
      setSuccess('User removed successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error removing user:', error);
      setError('Failed to remove user. ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  // Rest of filtering logic remains the same
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
        {/* Existing tabs code */}
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
        
        {/* Existing search bar code */}
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
        
        {/* User list - remains mostly the same */}
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : filteredUsersByType.length > 0 ? (
          <List>
            {filteredUsersByType.map((user) => (
              <React.Fragment key={`${user.userType}-${user.id}`}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">{user.name}</Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {user.email} {user.id && `(ID: ${user.id})`}
                        </Typography>
                        {user.department && (
                          <Typography variant="body2" color="text.secondary">
                            Department: {user.department}
                          </Typography>
                        )}
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

      {/* Modified Add User Dialog with additional fields */}
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
                name="id"
                label="User ID"
                value={formData.id}
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
            
            {/* Conditional field for Student Users */}
            {formData.userType === 'studentUser' && (
              <Grid item xs={12}>
                <TextField
                  name="department"
                  label="Department"
                  value={formData.department}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
              </Grid>
            )}
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

      {/* Revoke User Dialog - mostly the same */}
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