const School = require('./school');
const Visitor = require('./visitor');
const Student = require('./student');
const Visit = require('./visit');
const TimeSlot = require('./timeSlot');

// Define relationships
Student.belongsTo(Visitor, { foreignKey: 'visitor_id', onDelete: 'CASCADE' });
Visit.belongsTo(Visitor, { foreignKey: 'visitor_id', onDelete: 'CASCADE' });
Visit.belongsTo(School, { foreignKey: 'school_id', onDelete: 'CASCADE' });
TimeSlot.belongsTo(Visit, { foreignKey: 'visit_id', onDelete: 'CASCADE' });

module.exports = {
  School,
  Visitor,
  Student,
  Visit,
  TimeSlot,
};
