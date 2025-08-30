import express from 'express';
import Contact from '../schemas/Contact.js';
import { authenticateToken } from '../utils/jwtUtils.js';

const router = express.Router();

// Authentication middleware for admin routes
const authenticateAdmin = async (req, res, next) => {
  if (!req.user || req.user.userType !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admin access required' });
  }
  next();
};

// Submit a new contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    
    // Create new contact submission with IP and user agent if available
    const newContact = new Contact({
      name,
      email,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    await newContact.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to send your message. Please try again later.' });
  }
});

// Get all contact submissions (admin only)
router.get('/', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    const query = {};
    if (status) {
      query.status = status;
    }
    
    // Get total count for pagination
    const totalCount = await Contact.countDocuments(query);
    
    // Get contacts with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 }) // Latest first
      .skip(skip)
      .limit(parseInt(limit));
    
    res.status(200).json({
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

// Get a single contact by ID (admin only)
router.get('/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact details' });
  }
});

// Update contact status (admin only)
router.patch('/:id/status', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['unread', 'read', 'responded'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ error: 'Failed to update contact status' });
  }
});

// Delete a contact (admin only)
router.delete('/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

export default router;