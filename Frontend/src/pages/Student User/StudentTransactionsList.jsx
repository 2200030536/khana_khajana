import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Toolbar,
  Tooltip,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axiosInstance from '../../axiosConfig';
import { format } from 'date-fns';
// Status color helpers
const statusColor = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'expired': return 'default';
    case 'canceled': return 'error';
    default: return 'default';
  }
};

const paymentColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'pending': return 'warning';
    case 'failed': return 'error';
    case 'refunded': return 'info';
    default: return 'default';
  }
};

const planLabel = (planType) => {
  if (!planType) return '-';
  return planType.charAt(0).toUpperCase() + planType.slice(1);
};

const StudentTransactionsList = () => {
  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastLoaded, setLastLoaded] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      // Always fetch current user (session-based) like ProfilePage does
      const profileRes = await axiosInstance.get('/auth/profile');
      const currentUser = profileRes.data?.user;
      setUser(currentUser);
      if (!currentUser?.id) throw new Error('User id missing');

      // Use new history endpoint for this student
      const historyRes = await axiosInstance.get(`/transactions/student/${currentUser.id}/history`);
      const list = Array.isArray(historyRes.data) ? historyRes.data : [];
      setRows(list);
      setLastLoaded(new Date());
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const totalSpent = useMemo(() => rows.reduce((sum, r) => sum + (r.amount || 0), 0), [rows]);

  if (!loading && !user) {
    return <Alert severity="info">Please log in to view your transactions.</Alert>;
  }

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>Meal Plan Transactions</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {lastLoaded && (
              <Typography variant="caption" color="text.secondary">
                Loaded {format(lastLoaded, 'PPpp')}
              </Typography>
            )}
            <Tooltip title="Refresh">
              <span>
                <IconButton onClick={fetchTransactions} disabled={loading} size="small" color="primary">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Toolbar>
        <Divider sx={{ my: 1 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Chip label={`Total Transactions: ${rows.length}`} color="primary" variant="outlined" />
          <Chip label={`Total Spent: ₹${totalSpent}`} color="secondary" variant="outlined" />
          {rows[0] && (
            <Chip label={`Latest Plan: ${planLabel(rows[0].planType)}`} />
          )}
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && rows.length === 0 && !error && (
        <Alert severity="info">No transactions found yet.</Alert>
      )}

      {!loading && rows.length > 0 && (
        <TableContainer component={Paper} elevation={2}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Meals</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Amount (₹)</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Token</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r => {
                const start = r.startDate ? format(new Date(r.startDate), 'dd MMM') : '-';
                const end = r.endDate ? format(new Date(r.endDate), 'dd MMM') : '-';
                const created = r.createdAt ? format(new Date(r.createdAt), 'dd MMM yyyy') : '-';
                const meals = ['breakfast','lunch','dinner']
                  .filter(k => r[k])
                  .map(k => k[0].toUpperCase())
                  .join('');
                return (
                  <TableRow key={r.transactionId || r.uniqueToken} hover>
                    <TableCell>{created}</TableCell>
                    <TableCell>{planLabel(r.planType)}</TableCell>
                    <TableCell>{meals || '-'}</TableCell>
                    <TableCell>{start} - {end}</TableCell>
                    <TableCell>{r.amount}</TableCell>
                    <TableCell>
                      <Chip size="small" label={r.paymentStatus} color={paymentColor(r.paymentStatus)} />
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={r.status} color={statusColor(r.status)} variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={r.uniqueToken}>
                        <Typography variant="caption" sx={{ maxWidth: 90, display:'inline-block', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                          {r.uniqueToken}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StudentTransactionsList;