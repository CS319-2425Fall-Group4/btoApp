const { Schedule, Guide, TourApplication, Visitor, School } = require('../models');
const { Op } = require('sequelize');

const calendarController = {
  // Fetch schedules based on role and filters
  async getSchedules(req, res) {
    const { role, id } = req.user; // User's role and ID
    const { date, status } = req.query; // Query parameters

    const whereClause = {};

    // Apply role-based filtering
    if (role === 'GUIDE') {
      whereClause.guide_id = id;
    }

    // Use Op for date filtering
    if (date) {
      whereClause.scheduled_date = {
        [Op.eq]: date, // Matches the exact date
      };
    }

    // Use Op for status filtering
    if (status) {
      whereClause.status = {
        [Op.in]: status.split(','), // Allows filtering by multiple statuses (comma-separated)
      };
    }

    try {
        const schedules = await Schedule.findAll({
        where: whereClause,
        include: [
        { 
            model: Guide },
        { 
            model: TourApplication, 
            include: [{ model: Visitor }, //alias is centralised in models/index.js
            { model: School }, //alias is centralised in models/index.js
        
            ],
          },
         ],
        });
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = calendarController;
