import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';
import { QRCodeCanvas } from 'qrcode.react';
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
  const [firstTransactionPrompt, setFirstTransactionPrompt] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrData, setQrData] = useState(null);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      // Always fetch current user (session-based) like ProfilePage does
      const profileRes = await axiosInstance.get('/auth/profile');
      const currentUser = profileRes.data?.user;
      setUser(currentUser);
      // Prefer numeric student identifier if it exists (student users have numeric 'id' field in schema separate from _id)
      const numericStudentId = typeof currentUser?.id === 'number' ? currentUser.id : currentUser?.studentId;
      if (!numericStudentId) {
        // No numeric id means user likely hasn't been fully provisioned for transactions yet
        setFirstTransactionPrompt(true);
        setRows([]);
        setLastLoaded(new Date());
        return;
      }

      // Use new history endpoint for this student (numeric id)
      const historyRes = await axiosInstance.get(`/transactions/student/${numericStudentId}/history`);
      const list = Array.isArray(historyRes.data) ? historyRes.data : [];
      setRows(list);
      setLastLoaded(new Date());
  // Persist numeric id for QR payload usage
  setUser(prev => prev ? { ...prev, numericStudentId } : prev);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const totalSpent = useMemo(() => rows.reduce((sum, r) => sum + (r.amount || 0), 0), [rows]);

  const isExpired = (tx) => {
    if (!tx) return false;
    if (tx.status === 'expired') return true;
    if (tx.endDate) {
      try {
        return new Date(tx.endDate) < new Date();
      } catch { return false; }
    }
    return false;
  };

  const openQr = (transaction) => {
    if (!user) return;
    if (isExpired(transaction)) return; // Block QR for expired transactions
    const now = new Date();
    const payload = {
      userId: user.numericStudentId ?? user.id ?? user._id,
      token: transaction.uniqueToken,
      transactionId: transaction.transactionId,
      issuedAt: now.toISOString(),
      issuedAtLocal: now.toLocaleString()
    };
    setQrData(payload);
    setQrOpen(true);
  };

  const closeQr = () => {
    setQrOpen(false);
    setQrData(null);
  };

  if (!loading && !user) {
    return <Alert severity="info">Please log in to view your transactions.</Alert>;
  }

  const renderFirstTransactionPrompt = () => (
    <Paper elevation={2} sx={{ p:3, textAlign:'center' }}>
      <Typography variant="h6" gutterBottom>No Transactions Yet</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb:2 }}>
        You haven't made your first meal plan purchase. Start by browsing available plans.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/meals-plans')}>
        Browse Meal Plans
      </Button>
    </Paper>
  );

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

      {!loading && firstTransactionPrompt && renderFirstTransactionPrompt()}
      {!loading && !firstTransactionPrompt && rows.length === 0 && !error && (
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
                <TableCell align="center"><QrCode2Icon fontSize="small" /></TableCell>
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
                    <TableCell align="center">
                      {isExpired(r) ? (
                        <Tooltip title="Expired - QR unavailable">
                          <span>
                            <IconButton size="small" disabled>
                              <VisibilityIcon fontSize="inherit" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Show QR">
                          <span>
                            <IconButton size="small" onClick={() => openQr(r)}>
                              <VisibilityIcon fontSize="inherit" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={qrOpen} onClose={closeQr} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          Transaction QR
          <IconButton onClick={closeQr} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign:'center' }}>
          {qrData && (
            <>
              <QRCodeCanvas value={JSON.stringify(qrData)} size={220} includeMargin level="M" />
              <Box sx={{ mt:2 }}>
                <Typography variant="body2" color="text.secondary">User: {qrData.userId}</Typography>
                <Typography variant="body2" color="text.secondary">Token: {qrData.token?.slice(0,10)}...</Typography>
                <Typography variant="body2" color="text.secondary">Issued: {qrData.issuedAtLocal}</Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQr}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentTransactionsList;