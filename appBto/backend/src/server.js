const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables
const sequelize = require("./config/database");
const schoolRoutes = require("./routes/schoolRoutes");
const { School, Visitor, Student, Visit, TimeSlot } = require("./models"); // Import models and relationships
const visitorRoutes = require('./routes/visitorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const tourApplicationRoutes = require('./routes/tourApplicationRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON requests

// Routes
app.use("/api/school", schoolRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tour-applications', tourApplicationRoutes);
app.use('/api/schedules', scheduleRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("Server is running and healthy!");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Test database connection and sync models
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful...");
    return sequelize.sync({ alter: true }); // Use `force: true` only in development
  })
  .then(() => {
    console.log("Database synced!");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable for PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
