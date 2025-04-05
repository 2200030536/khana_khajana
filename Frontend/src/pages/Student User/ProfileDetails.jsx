import React, { useState } from "react";
import { 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Button, 
  Divider, 
  Avatar, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from "@mui/icons-material";
import axiosInstance from "../../axiosConfig";

const ProfileDetails = ({ user }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOpenEditDialog = () => {
    setEditedUser({
      name: user.name,
      email: user.email,
      department: user.department || "",
      password: "",
      confirmPassword: ""
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleUpdateProfile = async () => {
    // Validate form
    if (!editedUser.name || !editedUser.email) {
      setError("Name and email are required.");
      return;
    }

    if (editedUser.password && editedUser.password !== editedUser.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    // Remove confirmPassword as it's not needed for the backend
    const dataToSend = { ...editedUser };
    delete dataToSend.confirmPassword;
    
    // Don't send empty password to backend
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = user.userType === "studentUser" 
        ? `/students/${user.id}` 
        : `/messUsers/${user.id}`;
      
      await axiosInstance.put(endpoint, dataToSend);
      
      // Update the local profile data by forcing a page reload
      // In a real application, you might want to update the user state directly
      setSuccess("Profile updated successfully!");
      setOpenEditDialog(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          User profile not available
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          borderTop: "4px solid #f57c00",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography
            variant="h4"
            sx={{
              color: "#f57c00",
              fontWeight: 600,
            }}
          >
            Profile Details
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<EditIcon />}
            sx={{ borderRadius: 2 }}
            onClick={handleOpenEditDialog}
          >
            Edit Profile
          </Button>
        </Box>
        
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: "#f57c00",
              fontSize: "2rem",
              mr: 3
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              {user.userType === "studentUser" ? "Student" : "Mess User"}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Full Name
              </Typography>
              <Typography variant="h6">{user.name}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email Address
              </Typography>
              <Typography variant="h6">{user.email}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                User Type
              </Typography>
              <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                {user.userType === "studentUser" ? "Student" : "Mess User"}
              </Typography>
            </Box>
          </Grid>
          
          {user.id && (
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ID Number
                </Typography>
                <Typography variant="h6">{user.id}</Typography>
              </Box>
            </Grid>
          )}
          
          {user.department && (
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Department
                </Typography>
                <Typography variant="h6">{user.department}</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {/* Edit Profile Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: "#f57c00", 
          color: "#fff",
          fontSize: "1.25rem",
          fontWeight: "bold"
        }}>
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={editedUser.name || ""}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={editedUser.email || ""}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            {user.userType === "studentUser" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={editedUser.department || ""}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Change Password (optional)
                </Typography>
              </Divider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type="password"
                value={editedUser.password || ""}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={editedUser.confirmPassword || ""}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseEditDialog}
            startIcon={<CloseIcon />}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateProfile}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
      >
        <Alert 
          onClose={() => setSuccess("")} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileDetails;