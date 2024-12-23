const { User } = require('../models');

const initializeDatabase = async () => {
  try {
    // Create test users
    await User.bulkCreate([
      {
        email: 'test@bilkent.edu.tr',
        password: 'password123',
        role: 'GUIDE'
      },
      {
        email: 'admin@bilkent.edu.tr',
        password: 'admin123',
        role: 'ADMINISTRATOR'
      },
      {
        email: 'coordinator@bilkent.edu.tr',
        password: 'coord123',
        role: 'COORDINATOR'
      }
    ], {
      ignoreDuplicates: true
    });
    
    console.log('Database initialized with test data');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = initializeDatabase; 