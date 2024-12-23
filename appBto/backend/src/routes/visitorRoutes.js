const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// Create a new visitor
router.post('/', visitorController.createVisitor);

// Get all visitors
router.get('/', visitorController.getAllVisitors);

// Get visitor by ID
router.get('/:id', visitorController.getVisitorById);

module.exports = router;