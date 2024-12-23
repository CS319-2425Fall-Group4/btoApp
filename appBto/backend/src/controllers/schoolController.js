const { School } = require('../models');

const schoolController = {
  // Get all schools
  async getAllSchools(req, res) {
    try {
      const schools = await School.findAll();
      res.json(schools);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new school
  async createSchool(req, res) {
    try {
      const school = await School.create(req.body);
      res.status(201).json(school);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update school info
  async updateSchoolInfo(req, res) {
    try {
      const { id } = req.params;
      const { name, city } = req.body;
      
      const school = await School.findByPk(id);
      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }

      await school.update({ name, city });
      res.json(school);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update school priority
  async updateSchoolPriority(req, res) {
    try {
      const { id } = req.params;
      const { priority } = req.body;

      const school = await School.findByPk(id);
      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }

      await school.update({ priority });
      res.json(school);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get school analytics
  async getSchoolAnalytics(req, res) {
    try {
      const { id } = req.params;
      const school = await School.findByPk(id, {
        include: [{
          model: Visit,
          attributes: ['visit_date', 'status'],
          include: [{
            model: TimeSlot,
            attributes: ['slot_time']
          }]
        }]
      });

      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }

      // Calculate analytics
      const analytics = {
        totalVisits: school.Visits.length,
        completedVisits: school.Visits.filter(v => v.status === 'COMPLETED').length,
        cancelledVisits: school.Visits.filter(v => v.status === 'CANCELLED').length,
        // Add more analytics as needed
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Manage school feedback
  async manageSchoolFeedback(req, res) {
    try {
      const { id } = req.params;
      const { feedback } = req.body;

      const school = await School.findByPk(id);
      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }

      // Store feedback logic here
      // This will be implemented when we add the Feedback model

      res.json({ message: 'Feedback recorded successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = schoolController;
