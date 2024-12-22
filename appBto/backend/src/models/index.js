const School = require('./school');
const Visitor = require('./visitor');
const Student = require('./student');
const Visit = require('./visit');
const TimeSlot = require('./timeSlot');
const { TourApplication } = require('./tourApplication');
const Guide = require('./guide');
const Schedule = require('./schedule');

// Define relationships
Student.belongsTo(Visitor, { foreignKey: 'visitor_id', onDelete: 'CASCADE' });
Visit.belongsTo(Visitor, { foreignKey: 'visitor_id', onDelete: 'CASCADE' });
Visit.belongsTo(School, { foreignKey: 'school_id', onDelete: 'CASCADE' });
TimeSlot.belongsTo(Visit, { foreignKey: 'visit_id', onDelete: 'CASCADE' });

TourApplication.belongsTo(Visitor, { foreignKey: 'applicant_id', as: 'applicant' });
TourApplication.belongsTo(School, { foreignKey: 'institution_id', as: 'institution' });

module.exports = {
  School,
  Visitor,
  Student,
  Visit,
  TimeSlot,
  TourApplication,
  Guide,
  Schedule
};
