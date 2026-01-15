const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Present", "Absent"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be Present or Absent" });
    }

    // Prevent duplicate marks for the same calendar day by checking range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    if (existing) return res.status(400).send({ error: "Already marked" });

    const attendance = new Attendance({
      userId: req.user._id,
      date: new Date(), // save full timestamp so admin can see time
      status,
    });
    await attendance.save();
    res.status(201).send({ message: "Attendance marked" });
  } catch (e) {
    res.status(400).send({ error: "Failed to mark" });
  }
};

exports.getMyAttendance = async (req, res) => {
  const attendance = await Attendance.find({ userId: req.user._id }).populate(
    "userId",
    "name email"
  );
  res.send(attendance);
};

exports.getAllAttendance = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).send({ error: "Access denied" });
  const attendance = await Attendance.find({}).populate("userId", "name email");
  res.send(attendance);
};
