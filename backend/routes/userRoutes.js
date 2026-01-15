const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  getLeaveBalance,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.get("/user/balance",auth,getLeaveBalance )

module.exports = router;
