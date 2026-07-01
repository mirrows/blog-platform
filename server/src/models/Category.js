const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Category = sequelize.define('Category', {
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
      notEmpty: { msg: '分类名称不能为空' }
    }
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: '分类别名不能为空' }
    }
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true
})

module.exports = Category
