const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: 'مدرسة تحفيظ القرآن الكريم'
  },
  tagline: {
    type: DataTypes.STRING(300),
    allowNull: true,
    defaultValue: 'نظام إدارة الطلاب والحفظ والاختبارات'
  },
  logo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  whatsapp: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  facebook: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  instagram: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  whatsapp_group: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'school',
  timestamps: false
});

module.exports = School;
