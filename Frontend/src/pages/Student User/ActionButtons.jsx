import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActionButtons = () => {
  const navigate = useNavigate();

  const handleBrowsePlans = () => {
    navigate('/meals-plans');
  };

  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        justifyContent: "flex-end",
        gap: 2
      }}
    >
      <Button
        variant="contained"
        onClick={handleBrowsePlans}
        sx={{
          bgcolor: "#2196f3",
          color: "#fff",
          px: 3,
          py: 1,
          borderRadius: 2,
          fontWeight: 500,
          boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "#1976d2",
            transform: "translateY(-3px)",
            boxShadow: "0 6px 15px rgba(33, 150, 243, 0.4)",
          }
        }}
      >
        Browse Plans
      </Button>
    </Box>
  );
};

export default ActionButtons;