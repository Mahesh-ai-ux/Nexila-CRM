require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const run = async () => {
  await connectDB(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const user = new User({
    name: 'Admin',
    email,
    password,
    role: 'admin'
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  console.log('Admin created:', email);
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
