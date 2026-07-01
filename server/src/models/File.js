const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  original_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  size: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  mime_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  upload_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_deleted: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0
  }
}, {
  tableName: 'files',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['upload_date'] },
    { fields: ['is_deleted'] }
  ]
})

module.exports = File
