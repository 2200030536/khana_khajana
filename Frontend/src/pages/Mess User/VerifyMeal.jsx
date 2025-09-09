import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Stack, Alert, Chip, Divider, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axiosInstance from '../../axiosConfig';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/* Placeholder for QR scanning: In production integrate a camera scanner library like html5-qrcode */

const mealTypes = ['breakfast','lunch','snacks','dinner'];

const VerifyMeal = () => {
  const [inputToken, setInputToken] = useState('');
  const [studentId, setStudentId] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [status, setStatus] = useState(null); // {success:boolean,message:string,data?}
  const [loading, setLoading] = useState(false);
  const [scanDialog, setScanDialog] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const payload = { mealType };
      if (inputToken.trim()) payload.token = inputToken.trim();
      if (!payload.token && studentId.trim()) payload.studentId = Number(studentId.trim());
      const res = await axiosInstance.post('/meals/verify/verify', payload);
      setStatus({ success: true, message: res.data.message, data: res.data });
      setInputToken('');
    } catch (e) {
      setStatus({ success: false, message: e.response?.data?.error || e.message });
    } finally {
      setLoading(false);
    }
  };

  const currentDaily = status?.data?.daily;

  return (
    <Box sx={{ p:2, maxWidth: 720, mx:'auto' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>Meal Verification</Typography>
      <Paper sx={{ p:3, mb:3 }} elevation={3}>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Scan a QR (studentId + token) or manually enter a token or student ID then choose the meal to verify.
          </Typography>
          <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
            <TextField label="Token" value={inputToken} fullWidth onChange={e=>setInputToken(e.target.value)} placeholder="Unique token from QR" />
            <TextField label="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} type="number" fullWidth />
            <TextField select label="Meal" value={mealType} onChange={e=>setMealType(e.target.value)} sx={{ minWidth:140 }}>
              {mealTypes.map(m=> <MenuItem key={m} value={m}>{m}</MenuItem> )}
            </TextField>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<QrCodeScannerIcon />} onClick={()=>setScanDialog(true)} disabled>Scan QR (Coming Soon)</Button>
            <Button variant="contained" color="success" onClick={handleVerify} disabled={loading || (!inputToken && !studentId)}>
              {loading ? 'Verifying...' : 'Verify & Record'}
            </Button>
          </Stack>
          {status && (
            <Alert severity={status.success ? 'success':'error'} icon={status.success ? <CheckCircleIcon /> : <ErrorOutlineIcon />}> {status.message} </Alert>
          )}
        </Stack>
      </Paper>

      {currentDaily && (
        <Paper sx={{ p:3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>Today Consumption ({currentDaily.date})</Typography>
          <Divider sx={{ mb:2 }} />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {mealTypes.map(m => (
              <Chip key={m} label={`${m}: ${currentDaily[m] ? 'Yes':'No'}`} color={currentDaily[m] ? 'success':'default'} variant={currentDaily[m] ? 'filled':'outlined'} />
            ))}
          </Stack>
        </Paper>
      )}

      <Dialog open={scanDialog} onClose={()=>setScanDialog(false)}>
        <DialogTitle>QR Scanner (Placeholder)</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Integrate a real-time webcam scanner here (e.g., html5-qrcode).</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setScanDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VerifyMeal;