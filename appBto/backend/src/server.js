const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const schoolRoutes = require("./routes/schoolRoutes");
const { School, Visitor, Student, Visit, TimeSlot, User } = require("./models");
const visitorRoutes = require('./routes/visitorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const tourApplicationRoutes = require('./routes/tourApplicationRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const authRoutes = require('./routes/authRoutes');
const initializeDatabase = require('./config/init-db');


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
app.use('/api/calendar', calendarRoutes);
app.use('/api/auth', authRoutes);

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
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection successful...");
      return sequelize.sync({ force: true });
    })
    .then(async () => {
      console.log("Database synced!");
      try {
        const users = await User.bulkCreate([
          {
            email: 'test@bilkent.edu.tr',
            password: 'password123',
            role: 'GUIDE'
          },
          {
            email: 'admin@bilkent.edu.tr',
            password: 'admin123',
            role: 'ADMINISTRATOR'
          },
          {
            email: 'coordinator@bilkent.edu.tr',
            password: 'coord123',
            role: 'COORDINATOR'
          }
        ]);
        console.log('Initial users created:', users);
      } catch (error) {
        console.error('Error creating initial users:', error);
      }
    })
    .catch((err) => {
      console.error("Database connection failed:", err);
    });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await sequelize.query('SELECT * FROM "user"');
    res.json(result[0]);
  } catch (error) {
    console.error('Database Test Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/test-user", async (req, res) => {
  try {
    const { User } = require('./models');
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('User Test Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/test-users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'password', 'role'],
      raw: true
    });
    console.log('All users in database:', users);
    res.json(users);
  } catch (error) {
    console.error('User Test Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/test-create-users", async (req, res) => {
  try {
    const users = await User.bulkCreate([
      {
        email: 'test@bilkent.edu.tr',
        password: 'password123',
        role: 'GUIDE'
      },
      {
        email: 'admin@bilkent.edu.tr',
        password: 'admin123',
        role: 'ADMINISTRATOR'
      },
      {
        email: 'coordinator@bilkent.edu.tr',
        password: 'coord123',
        role: 'COORDINATOR'
      }
    ]);
    console.log('Created test users:', users);
    res.json(users);
  } catch (error) {
    console.error('Create Users Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/test-db-users", async (req, res) => {
  try {
    const result = await sequelize.query('SELECT * FROM "user"', {
      type: sequelize.QueryTypes.SELECT
    });
    console.log('Direct DB query result:', result);
    res.json(result);
  } catch (error) {
    console.error('DB Test Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
