import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { styled } from '@mui/system';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledContainer = styled(Container)`
  text-align: center;
  margin-top: 50px;
  animation: ${fadeIn} 1s ease-in-out;
`;

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-top: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Home = () => {
  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h2" gutterBottom className="typography">
        Welcome to Khana Khajana
      </Typography>
      <Typography variant="h5" gutterBottom className="typography">
        Join us in our mission to manage daily menus efficiently.
      </Typography>
      <StyledPaper elevation={3} className="paper">
        <Box mt={4} className="button-group">
          <Button
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            component={Link}
            to="/login"
            style={{ marginRight: '10px' }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/signup"
          >
            Sign Up
          </Button>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Home;