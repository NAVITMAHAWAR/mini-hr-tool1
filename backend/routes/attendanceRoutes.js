const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
} = require("../controllers/attendanceController");
const auth = require("../middleware/auth");

router.post("/mark", auth, markAttendance);
router.get("/my-attendance", auth, getMyAttendance);
router.get("/all-attendance", auth, getAllAttendance);

module.exports = router;
