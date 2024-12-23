// backend/src/routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { authMiddleware } = require('../middleware/auth');

// GET /api/calendar
// Returns scheduled tours, possibly filtered by user role, date, or status
router.get('/', authMiddleware, calendarController.getSchedules);

module.exports = router;
