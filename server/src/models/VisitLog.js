const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const VisitLog = sequelize.define('VisitLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  user_agent: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  referer: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'visit_logs',
  timestamps: true,
  underscored: true
})

module.exports = VisitLog
