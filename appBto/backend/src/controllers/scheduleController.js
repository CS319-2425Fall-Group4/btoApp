const { Schedule, TourApplication, Guide, School } = require('../models');
const { Op } = require('sequelize');

const scheduleController = {
  // Automatically schedule tours based on priority
  async scheduleTours(req, res) {
    try {
      // Get pending applications ordered by school priority
      const pendingApplications = await TourApplication.findAll({
        where: { status: 'PENDING' },
        include: [{
          model: School,
          attributes: ['priority']
        }],
        order: [
          [{ model: School }, 'priority', 'DESC'],
          ['createdAt', 'ASC']
        ]
      });

      const scheduledTours = [];

      for (const application of pendingApplications) {
        // Find available guides for each preferred date
        for (const date of application.preferred_dates) {
          const availableGuides = await Guide.findAll({
            where: {
              status: 'ACTIVE',
              availability: true
            },
            include: [{
              model: Schedule,
              where: {
                scheduled_date: date,
                status: { [Op.ne]: 'CANCELLED' }
              },
              required: false
            }]
          });

          // Find guide with least scheduled tours
          const selectedGuide = availableGuides.reduce((prev, curr) => 
            (prev.Schedules.length < curr.Schedules.length) ? prev : curr
          );

          if (selectedGuide) {
            // Create schedule
            const schedule = await Schedule.create({
              tour_application_id: application.id,
              guide_id: selectedGuide.id,
              scheduled_date: date,
              start_time: '09:00:00', // Default time slots
              end_time: '10:30:00',
              status: 'PENDING'
            });

            // Update application status
            await application.update({ status: 'SCHEDULED' });

            scheduledTours.push(schedule);
            break; // Move to next application
          }
        }
      }

      res.json(scheduledTours);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Approve schedule by advisor
  async approveSchedule(req, res) {
    try {
      const { id } = req.params;
      const { approved } = req.body;

      const schedule = await Schedule.findByPk(id);
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      await schedule.update({
        advisor_approval: approved,
        status: approved ? 'CONFIRMED' : 'PENDING'
      });

      // TODO: Send notification to guide and applicant

      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Reschedule tour
  async rescheduleTour(req, res) {
    try {
      const { id } = req.params;
      const { new_date, new_guide_id } = req.body;

      const schedule = await Schedule.findByPk(id);
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      // Check guide availability
      const guideSchedule = await Schedule.findOne({
        where: {
          guide_id: new_guide_id,
          scheduled_date: new_date,
          status: { [Op.ne]: 'CANCELLED' }
        }
      });

      if (guideSchedule) {
        return res.status(400).json({ message: 'Guide not available at this time' });
      }

      await schedule.update({
        guide_id: new_guide_id,
        scheduled_date: new_date,
        advisor_approval: false,
        status: 'PENDING'
      });

      // TODO: Send notifications about rescheduling

      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Mark tour as completed
  async completeTour(req, res) {
    try {
      const { id } = req.params;
      const schedule = await Schedule.findByPk(id);
      
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      await schedule.update({ status: 'COMPLETED' });

      // TODO: Send feedback request to visitors

      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = scheduleController; 