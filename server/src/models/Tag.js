const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: '标签名称不能为空' }
    }
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: '标签别名不能为空' }
    }
  }
}, {
  tableName: 'tags',
  timestamps: true,
  underscored: true
})

module.exports = Tag
