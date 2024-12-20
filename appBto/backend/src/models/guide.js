const Guide = sequelize.define('Guide', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'User', key: 'id' }
  },
  availability: DataTypes.BOOLEAN,
  status: DataTypes.ENUM('TRAINEE', 'ACTIVE', 'INACTIVE')
}); 