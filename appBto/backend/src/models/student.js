const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Visitor = require('./visitor');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  visitor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Visitor,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  interests: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'student',
});

Student.belongsTo(Visitor, { foreignKey: 'visitor_id', onDelete: 'CASCADE' });

module.exports = Student;
