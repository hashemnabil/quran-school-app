const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  full_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  national_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  father_national_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  last_memorization: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  level: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  teacher_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  teacher_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  attendance: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  exam_status: {
    type: DataTypes.ENUM('none', 'pending', 'done'),
    allowNull: false,
    defaultValue: 'none'
  },
  exam_request: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  exam_result: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'students',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Student;
