import express from 'express';
import StudentUser from '../schemas/StudentUser.js';

const router = express.Router();

// Create a new StudentUser
router.post('/signup', async (req, res) => {
  try {
    const { name, id, department, password, email } = req.body;
    const newStudent = new StudentUser({ name, id, department, password, email });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new StudentUser
router.post('/', async (req, res) => {
    try {
      const { name, id, department, password, email } = req.body;
      const newStudent = new StudentUser({ name, id, department, password, email });
      await newStudent.save();
      res.status(201).json(newStudent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Get all StudentUsers
router.get('/', async (req, res) => {
  try {
    const students = await StudentUser.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login StudentUser
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await StudentUser.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an existing StudentUser
router.put('/:id', async (req, res) => {
  try {
    const { name, department, password, email } = req.body;
    const updatedStudent = await StudentUser.findOneAndUpdate(
      { id: req.params.id },
      { name, department, password, email },
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: 'StudentUser not found' });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an existing StudentUser
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await StudentUser.findOneAndDelete({ id: req.params.id });
    if (!deletedStudent) {
      return res.status(404).json({ error: 'StudentUser not found' });
    }
    res.status(200).json({ message: 'StudentUser deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;