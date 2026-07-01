const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'likes',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['post_id', 'user_id']
    }
  ]
})

module.exports = Like
