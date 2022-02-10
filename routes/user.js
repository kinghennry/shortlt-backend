const router = require("express").Router();

//import controllers
const {
  updateUser,
  deleteUser,
  getSingleUser,
  getUsers,
  userStats,
} = require("../controllers/user");

// import middleware
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

router.get("/:id", verifyTokenAndAuthorization, getSingleUser);
router.get("/", verifyTokenAndAdmin, getUsers);
router.get("/all/stats", verifyTokenAndAdmin, userStats);
router.put("/:id", verifyTokenAndAuthorization, updateUser);
router.delete("/:id", verifyTokenAndAuthorization, deleteUser);

module.exports = router;
// Host:
// smtp.mailtrap.io
// Port:
// 25 or 465 or 587 or 2525
// Username:
// deffc032edab31
// Password:
// fb6ec3b76063c3
// Auth:
// PLAIN, LOGIN and CRAM-MD5
// TLS:
// Optional (STARTTLS on all ports)
