import StudentUser from '../schemas/StudentUser.js';
import StudentTransaction from '../schemas/StudentTransaction.js';

export const studentTransaction = async (req, res, next) => {
    const { id } = req.params;
    try {
        const latestTransaction = await StudentTransaction.findOne({ studentId: id })
            .sort({ createdAt: -1 }); // Sort by creation date in descending order to get the latest
        if (!latestTransaction) {
            return res.status(201).json({ data: 'No transactions' });
        }
        res.status(200).json({ data: latestTransaction });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};