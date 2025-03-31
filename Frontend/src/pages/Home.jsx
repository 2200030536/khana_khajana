import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  Grid
} from '@mui/material';
import Navbar from '../components/Navbar';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Home = () => {
  return (
    <>
    <Navbar/>
    <Container maxWidth="lg" sx={{ py: 8, zIndex: 10, position: 'relative' }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              backgroundColor: '#ffffff'
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 2
                }}
              >
                Welcome to Khana Khajana
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ mb: 4 }}
              >
                Join us in our mission to manage daily menus efficiently.
              </Typography>
              
              <Box 
                sx={{ 
                  width: '40px', 
                  height: '3px', 
                  backgroundColor: 'primary.main',
                  mx: 'auto',
                  mb: 4
                }}
              />
            </Box>
            
            <Box 
              display="flex" 
              justifyContent="center" 
              flexWrap="wrap"
              gap={2}
              mt={4}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                component={Link}
                to="/login"
                size="large"
                sx={{
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Login
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PersonAddIcon />}
                component={Link}
                to="/signup"
                size="large"
                sx={{
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </>
  );
};

export default Home;