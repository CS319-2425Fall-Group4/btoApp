const { Schedule, TourApplication, Guide } = require('../models');
const { Op } = require('sequelize');

const scheduleController = {
  // Automatically schedule tours based on priority
  async scheduleTours(req, res) {
    try {
      // Create a test guide if none exists
      let guide = await Guide.findOne({ where: { status: 'ACTIVE' } });
      if (!guide) {
        guide = await Guide.create({
          status: 'ACTIVE',
          availability: true
        });
      }

      // Get pending applications
      const pendingApplications = await TourApplication.findAll({
        where: { status: 'PENDING' }
      });

      const scheduledTours = [];

      for (const application of pendingApplications) {
        // Create schedule for the first preferred date
        const schedule = await Schedule.create({
          tour_application_id: application.id,
          guide_id: guide.id,
          scheduled_date: application.preferred_dates[0],
          start_time: '09:00:00',
          end_time: '10:30:00',
          status: 'PENDING'
        });

        // Update application status
        await application.update({ status: 'SCHEDULED' });

        scheduledTours.push(schedule);
      }

      res.json({ scheduledTours });
    } catch (error) {
      console.error('Error scheduling tours:', error);
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