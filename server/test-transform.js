/**
 * 测试字段转换工具
 */

const { transformResponse, camelCase } = require('./src/utils/transform')

// 测试 camelCase 函数
console.log('=== 测试 camelCase 函数 ===')
console.log('view_count ->', camelCase('view_count'))
console.log('cover_image ->', camelCase('cover_image'))
console.log('category_id ->', camelCase('category_id'))
console.log('published_at ->', camelCase('published_at'))
console.log('createdAt ->', camelCase('createdAt'))
console.log('id ->', camelCase('id'))
console.log()

// 测试 transformResponse 函数 - 分页格式
console.log('=== 测试分页格式转换 ===')
const paginationData = {
  list: [
    {
      id: 1,
      title: '测试文章',
      view_count: 100,
      cover_image: 'https://example.com/image.jpg',
      category_id: 1,
      published_at: '2024-01-01 00:00:00',
      category: {
        id: 1,
        name: '技术'
      },
      author: {
        id: 1,
        username: 'admin'
      }
    }
  ],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 1
  }
}

const transformedPagination = transformResponse(paginationData)
console.log('转换前:', JSON.stringify(paginationData, null, 2))
console.log('转换后:', JSON.stringify(transformedPagination, null, 2))
console.log()

// 测试 transformResponse 函数 - 单个对象
console.log('=== 测试单个对象转换 ===')
const singleObject = {
  id: 1,
  title: '测试文章',
  view_count: 100,
  cover_image: 'https://example.com/image.jpg',
  category_id: 1,
  published_at: '2024-01-01 00:00:00'
}

const transformedSingle = transformResponse(singleObject)
console.log('转换前:', JSON.stringify(singleObject, null, 2))
console.log('转换后:', JSON.stringify(transformedSingle, null, 2))
console.log()

// 验证关键字段
console.log('=== 验证关键字段 ===')
const post = transformedPagination.list[0]
console.log('✓ viewCount:', post.viewCount === 100 ? '正确' : '错误')
console.log('✓ coverImage:', post.coverImage === 'https://example.com/image.jpg' ? '正确' : '错误')
console.log('✓ categoryId:', post.categoryId === 1 ? '正确' : '错误')
console.log('✓ publishedAt:', post.publishedAt === '2024-01-01 00:00:00' ? '正确' : '错误')
console.log('✓ category.name:', post.category.name === '技术' ? '正确' : '错误')
console.log('✓ author.username:', post.author.username === 'admin' ? '正确' : '错误')
console.log()

console.log('=== 测试完成 ===')
