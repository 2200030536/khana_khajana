import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Avatar, 
  Divider 
} from '@mui/material';
import { 
  Person as PersonIcon, 
  School as SchoolIcon, 
  Restaurant as RestaurantIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: i => ({ 
    opacity: 1, 
    x: 0,
    transition: { 
      delay: i * 0.2,
      duration: 0.5
    }
  })
};

const Signup = () => {
  return (
    <div>
      <Navbar />
      
      <Container maxWidth="sm">
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          py: 4
        }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%' }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                border: '1px solid #FFF8E1',
                borderTop: '4px solid #F57C00',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#F57C00', 
                    width: 70, 
                    height: 70, 
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(245, 124, 0, 0.4)'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#F57C00' }}>
                  Sign Up
                </Typography>
                
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 3, 
                    bgcolor: '#FFB74D', 
                    borderRadius: 1,
                    my: 1.5
                  }} 
                />
                
                <Typography color="text.secondary" align="center" sx={{ mb: 1 }}>
                  Choose your account type to get started
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <motion.div custom={0} variants={itemVariants}>
                  <Button
                    component={Link}
                    to="/student-signup"
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<SchoolIcon />}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      py: 1.5,
                      bgcolor: '#F57C00',
                      '&:hover': { 
                        bgcolor: '#E65100',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(245, 124, 0, 0.3)'
                      },
                      transition: 'all 0.3s ease',
                      borderRadius: 2,
                      boxShadow: '0 4px 8px rgba(245, 124, 0, 0.2)'
                    }}
                  >
                    Student Signup
                  </Button>
                </motion.div>
                
                <motion.div custom={1} variants={itemVariants}>
                  <Button
                    component={Link}
                    to="/messuser-signup"
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<RestaurantIcon />}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      py: 1.5,
                      bgcolor: '#F57C00',
                      '&:hover': { 
                        bgcolor: '#E65100',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(245, 124, 0, 0.3)'
                      },
                      transition: 'all 0.3s ease',
                      borderRadius: 2,
                      boxShadow: '0 4px 8px rgba(245, 124, 0, 0.2)'
                    }}
                  >
                    Mess User Signup
                  </Button>
                </motion.div>
              </Box>
              
              <Divider sx={{ my: 3, borderColor: '#FFE0B2' }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography color="text.secondary">
                  Already have an account?{' '}
                  <Link to="/login" style={{ 
                    color: '#F57C00', 
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}>
                    Log in
                  </Link>
                </Typography>
              </Box>
            </Paper>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                © 2025 Khana Khajana - Your daily mess companion
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </div>
  );
};

export default Signup;