const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { authMiddleware } = require('../middleware/auth');

// Fetch schedules dynamically based on user role and filters
router.get('/', authMiddleware, calendarController.getSchedules);

module.exports = router;
