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
    type: DataTypes.DATEONLY, // check if the timestamp is also needed
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
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'schedule',
  timestamps: true
});

module.exports = Schedule; 