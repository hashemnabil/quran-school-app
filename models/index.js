const sequelize = require('../config/database');

const User = require('./User');
const Student = require('./Student');
const Message = require('./Message');
const School = require('./School');

// Define associations
Student.belongsTo(User, { as: 'teacher', foreignKey: 'teacher_id', constraints: false });
User.hasMany(Student, { as: 'students', foreignKey: 'teacher_id', constraints: false });

module.exports = {
  sequelize,
  User,
  Student,
  Message,
  School
};
