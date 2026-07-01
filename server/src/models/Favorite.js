const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Favorite = sequelize.define('Favorite', {
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
  tableName: 'favorites',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['post_id', 'user_id']
    }
  ]
})

module.exports = Favorite
