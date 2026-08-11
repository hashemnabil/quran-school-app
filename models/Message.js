const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  channel: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  sender_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  sender_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  sender_role: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  recipient_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  recipient_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Message;
