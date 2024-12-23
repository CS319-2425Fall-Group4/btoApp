const { Schedule, Guide, TourApplication, Visitor, School } = require('../models');
const { Op } = require('sequelize');

const calendarController = {
  // Fetch schedules based on role and filters
  async getSchedules(req, res) {
    const { role, id } = req.user; // User's role and ID
    const { date, status } = req.query; // Query parameters

    console.log('User Role:', role); // Log role
    console.log('User ID:', id); // Log user ID
    console.log('Query Parameters:', { date, status }); // Log query parameters

    const whereClause = {};

    // Apply role-based filtering
    if (role === 'GUIDE') {
      whereClause.guide_id = id;
      console.log('Guide-specific filtering applied:', whereClause); // Log filter
    }

    // Use Op for date filtering
    if (date) {
      whereClause.scheduled_date = {
        [Op.eq]: date, // Matches the exact date
      };
      console.log('Date-specific filtering applied:', whereClause.scheduled_date); // Log filter
    }

    // Use Op for status filtering
    if (status) {
      whereClause.status = {
        [Op.in]: status.split(','), // Allows filtering by multiple statuses (comma-separated)
      };
      console.log('Status-specific filtering applied:', whereClause.status); // Log filter
    }

    try {
        console.log('Fetching schedules...');
        const schedules = await Schedule.findAll({
        where: whereClause, 
        include: [
        { 
            model: Guide },
        { 
            model: TourApplication, 
            include: [{
              model: Visitor,
              as: 'applicant'
            }, 
            { model: School,
              as: 'institution'
            }, 
        
            ],
          },
         ],
        });
        console.log('Schedules fetched:', schedules); // Log fetched schedules
      res.json(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = calendarController;
