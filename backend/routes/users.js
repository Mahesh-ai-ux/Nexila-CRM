const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

const User = require("../models/User"); // ✅ Make sure the path is correct
const bcrypt = require("bcrypt");


// All user management endpoints require admin
router.post(
  '/',
  auth,
  requireRole('admin'),
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['admin','employee'])
  ],
  userController.createUser
);

router.get('/', auth, requireRole('admin'), userController.listUsers);

router.delete('/:id', auth, requireRole('admin'), userController.deleteUser);


// ➕ Add employee API
router.post("/add-employee", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new employee
    const newEmployee = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "employee", // default to employee
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("❌ Error adding employee: - users.js:61", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// ✅ Get all users (for dropdowns)
router.get('/list', auth, async (req, res) => {
  try {
    const users = await User.find({}, 'name role');
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching users: - users.js:72', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get only active users for dropdowns
router.get('/active-list', auth, async (req, res) => {
  try {
    const users = await User.find(
      { isActive: true },
      'name role'
    );

    res.status(200).json(users);

  } catch (error) {
    console.error('Error fetching active users: - users.js:90', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;