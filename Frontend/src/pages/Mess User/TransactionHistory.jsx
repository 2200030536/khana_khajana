import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as DownloadIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import axiosInstance from '../../axiosConfig';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // In a real app, we'd fetch from API
        // const response = await axiosInstance.get('/transactions');
        
        // For now, use sample data
        const sampleTransactions = Array.from({ length: 30 }, (_, i) => ({
          id: `TR${10000 + i}`,
          studentId: `ST${20000 + Math.floor(Math.random() * 100)}`,
          studentName: `Student ${i + 1}`,
          planType: ['Daily', 'Weekly', 'Monthly'][Math.floor(Math.random() * 3)],
          amount: Math.floor(Math.random() * 3000) + 500,
          date: new Date(2025, 3, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
          status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)]
        }));
        
        setTransactions(sampleTransactions);
        
        // Calculate total amount
        const total = sampleTransactions
          .filter(t => t.status === 'Completed')
          .reduce((sum, transaction) => sum + transaction.amount, 0);
        setTotalAmount(total);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      transaction.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Transaction History
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h4">
                {transactions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                ₹{totalAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Completed Transactions
              </Typography>
              <Typography variant="h4">
                {transactions.filter(t => t.status === 'Completed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box mb={3} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <TextField
            placeholder="Search by ID, student name..."
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Box display="flex" gap={2}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
            
            <IconButton>
              <DownloadIcon />
            </IconButton>
          </Box>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle2">Transaction ID</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Student</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Plan Type</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Amount</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Date</Typography></TableCell>
                <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{transaction.studentName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.studentId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{transaction.planType}</TableCell>
                    <TableCell>₹{transaction.amount}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.status} 
                        color={getStatusColor(transaction.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredTransactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default TransactionHistory;