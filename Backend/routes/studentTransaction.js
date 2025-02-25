import express from 'express';
import QRCode from 'qrcode';
import StudentTransaction from '../schemas/StudentTransaction.js'; // Ensure correct import

const router = express.Router();

router.post('/generate-qr', async (req, res) => {
  try {
    const { studentId, breakfast, lunch, dinner, startDate, endDate } = req.body;

    console.log('Received Data:', { studentId, breakfast, lunch, dinner, startDate, endDate });

    const newTransaction = new StudentTransaction({
      studentId,
      breakfast,
      lunch,
      dinner,
      startDate,
      endDate
    });

    await newTransaction.save();

    console.log('Transaction Saved:', newTransaction);

    const qrCodeData = await QRCode.toDataURL(newTransaction.uniqueToken);

    res.status(201).json({
      message: 'Transaction created and QR code generated',
      qrCodeData
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/view-qr/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const transaction = await StudentTransaction.findOne({ studentId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const qrCodeData = await QRCode.toDataURL(transaction.uniqueToken);

    res.status(200).json({
      message: 'QR code retrieved',
      qrCodeData
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;