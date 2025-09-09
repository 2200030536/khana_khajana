import express from "express";
import Admin from "../schemas/Admin.js";
import {
  addAdmin,
  addMessUser,
  getAllStudents,
  getAllMessUsers,
  getCounts,
  getTransactions,
  getSubscriptionsByStudent,
  getStudentDetails,
  getAllMenus,
  getMenuByDay,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin management (legacy/simple handlers kept for backwards compatibility)
router.post("/signup", addAdmin);
router.post("/", addAdmin);
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email, password });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const updatedAdmin = await Admin.findOneAndUpdate(
      { id: req.params.id },
      { name, password, email },
      { new: true, runValidators: true }
    );
    if (!updatedAdmin)
      return res.status(404).json({ error: "Admin not found" });
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deletedAdmin = await Admin.findOneAndDelete({ id: req.params.id });
    if (!deletedAdmin)
      return res.status(404).json({ error: "Admin not found" });
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin dashboard APIs
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentDetails);
router.get("/mess-users", getAllMessUsers);
router.get("/counts", getCounts);
router.get("/transactions", getTransactions);
router.get("/subscriptions/summary", getSubscriptionsByStudent);
router.get("/menus", getAllMenus);
router.get("/menus/:day", getMenuByDay);

// Create mess user (admin action)
router.post("/mess-users", addMessUser);

export default router;
