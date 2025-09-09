import StudentUser from "../schemas/StudentUser.js";
import Admin from "../schemas/Admin.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/APIresponse.js";
import MessUser from "../schemas/MessUser.js";
import StudentTransaction from "../schemas/StudentTransaction.js";
import DailyMenu from "../schemas/DailyMenu.js";

// Create a new admin from request
export const addAdmin = asyncHandler(async (req, res) => {
  const { name, id, email, password } = req.body;

  if (!name || !id || !email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(false, "Missing required fields"));
  }

  // Check for existing admin by id or email
  const existingById = await Admin.findOne({ id });
  if (existingById) {
    return res.status(409).json(new ApiResponse(false, "User ID already used"));
  }
  const existingByEmail = await Admin.findOne({ email });
  if (existingByEmail) {
    return res.status(409).json(new ApiResponse(false, "Email already used"));
  }

  const newAdmin = await Admin.create({ name, id, email, password });

  return res
    .status(201)
    .json(
      new ApiResponse(true, "Admin created successfully", { admin: newAdmin })
    );
});

//create add new mess user function
export const addMessUser = asyncHandler(async (req, res) => {
  const { name, id, email, password } = req.body;
  if (!name || !id || !email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(false, "Missing required fields"));
  }
  const existingById = await StudentUser.findOne({ id });
  if (existingById) {
    return res.status(409).json(new ApiResponse(false, "User ID already used"));
  }
  const existingByEmail = await StudentUser.findOne({ email });
  if (existingByEmail) {
    return res.status(409).json(new ApiResponse(false, "Email already used"));
  }

  const newMessUser = await MessUser.create({ name, id, email, password });
  if (!newMessUser) {
    return res
      .status(500)
      .json(new ApiResponse(false, "Failed to create mess user"));
  }

  return res.status(201).json(
    new ApiResponse(true, "Mess user created successfully", {
      user: newMessUser,
    })
  );
});

// ---------- Admin read APIs (lists, counts, details) ----------

// Get paginated list of students. Query params: page, limit, q (search by name/email/id)
export const getAllStudents = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = Math.max(parseInt(req.query.limit || "50"), 1);
  const q = (req.query.q || "").trim();

  const filter = {};
  if (q) {
    // search by name, email or id (numeric)
    const idQuery = Number(q);
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
    if (!Number.isNaN(idQuery)) filter.$or.push({ id: idQuery });
  }

  const total = await StudentUser.countDocuments(filter);
  const students = await StudentUser.find(filter)
    .select("-password -__v")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ name: 1 });

  return res.status(200).json(
    new ApiResponse(true, "Students fetched", {
      students,
      total,
      page,
      limit,
    })
  );
});

// Get paginated list of mess users. Query params: page, limit, q
export const getAllMessUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = Math.max(parseInt(req.query.limit || "50"), 1);
  const q = (req.query.q || "").trim();

  const filter = {};
  if (q) {
    const idQuery = Number(q);
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
    if (!Number.isNaN(idQuery)) filter.$or.push({ id: idQuery });
  }

  const total = await MessUser.countDocuments(filter);
  const users = await MessUser.find(filter)
    .select("-password -__v")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ name: 1 });

  return res
    .status(200)
    .json(
      new ApiResponse(true, "Mess users fetched", { users, total, page, limit })
    );
});

// Get high-level counts and basic analytics for admin dashboard
export const getCounts = asyncHandler(async (req, res) => {
  const totalStudents = await StudentUser.countDocuments();
  const totalMessUsers = await MessUser.countDocuments();
  const totalMenus = await DailyMenu.countDocuments();
  // subscriptions: consider 'active' or 'completed' transactions as subscriptions
  const activeSubscriptions = await StudentTransaction.countDocuments({
    status: { $in: ["active", "completed"] },
  });

  return res.status(200).json(
    new ApiResponse(true, "Counts fetched", {
      totalStudents,
      totalMessUsers,
      totalMenus,
      activeSubscriptions,
    })
  );
});

// Get subscriptions (transactions). Supports studentId, page, limit, status filter
export const getTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = Math.max(parseInt(req.query.limit || "50"), 1);
  const { status, studentId } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (studentId) filter.studentId = Number(studentId);

  const total = await StudentTransaction.countDocuments(filter);
  const transactions = await StudentTransaction.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return res.status(200).json(
    new ApiResponse(true, "Transactions fetched", {
      transactions,
      total,
      page,
      limit,
    })
  );
});

// Get subscriptions grouped by student (summary). Optional limit for top N students by active subscriptions
export const getSubscriptionsByStudent = asyncHandler(async (req, res) => {
  const top = Math.max(parseInt(req.query.top || "0"), 0);

  const pipeline = [
    { $match: { status: { $in: ["active", "completed"] } } },
    { $group: { _id: "$studentId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ];
  if (top > 0) pipeline.push({ $limit: top });

  const summary = await StudentTransaction.aggregate(pipeline);

  return res
    .status(200)
    .json(new ApiResponse(true, "Subscriptions summary fetched", { summary }));
});

// Get student details with latest subscription
export const getStudentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json(new ApiResponse(false, "Missing student id"));

  const student = await StudentUser.findOne({ id: Number(id) }).select(
    "-password -__v"
  );
  if (!student)
    return res.status(404).json(new ApiResponse(false, "Student not found"));

  const latestTransaction = await StudentTransaction.findOne({
    studentId: Number(id),
  })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(true, "Student details fetched", {
      student,
      latestTransaction,
    })
  );
});

// Menus: list and fetch by day
export const getAllMenus = asyncHandler(async (req, res) => {
  const menus = await DailyMenu.find().sort({ createdAt: -1 }).lean();
  return res
    .status(200)
    .json(new ApiResponse(true, "Menus fetched", { menus }));
});

export const getMenuByDay = asyncHandler(async (req, res) => {
  const { day } = req.params; // expects 'Monday', '2025-09-01' or similar depending on how day is used
  if (!day)
    return res
      .status(400)
      .json(new ApiResponse(false, "Missing day parameter"));

  const menu = await DailyMenu.findOne({ day }).lean();
  if (!menu)
    return res
      .status(404)
      .json(new ApiResponse(false, "Menu not found for the given day"));

  return res.status(200).json(new ApiResponse(true, "Menu fetched", { menu }));
});
