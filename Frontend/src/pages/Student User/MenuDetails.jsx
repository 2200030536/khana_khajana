import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const MenuDisplay = ({ menus, showWeeklyMenu, setShowWeeklyMenu, currentDayMenu }) => {
  const getDayName = (day) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Specials",
    ];
    return days[day - 1] || "Invalid day";
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 3,
        background: "linear-gradient(to bottom, #fff8e1, #ffe0b2)",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
        }
      }}
    >
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        mb: 2 
      }}>
        <Typography
          variant="h5"
          sx={{
            color: "#f57c00",
            fontWeight: 600,
          }}
        >
          {showWeeklyMenu ? "Weekly Menu" : "Today's Menu"}
        </Typography>
        
        <Button
          variant="outlined"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={() => setShowWeeklyMenu(!showWeeklyMenu)}
          sx={{ 
            color: "#f57c00",
            borderColor: "#f57c00",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#e65100",
              backgroundColor: "rgba(245, 124, 0, 0.04)",
              transform: "translateX(3px)",
            }
          }}
        >
          {showWeeklyMenu ? "View Today's Menu" : "View Weekly Menu"}
        </Button>
      </Box>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          borderRadius: 1.5,
          overflow: "hidden"
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#f57c00" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Day
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Breakfast
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Lunch
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Snacks
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Dinner
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showWeeklyMenu ? (
              menus.length > 0 ? (
                menus.map((menu) => (
                  <TableRow 
                    key={menu.day}
                    sx={{ 
                      "&:nth-of-type(odd)": { backgroundColor: "rgba(255, 248, 225, 0.5)" },
                      transition: "all 0.2s",
                      "&:hover": { backgroundColor: "rgba(255, 224, 178, 0.5)" }
                    }}
                  >
                    <TableCell><strong>{getDayName(menu.day)}</strong></TableCell>
                    <TableCell>{menu.breakfast}</TableCell>
                    <TableCell>{menu.lunch}</TableCell>
                    <TableCell>{menu.snacks}</TableCell>
                    <TableCell>{menu.dinner}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">No menu data available</Typography>
                  </TableCell>
                </TableRow>
              )
            ) : currentDayMenu ? (
              <TableRow>
                <TableCell><strong>{getDayName(currentDayMenu.day)}</strong></TableCell>
                <TableCell>{currentDayMenu.breakfast}</TableCell>
                <TableCell>{currentDayMenu.lunch}</TableCell>
                <TableCell>{currentDayMenu.snacks}</TableCell>
                <TableCell>{currentDayMenu.dinner}</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">No menu available for today</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MenuDisplay;