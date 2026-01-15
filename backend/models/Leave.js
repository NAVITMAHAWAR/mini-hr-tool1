const mongoose = require("mongoose");
const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Support both 'Personal' and legacy 'Casual' values
  type: { type: String, enum: ["Vacation", "Sick", "Personal", "Casual"] },
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  appliedDate: Date,
  reason: String,
});
module.exports = mongoose.model("Leave", leaveSchema);
