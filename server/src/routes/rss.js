const Router = require('koa-router')
const { Post, Category, User } = require('../models/_associations')
const config = require('../config')

const router = new Router({ prefix: '/api' })

// 生成 RSS Feed
router.get('/rss', async (ctx) => {
  const posts = await Post.findAll({
    where: { status: 'published' },
    include: [
      { model: Category, as: 'category', attributes: ['name'] },
      { model: User, as: 'author', attributes: ['username'] }
    ],
    order: [['published_at', 'DESC']],
    limit: 20
  })

  const siteUrl = config.domain.frontend
  const siteName = '我的博客'

  let rss = '<?xml version="1.0" encoding="UTF-8"?>\n'
  rss += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n'
  rss += '  <channel>\n'
  rss += '    <title>' + escapeXml(siteName) + '</title>\n'
  rss += '    <link>' + siteUrl + '</link>\n'
  rss += '    <description>分享生活，记录思考</description>\n'
  rss += '    <language>zh-CN</language>\n'
  rss += '    <atom:link href="' + siteUrl + '/api/rss" rel="self" type="application/rss+xml"/>\n'
  rss += '    <lastBuildDate>' + new Date().toUTCString() + '</lastBuildDate>\n'

  posts.forEach(function(post) {
    rss += '    <item>\n'
    rss += '      <title>' + escapeXml(post.title) + '</title>\n'
    rss += '      <link>' + siteUrl + '/post/' + post.id + '</link>\n'
    rss += '      <guid>' + siteUrl + '/post/' + post.id + '</guid>\n'
    rss += '      <description>' + escapeXml(post.summary || post.content.substring(0, 200)) + '</description>\n'
    rss += '      <author>' + escapeXml(post.author ? post.author.username : '') + '</author>\n'
    rss += '      <category>' + escapeXml(post.category ? post.category.name : '') + '</category>\n'
    rss += '      <pubDate>' + new Date(post.published_at).toUTCString() + '</pubDate>\n'
    rss += '    </item>\n'
  })

  rss += '  </channel>\n'
  rss += '</rss>'

  ctx.type = 'application/rss+xml; charset=utf-8'
  ctx.body = rss
})

function escapeXml(str) {
  if (!str && str !== '') return ''
  var result = String(str)
  result = result.replace(/&/g, '&')
  result = result.replace(/</g, '<')
  result = result.replace(/>/g, '>')
  result = result.replace(/"/g, '"')
  result = result.replace(/'/g, '&#39;')
  return result
}

module.exports = router
