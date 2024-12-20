const express = require('express');
const router = express.Router();
const tourApplicationController = require('../controllers/tourApplicationController');

// Create new application
router.post('/', tourApplicationController.createApplication);

// Get application by confirmation code
router.get('/code/:code', tourApplicationController.getByConfirmationCode);

// Update application
router.put('/code/:code', tourApplicationController.updateApplication);

// Cancel application
router.post('/code/:code/cancel', tourApplicationController.cancelApplication);

// List all applications with filters
router.get('/', tourApplicationController.listApplications);

module.exports = router; 