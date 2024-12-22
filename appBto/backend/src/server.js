const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const schoolRoutes = require("./routes/schoolRoutes");
const { School, Visitor, Student, Visit, TimeSlot } = require("./models");
const visitorRoutes = require('./routes/visitorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const tourApplicationRoutes = require('./routes/tourApplicationRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Only start the server if we're not in test mode
if (process.env.NODE_ENV !== 'test') {
  // Test database connection and sync models
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection successful...");
      return sequelize.sync({ alter: true });
    })
    .then(() => {
      console.log("Database synced!");
    })
    .catch((err) => {
      console.error("Database connection failed:", err);
    });

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
