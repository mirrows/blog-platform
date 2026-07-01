const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: '标题不能为空' },
      len: [1, 200]
    }
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    validate: {
      notEmpty: { msg: '内容不能为空' }
    }
  },
  summary: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  cover_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  favorite_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comment_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'posts',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['published_at'] },
    { fields: ['category_id'] },
    { fields: ['author_id'] }
  ]
})

module.exports = Post
