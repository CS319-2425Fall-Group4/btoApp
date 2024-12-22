const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guide = sequelize.define('Guide', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { 
      model: 'User', 
      key: 'id' 
    }
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  status: {
    type: DataTypes.ENUM('TRAINEE', 'ACTIVE', 'INACTIVE'),
    defaultValue: 'TRAINEE'
  }
}, {
  tableName: 'guide',
  timestamps: true
});

module.exports = Guide; 