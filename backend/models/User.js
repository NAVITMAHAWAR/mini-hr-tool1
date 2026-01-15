const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
  dateOfJoining: Date,
  leaveBalance: { type: Number, default: 20 },
});
module.exports = mongoose.model("User", userSchema);
