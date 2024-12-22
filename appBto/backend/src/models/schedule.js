const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tour_application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tour_application',
      key: 'id'
    }
  },
  guide_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'guide',
      key: 'id'
    }
  },
  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'PENDING'
  },
  advisor_approval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'schedule'
});

module.exports = Schedule; 