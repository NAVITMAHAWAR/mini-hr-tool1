const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeave,
  approveLeave,
} = require("../controllers/leaveController");
const auth = require("../middleware/auth");

router.post("/apply", auth, applyLeave);
router.get("/my-leaves", auth, getMyLeaves);
router.get("/all", auth, getAllLeaves);
router.put("/update/:id", auth, updateLeave);
router.put("/approve/:id", auth, approveLeave);

module.exports = router;
