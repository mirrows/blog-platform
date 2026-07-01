const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const bcrypt = require('bcryptjs')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: '用户名不能为空' },
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: '邮箱格式不正确' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: '密码不能为空' },
      len: [6, 255]
    }
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: '/images/default-avatar.png'
  },
  bio: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'disabled'),
    defaultValue: 'active'
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    }
  }
})

// 实例方法：验证密码
User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

// 类方法：获取用户公开信息（不含密码）
User.prototype.toPublicJSON = function () {
  const values = this.toJSON()
  delete values.password
  return values
}

module.exports = User
