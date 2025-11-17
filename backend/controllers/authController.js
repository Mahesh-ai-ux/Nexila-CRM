const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

// ✅ REGISTER (admin can create employees, or open signup)
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Default role = 'employee'
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'employee'
    });

    await user.save();

    // ✅ Include role in payload (important for future auth checks)
    const payload = { userId: user._id, role: user.role };

    // ✅ Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).send('Server error');
  }
};

// ✅ LOGIN (works for both admin and employee)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // 3️⃣ Include role in token payload
    const payload = { userId: user._id, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    // 4️⃣ Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // <- This tells frontend who logged in
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).send('Server error');
  }
};
