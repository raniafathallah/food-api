const User = require('../models/userModel');
const generateToken = require('../utils/generateToken.js');
const catchAsync = require('../middleware/errorCatchHandler');


// @desc Register a new user
// @routes POST /api/users
// @access Public
const registerUser = catchAsync(async (req, res) => {
     const { name, email, password, isAdmin } = req.body;

     const userExists = await User.findOne({ email });

     if (userExists) {
          res.status(400);
          throw new Error("User already exists");
     }

     const user = await User.create({
          name,
          email,
          password,
          isAdmin,
          active: true
     });

     if (user) {
          res.status(201).json({
               _id: user._id,
               name: user.name,
               email: user.email,
               isAdmin: user.isAdmin,
               token: generateToken(user._id),
          });
     } else {
          res.status(400);
          throw new Error("Invalid user data");
     }
});


// @desc Auth user & get token
// @routes POST /api/users/login
// @access Public
const authUser = catchAsync(async (req, res) => {
     const { email, password } = req.body;

     const user = await User.findOne({ email });

     if (user && (await user.matchPassword(password))) {
          res.json({
               _id: user._id,
               name: user.name,
               email: user.email,
               isAdmin: user.isAdmin,
               token: generateToken(user._id),
          });
     } else {
          res.status(401);
          throw new Error("Invalid email or password");
     }
});


// @desc Get all users
// @routes GET /api/users
// @access Private/Admin
const getUsers = catchAsync(async (req, res) => {
     let query = User.find({ active: true });

     const doc = await query;

     if (!doc) return next(new AppError('No users', 404));

     res
          .status(200)
          .json({
               status: 'success',
               length: doc.length,
               data: doc
          });
});


// @desc Delete user
// @routes DELETE /api/users/:id
// @access Private/Admin
const deleteUser = catchAsync(async (req, res) => {
     const deleted = await User.findByIdAndUpdate(req.params.id, { active: false });
     console.log(req.user);
     res
          .status(204)
          .json({
               status: 'success',
               data: deleted
          });
});


// @desc Get user by ID
// @routes GET /api/users/:id
// @access Private/Admin
const getUserById = catchAsync(async (req, res) => {
     const user = await User.findById(req.params.id).select("-password");

     if (user) {
          res.json(user);
     } else {
          res.status(404);
          throw new Error("User not found");
     }
});


module.exports =
{
     registerUser,
     authUser,
     getUsers,
     deleteUser,
     getUserById,
};
