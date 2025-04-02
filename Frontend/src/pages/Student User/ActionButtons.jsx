import React from 'react';
import { Box, Button } from '@mui/material';

const ActionButtons = () => {
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