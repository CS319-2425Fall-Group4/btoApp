const express = require("express");
const sequelize = require("./config/database");
const schoolRoutes = require("./routes/schoolRoutes");
const { School, Visitor, Student, Visit, TimeSlot } = require("./models"); // Import models and relationships

const app = express();
app.use(express.json());
app.use("/api/school", schoolRoutes);

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
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
