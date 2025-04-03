import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  GetApp as DownloadIcon,
  DateRange as DateRangeIcon,
  Receipt as ReceiptIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import axiosInstance from "../../axiosConfig";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCompletedTransactions, setTotalCompletedTransactions] =
    useState(0);

  // Format date from ISO string
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get("/transactions");
        const fetchedTransactions = response.data;

        // Process the data
        const processedTransactions = fetchedTransactions.map((transaction) => {
          // Lookup student details if available
          // For now, we'll just use the ID
          return {
            id: transaction._id,
            transactionId: transaction.transactionId || transaction._id,
            studentId: transaction.studentId,
            studentName: `Student ${transaction.studentId}`, // Ideally fetch the name from student data
            planType: transaction.planType,
            amount: transaction.amount,
            status: transaction.paymentStatus,
            paymentMethod: transaction.paymentMethod,
            meals: `${transaction.breakfast ? "🍳 " : ""}${
              transaction.lunch ? "🍲 " : ""
            }${transaction.dinner ? "🍽️ " : ""}`,
            startDate: transaction.startDate,
            endDate: transaction.endDate,
            createdAt: transaction.createdAt,
            subscriptionStatus: transaction.status,
          };
        });

        setTransactions(processedTransactions);

        // Calculate total amount and completed transactions
        const completed = processedTransactions.filter(
          (t) => t.status === "completed"
        );
        const total = completed.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );
        setTotalAmount(total);
        setTotalCompletedTransactions(completed.length);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filters
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  // Filter transactions based on search and filter
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.studentName &&
        transaction.studentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (transaction.studentId &&
        transaction.studentId.toString().includes(searchTerm)) ||
      (transaction.transactionId &&
        transaction.transactionId.toString().includes(searchTerm));

    const matchesFilter =
      filterStatus === "all" || transaction.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Get chip color based on status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "refunded":
        return "info";
      default:
        return "default";
    }
  };

  // Export transactions to CSV
  const exportToCSV = () => {
    const headers = [
      "Transaction ID",
      "Student ID",
      "Plan Type",
      "Amount",
      "Date",
      "Status",
    ];
    const csvData = filteredTransactions.map((t) => [
      t.transactionId,
      t.studentId,
      t.planType,
      t.amount,
      formatDate(t.createdAt),
      t.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  return (
    <Box>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Transaction History
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Total Transactions
              </Typography>
              <Typography variant="h4">
                {loading ? <CircularProgress size={24} /> : transactions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Total Revenue
              </Typography>
              <Typography variant="h4">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  `₹${totalAmount.toLocaleString()}`
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Completed Transactions
              </Typography>
              <Typography variant="h4">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  totalCompletedTransactions
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setError(null)}
            >
              ×
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          mb={3}
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <TextField
            placeholder="Search by ID, student..."
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
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={handleFilterChange}
                label="Payment Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Export to CSV">
              <IconButton onClick={exportToCSV}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Loading State */}
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Transaction Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Transaction ID
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Student</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Plan Type</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Meals</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Amount</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Date</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Payment</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">Status</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography color="text.secondary" py={3}>
                          No transactions found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((transaction) => (
                        <TableRow key={transaction.id} hover>
                          <TableCell>
                            <Tooltip title="View Details">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <ReceiptIcon
                                  sx={{
                                    fontSize: 16,
                                    mr: 1,
                                    color: "primary.main",
                                  }}
                                />
                                {transaction.transactionId
                                  .toString()
                                  .substring(0, 8)}
                                ...
                              </Box>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {transaction.studentName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                ID: {transaction.studentId}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.planType}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={`${
                                transaction.breakfast ? "Breakfast " : ""
                              }${transaction.lunch ? "Lunch " : ""}${
                                transaction.dinner ? "Dinner" : ""
                              }`}
                            >
                              <Typography>{transaction.meals}</Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>₹{transaction.amount}</TableCell>
                          <TableCell>
                            <Tooltip
                              title={`${formatDate(
                                transaction.startDate
                              )} to ${formatDate(transaction.endDate)}`}
                            >
                              <Typography variant="body2">
                                {formatDate(transaction.createdAt)}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.paymentMethod}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.status}
                              color={getStatusColor(transaction.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredTransactions.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default TransactionHistory;
