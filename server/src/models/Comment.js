const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: '评论内容不能为空' },
      len: [1, 1000]
    }
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  user_agent: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'comments',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['post_id'] },
    { fields: ['status'] }
  ]
})

module.exports = Comment
