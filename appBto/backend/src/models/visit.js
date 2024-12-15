const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Visit = require('./visit');

const TimeSlot = sequelize.define('TimeSlot', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  visit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Visit,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  slot_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
}, {
  tableName: 'timeSlot',
});

TimeSlot.belongsTo(Visit, { foreignKey: 'visit_id', onDelete: 'CASCADE' });

module.exports = TimeSlot;
