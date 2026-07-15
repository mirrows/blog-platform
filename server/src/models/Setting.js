const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: '配置键不能为空' }
    }
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'settings',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['key'] }
  ]
})

module.exports = Setting
