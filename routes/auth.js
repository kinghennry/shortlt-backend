const router = require("express").Router();

const { isResetTokenValid } = require("../middlewares/user");

//import controllers
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", isResetTokenValid, resetPassword);

module.exports = router;
