const { TourApplication, Visitor, School, TimeSlot } = require('../models');
const { generateConfirmationCode } = require('../utils/helpers'); // We'll create this

const tourApplicationController = {
  // Create new tour application
  async createApplication(req, res) {
    try {
      const { 
        visitor_id, 
        school_id, 
        preferred_dates,
        type // 'INDIVIDUAL' or 'INSTITUTION'
      } = req.body;

      // Validate dates
      if (!preferred_dates || preferred_dates.length === 0) {
        return res.status(400).json({ message: 'At least one preferred date is required' });
      }

      // For institutions, require 3 dates
      if (type === 'INSTITUTION' && preferred_dates.length !== 3) {
        return res.status(400).json({ message: 'Institutions must provide exactly 3 preferred dates' });
      }

      // Generate unique confirmation code
      const confirmation_code = generateConfirmationCode();

      const application = await TourApplication.create({
        applicant_id: visitor_id,
        institution_id: school_id,
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