const sequelize = require('../src/config/database.test.config');
const { School, Visitor, Student, Schedule, Guide } = require('../src/models');
const { TourApplication } = require('../src/models/tourApplication');

const setupTestDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Test database connected');
    
    // Force sync to recreate tables
    await sequelize.sync({ force: true });
    console.log('Test database synced');
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
};

const clearTestDb = async () => {
  try {
    // Clear tables in order to respect foreign key constraints
    await Schedule.destroy({ where: {} });
    await TourApplication.destroy({ where: {} });
    await Guide.destroy({ where: {} });
    await Student.destroy({ where: {} });
    await Visitor.destroy({ where: {} });
    await School.destroy({ where: {} });
    
    console.log('Test database cleared successfully');
  } catch (error) {
    console.error('Test database cleanup failed:', error);
    throw error;
  }
};

module.exports = {
  setupTestDb,
  clearTestDb
}; 