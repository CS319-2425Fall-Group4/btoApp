const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Auto-schedule pending tours
router.post('/auto-schedule', scheduleController.scheduleTours);

// Approve schedule
router.put('/:id/approve', scheduleController.approveSchedule);

// Reschedule tour
router.put('/:id/reschedule', scheduleController.rescheduleTour);

// Mark tour as completed
router.put('/:id/complete', scheduleController.completeTour);

module.exports = router; 