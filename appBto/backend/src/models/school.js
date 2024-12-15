const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'school',
});

module.exports = School;
