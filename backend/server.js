require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const hackathonInterestRoutes = require("./routes/hackathonInterestRoutes");
const {
    verifyMailTransporter,
} = require("./services/hackathonEmailServiceFree");

const paymentRoutes = require("./routes/paymentRoutes");


const app = express();
app.use(cors());
// app.use(express.json());
app.use(
  express.json({
    verify: (req, res, buffer) => {
      req.rawBody = Buffer.from(buffer);
    },
  })
);

const PORT = process.env.PORT || 5000;



connectDB(process.env.MONGO_URI);


app.use(cors({
  origin: ["https://crm.nexilatechnologies.com",'https://www.nexilatechnologies.com'],
  //origin: 'http://localhost:5173', // your Vite frontend
  credentials: true
}));
verifyMailTransporter();
// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/leadstatus', require('./routes/leadstatus'));
app.use("/api/deals", require("./routes/deals"));
app.use("/api/students", require("./routes/student"));

app.use("/api/hackathon", require("./routes/hackathon"));
app.use("/api/payments", paymentRoutes);
app.use(
  "/api/hackathon-interest",
  hackathonInterestRoutes
);

app.use("/api/webhooks/meta", require("./routes/metaWebhook"))

app.get('/', (req, res) => res.send('Leads backend running'));
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} - server.js:59`);
  console.log('Mongo URI: - server.js:60', process.env.MONGO_URI);
});;