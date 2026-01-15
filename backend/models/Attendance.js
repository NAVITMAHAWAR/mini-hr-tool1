const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: Date,
  status: { type: String, enum: ["Present", "Absent"] },
});
module.exports = mongoose.model("Attendance", attendanceSchema);
