const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TourApplication = sequelize.define('TourApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  applicant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'visitor',
      key: 'id'
    }
  },
  institution_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'school',
      key: 'id'
    }
  },
  confirmation_code: {
    type: DataTypes.STRING,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'SCHEDULED', 'CANCELLED'),
    defaultValue: 'PENDING'
  },
  preferred_dates: {
    type: DataTypes.ARRAY(DataTypes.DATE),
    allowNull: false
  }
}, {
  tableName: 'tour_application'
}); 