const School = require('./school');
const Visitor = require('./visitor');
const Student = require('./student');
const Visit = require('./visit');
const TimeSlot = require('./timeSlot');
const Guide = require('./guide');
const Schedule = require('./schedule');
const TourApplication = require('./tourApplication');

// Define relationships
Student.belongsTo(Visitor, { foreignKey: 'visitor_id', onDelete: 'CASCADE' }); 
Visit.belongsTo(Visitor, { foreignKey: 'visitor_id', onDelete: 'CASCADE' }); //May need alias on further use
Visit.belongsTo(School, { foreignKey: 'school_id', onDelete: 'CASCADE' }); //May need alias on further use
TimeSlot.belongsTo(Visit, { foreignKey: 'visit_id', onDelete: 'CASCADE' });

TourApplication.belongsTo(Visitor, { foreignKey: 'applicant_id', as: 'applicant' });
TourApplication.belongsTo(School, { foreignKey: 'institution_id', as: 'institution' });

// Update relationships
Schedule.belongsTo(TourApplication, { //May need alias on further use
  foreignKey: 'tour_application_id',
  onDelete: 'CASCADE'
});
Schedule.belongsTo(Guide, { //May need alias on further use
  foreignKey: 'guide_id',
  onDelete: 'CASCADE'
});
Guide.hasMany(Schedule, { foreignKey: 'guide_id' });
TourApplication.hasOne(Schedule, { foreignKey: 'tour_application_id' }); //May need alias on further use

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
