import React from 'react';
import { 
  Container, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Signup = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: isMobile ? '20px' : 0
      }}
    >
      <Paper 
        elevation={10} 
        sx={{ 
          padding: '40px',
          width: '100%',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 5
          }}
        >
          <Avatar 
            sx={{ 
              m: 1, 
              bgcolor: 'primary.main',
              width: 64,
              height: 64
            }}
          >
            <PersonAddIcon fontSize="large" />
          </Avatar>
          <Typography 
            variant="h4" 
            fontWeight="600" 
            sx={{ 
              color: 'primary.main',
              mt: 2,
              fontFamily: '"Poppins", sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Signup
          </Typography>
          <Divider 
            sx={{ 
              width: '50px', 
              height: '4px', 
              backgroundColor: 'primary.main',
              mt: 1,
              mb: 3,
              borderRadius: '2px'
            }} 
          />
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="textSecondary" 
            sx={{ mb: 3 }}
          >
            Choose your account type to get started
          </Typography>
        </Box>

        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/student-signup"
            fullWidth
            size="large"
            startIcon={<SchoolIcon />}
            sx={{
              borderRadius: '10px',
              padding: '14px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 20px rgba(25, 118, 210, 0.4)',
              },
            }}
          >
            Student Signup
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/messuser-signup"
            fullWidth
            size="large"
            startIcon={<RestaurantIcon />}
            sx={{
              borderRadius: '10px',
              padding: '14px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 20px rgba(25, 118, 210, 0.4)',
              },
            }}
          >
            Mess User Signup
          </Button>
        </Box>
        
        <Box 
          mt={4} 
          display="flex" 
          justifyContent="center"
        >
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <Typography 
              component={Link} 
              to="/login"
              color="primary" 
              sx={{ 
                fontWeight: 'bold',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Log in
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;