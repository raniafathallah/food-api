const express = require('express');
const {
  registerUser,
  authUser,
  getUsers,
  deleteUser,
  getUserById,
} = require('../controllers/userController.js');

const { protect, admin } = require('../middleware/authMiddleware.js');
const router = express.Router();
router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById);

module.exports = router;