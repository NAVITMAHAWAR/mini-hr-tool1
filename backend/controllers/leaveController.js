const Leave = require("../models/Leave");
const User = require("../models/User");

exports.applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    // Allowed types define karo
    // Accept 'Casual' as well to support older records or alternate naming
    const allowedTypes = ["Vacation", "Sick", "Personal", "Casual"]; // "Vacation" for Paid, "Personal"/"Casual" for Casual
    if (!allowedTypes.includes(type)) {
      return res.status(400).send({ error: "Invalid leave type" });
    }

    // Date validation
    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .send({ error: "Start date cannot be after end date" });
    }

    const totalDays =
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      ) + 1;
    if (totalDays <= 0) {
      return res.status(400).send({ error: "Invalid date range" });
    }

    const leave = new Leave({
      userId: req.user._id,
      type,
      startDate,
      endDate,
      totalDays,
      appliedDate: new Date(),
      reason,
    });
    await leave.save();
    res.status(201).send({ message: "Leave applied", leave }); // Response mein leave return karo taaki frontend use kare
  } catch (e) {
    console.error("Backend error:", e); // Debug log add karo
    res.status(400).send({ error: e.message || "Failed to apply leave" }); // Detailed error
  }
};
exports.getMyLeaves = async (req, res) => {
  const leaves = await Leave.find({ userId: req.user._id }).populate(
    "userId",
    "name email"
  );
  res.send(leaves);
};

exports.getAllLeaves = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).send({ error: "Access denied" });
  const leaves = await Leave.find().populate("userId", "name email");
  res.send(leaves);
};

exports.updateLeave = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (
    leave.userId.toString() !== req.user._id.toString() ||
    leave.status !== "Pending"
  ) {
    return res.status(403).send({ error: "Cannot update" });
  }
  // Update logic (similar to apply)
  res.send({ message: "Leave updated" });
};

exports.approveLeave = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).send({ error: "Access denied" });
  const leave = await Leave.findById(req.params.id);
  leave.status = req.body.status; // 'Approved' or 'Rejected'
  if (req.body.status === "Approved") {
    const user = await User.findById(leave.userId);
    user.leaveBalance -= leave.totalDays;
    await user.save();
  }
  await leave.save();
  // return updated leave with populated user info
  const updated = await Leave.findById(leave._id).populate(
    "userId",
    "name email"
  );
  res.send({ message: "Leave updated", leave: updated });
};
