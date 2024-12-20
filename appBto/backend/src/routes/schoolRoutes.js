const express = require("express");
const router = express.Router();
const schoolController = require('../controllers/schoolController');

// Get all schools
router.get("/", schoolController.getAllSchools);

// Create new school
router.post("/", schoolController.createSchool);

// Update school info
router.put("/:id/info", schoolController.updateSchoolInfo);

// Update school priority
router.put("/:id/priority", schoolController.updateSchoolPriority);

// Get school analytics
router.get("/:id/analytics", schoolController.getSchoolAnalytics);

// Manage school feedback
router.post("/:id/feedback", schoolController.manageSchoolFeedback);

module.exports = router;
