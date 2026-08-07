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
  page_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  user_agent: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  visit_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
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
