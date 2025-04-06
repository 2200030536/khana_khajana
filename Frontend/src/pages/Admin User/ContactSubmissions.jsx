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
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Alert
} from '@mui/material';
import {
  DeleteOutline,
  MailOutline,
  Visibility,
  Search
} from '@mui/icons-material';
import { format } from 'date-fns';
import axiosInstance from '../../axiosConfig';

const ContactSubmissions = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axiosInstance.get('/api/contacts', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          status: statusFilter || undefined
        },
        withCredentials: true
      });
      
      setContacts(response.data.contacts);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contact submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load contacts on initial render and when pagination/filters change
  useEffect(() => {
    fetchContacts();
  }, [page, rowsPerPage, statusFilter]);
  
  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Open details dialog
  const handleOpenDetails = (contact) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
    
    // If contact is unread, mark it as read
    if (contact.status === 'unread') {
      handleUpdateStatus(contact._id, 'read');
    }
  };
  
  // Update status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/api/contacts/${id}/status`, { status: newStatus }, {
        withCredentials: true
      });
      
      // Update local state
      setContacts(contacts.map(contact => 
        contact._id === id ? { ...contact, status: newStatus } : contact
      ));
      
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status. Please try again.');
    }
  };
  
  // Delete contact
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/api/contacts/${id}`, {
        withCredentials: true
      });
      
      // Update local state
      setContacts(contacts.filter(contact => contact._id !== id));
      
      if (selectedContact && selectedContact._id === id) {
        setViewDialogOpen(false);
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact. Please try again.');
    }
  };
  
  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'error';
      case 'read': return 'primary';
      case 'responded': return 'success';
      default: return 'default';
    }
  };
  
  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Contact Submissions
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <Box display="flex" justifyContent="space-between" mb={3}>
        {/* Filter controls */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="responded">Responded</MenuItem>
          </Select>
        </FormControl>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchContacts} 
          startIcon={<Search />}
        >
          Refresh
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={2}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Message Preview</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      No contact submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map(contact => (
                    <TableRow key={contact._id} hover>
                      <TableCell 
                        sx={{ 
                          fontWeight: contact.status === 'unread' ? 'bold' : 'normal'
                        }}
                      >
                        {contact.name}
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>
                        {contact.message.length > 50 
                          ? `${contact.message.substring(0, 50)}...` 
                          : contact.message}
                      </TableCell>
                      <TableCell>
                        {format(new Date(contact.createdAt), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={contact.status} 
                          color={getStatusColor(contact.status)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDetails(contact)}
                          title="View details"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => handleDeleteContact(contact._id)}
                          title="Delete"
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
      
      {/* View details dialog */}
      {selectedContact && (
        <Dialog 
          open={viewDialogOpen} 
          onClose={() => setViewDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Contact from {selectedContact.name}
            <Chip 
              size="small" 
              label={selectedContact.status} 
              color={getStatusColor(selectedContact.status)}
              sx={{ ml: 2 }}
            />
          </DialogTitle>
          <DialogContent dividers>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">
                <a href={`mailto:${selectedContact.email}`} style={{ color: '#1976d2' }}>
                  {selectedContact.email}
                </a>
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Date
              </Typography>
              <Typography variant="body1">
                {format(new Date(selectedContact.createdAt), 'MMM dd, yyyy HH:mm:ss')}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Message
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: '#f9f9f9' }}>
                <Typography 
                  variant="body1" 
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {selectedContact.message}
                </Typography>
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={() => handleUpdateStatus(selectedContact._id, 'read')}
              color="primary"
              disabled={selectedContact.status !== 'unread'}
            >
              Mark as Read
            </Button>
            <Button 
              onClick={() => handleUpdateStatus(selectedContact._id, 'responded')}
              color="success"
              disabled={selectedContact.status === 'responded'}
              startIcon={<MailOutline />}
            >
              Mark as Responded
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ContactSubmissions;