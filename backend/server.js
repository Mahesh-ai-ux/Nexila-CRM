require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');





const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// async function createAdmin() {
//   const adminEmail = process.env.ADMIN_EMAIL;
//   const adminPassword = process.env.ADMIN_PASSWORD;

//   const existingAdmin = await User.findOne({ email: adminEmail });
//   if (existingAdmin) {
//     console.log('✅ Admin already exists');
//     return;
//   }

//   const hashedPassword = await bcrypt.hash(adminPassword, 10);
//   await User.create({
//     name: 'Admin',
//     email: adminEmail,
//     password: hashedPassword,
//     role: 'admin',
//   });

//   console.log('🚀 Admin user created successfully');
// }

// // after connectDB()
// connectDB(process.env.MONGO_URI).then(createAdmin);

connectDB(process.env.MONGO_URI);


app.use(cors({
  origin: ["http://3.16.128.134", "http://localhost:5173"],
  //origin: 'http://localhost:5173', // your Vite frontend
  credentials: true
}));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/leadstatus', require('./routes/leadstatus'));
app.use("/api/deals", require("./routes/deals"));
app.use("/api/students", require("./routes/student"));

app.get('/', (req, res) => res.send('Leads backend running'));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} - server.js:63`);
  console.log('Mongo URI: - server.js:64', process.env.MONGO_URI);
});;

