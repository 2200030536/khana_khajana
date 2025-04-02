import React from "react";
import { Paper, Typography, Grid, Box } from "@mui/material";

const ProfileDetails = ({ user }) => {
  return (
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
      <Typography
        variant="h4"
        sx={{
          color: "#f57c00",
          fontWeight: 600,
          mb: 3,
        }}
      >
        Profile Details
      </Typography>
      
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
              {user.userType}
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
      </Grid>
    </Paper>
  );
};

export default ProfileDetails;