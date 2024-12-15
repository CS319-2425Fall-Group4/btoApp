const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Visitor = require('./visitor');
const School = require('./school');

const Visit = sequelize.define('Visit', {
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
  school_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: School,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  visit_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'visit',
});

Visit.belongsTo(Visitor, { foreignKey: 'visitor_id', onDelete: 'CASCADE' });
Visit.belongsTo(School, { foreignKey: 'school_id', onDelete: 'CASCADE' });

module.exports = Visit;
