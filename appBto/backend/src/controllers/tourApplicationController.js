const { TourApplication, Visitor, School } = require('../models');
const { generateConfirmationCode } = require('../utils/helpers');

const tourApplicationController = {
  // Create new tour application
  async createApplication(req, res) {
    try {
      const { applicant_id, institution_id, preferred_dates } = req.body;

      // Validate dates
      const validDates = preferred_dates.every(date => {
        const preferredDate = new Date(date);
        const today = new Date();
        return preferredDate > today;
      });

      if (!validDates) {
        return res.status(400).json({ 
          message: 'Preferred dates must be in the future' 
        });
      }

      // Check for existing pending applications
      const existingApplication = await TourApplication.findOne({
        where: {
          applicant_id,
          status: 'PENDING'
        }
      });

      if (existingApplication) {
        return res.status(400).json({ 
          message: 'You already have a pending application' 
        });
      }

      const confirmation_code = generateConfirmationCode();
      const application = await TourApplication.create({
        applicant_id,
        institution_id,
        confirmation_code,
        preferred_dates,
        status: 'PENDING'
      });

      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get application by confirmation code
  async getByConfirmationCode(req, res) {
    try {
      const { code } = req.params;
      
      const application = await TourApplication.findOne({
        where: { confirmation_code: code },
        include: [
          { model: Visitor },
          { model: School }
        ]
      });

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      res.json(application);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update application
  async updateApplication(req, res) {
    try {
      const { code } = req.params;
      const { preferred_dates, status } = req.body;

      const application = await TourApplication.findOne({
        where: { confirmation_code: code }
      });

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      // Don't allow changes if already scheduled/cancelled
      if (application.status !== 'PENDING') {
        return res.status(400).json({ 
          message: 'Cannot modify application that is already scheduled or cancelled' 
        });
      }

      await application.update({
        preferred_dates,
        status
      });

      res.json(application);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Cancel application
  async cancelApplication(req, res) {
    try {
      const { code } = req.params;
      const { reason } = req.body;

      const application = await TourApplication.findOne({
        where: { confirmation_code: code }
      });

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      // Don't allow cancellation of already cancelled applications
      if (application.status === 'CANCELLED') {
        return res.status(400).json({ message: 'Application is already cancelled' });
      }

      await application.update({
        status: 'CANCELLED',
        cancellation_reason: reason
      });

      // TODO: Send cancellation email

      res.json({ message: 'Application cancelled successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // List all applications with filters
  async listApplications(req, res) {
    try {
      const { status, date_from, date_to } = req.query;

      const where = {};
      if (status) {
        where.status = status;
      }

      if (date_from || date_to) {
        where.preferred_dates = {
          [Op.overlap]: [new Date(date_from), new Date(date_to)]
        };
      }

      const applications = await TourApplication.findAll({
        where,
        include: [
          { model: Visitor },
          { model: School }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = tourApplicationController; 