const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  role: DataTypes.ENUM('DIRECTOR', 'ADVISOR', 'GUIDE', 'COORDINATOR', 'ADMINISTRATOR')
}); 