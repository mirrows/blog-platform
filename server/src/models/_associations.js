const sequelize = require('../config/database')
const User = require('./User')
const Post = require('./Post')
const Category = require('./Category')
const Tag = require('./Tag')
const Comment = require('./Comment')
const Like = require('./Like')
const Favorite = require('./Favorite')
const File = require('./File')
const VisitLog = require('./VisitLog')

// ============================================
// User 关联
// ============================================
User.hasMany(Post, { foreignKey: 'author_id', as: 'posts' })
Post.belongsTo(User, { foreignKey: 'author_id', as: 'author' })

User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' })
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' })
Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' })
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

// ============================================
// Category 关联
// ============================================
Category.hasMany(Post, { foreignKey: 'category_id', as: 'posts' })
Post.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

// ============================================
// Tag 关联（多对多）
// ============================================
const PostTag = sequelize.define('PostTag', {}, {
  tableName: 'post_tags',
  timestamps: true,
  underscored: true
})

Post.belongsToMany(Tag, {
  through: 'post_tags',
  foreignKey: 'post_id',
  otherKey: 'tag_id',
  as: 'tags'
})

Tag.belongsToMany(Post, {
  through: 'post_tags',
  foreignKey: 'tag_id',
  otherKey: 'post_id',
  as: 'posts'
})

// ============================================
// Post 关联
// ============================================
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' })
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' })

Post.hasMany(Like, { foreignKey: 'post_id', as: 'likes' })
Like.belongsTo(Post, { foreignKey: 'post_id', as: 'post' })

Post.hasMany(Favorite, { foreignKey: 'post_id', as: 'favorites' })
Favorite.belongsTo(Post, { foreignKey: 'post_id', as: 'post' })

Post.hasMany(VisitLog, { foreignKey: 'post_id', as: 'visitLogs' })
VisitLog.belongsTo(Post, { foreignKey: 'post_id', as: 'post' })

// ============================================
// Comment 自关联（回复）
// ============================================
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' })
Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' })

module.exports = {
  User, Post, Category, Tag, Comment, Like, Favorite, File, VisitLog, PostTag
}
