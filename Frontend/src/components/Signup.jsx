import React from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/student-signup"
          fullWidth
          style={{ marginBottom: '10px' }}
        >
          Student Signup
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/messuser-signup"
          fullWidth
        >
          Mess User Signup
        </Button>
      </Box>
    </Container>
  );
};

export default Signup;