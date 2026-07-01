const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const { File } = require('../models/_associations')
const { success, fail, successWithPagination } = require('../utils/response')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')
const config = require('../config')

const router = new Router({ prefix: '/api/admin' })

// 获取文件列表（按时间分组）
router.get('/files', authMiddleware(), adminMiddleware, async (ctx) => {
  const { page = 1, pageSize = 50 } = ctx.query
  const offset = (page - 1) * pageSize

  const { count, rows } = await File.findAndCountAll({
    where: { is_deleted: 0 },
    order: [['upload_date', 'DESC'], ['created_at', 'DESC']],
    limit: Number(pageSize),
    offset: Number(offset)
  })

  // 按年月分组
  const grouped = {}
  rows.forEach(file => {
    const key = file.upload_date.substring(0, 7) // YYYY-MM
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(file)
  })

  ctx.body = success({
    groups: grouped,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total: count
    }
  })
})

// 上传文件
router.post('/files/upload', authMiddleware(), adminMiddleware, async (ctx) => {
  const file = ctx.request.files?.file

  if (!file) {
    ctx.body = fail('请选择要上传的文件')
    return
  }

  // 校验文件类型
  if (!config.upload.allowedTypes.includes(file.mimetype)) {
    // 删除临时文件
    fs.unlinkSync(file.filepath)
    ctx.body = fail('不支持的文件类型，仅支持图片格式')
    return
  }

  // 校验文件大小
  if (file.size > config.upload.maxFileSize) {
    fs.unlinkSync(file.filepath)
    ctx.body = fail('文件大小不能超过 5MB')
    return
  }

  // 检查总存储空间
  const uploadDir = path.join(__dirname, '../../uploads')
  const totalSize = await getDirectorySize(uploadDir)
  if (totalSize + file.size > config.upload.maxStorageSize) {
    fs.unlinkSync(file.filepath)
    ctx.body = fail('存储空间已满（最大 10GB）')
    return
  }

  // 按日期组织文件
  const now = new Date()
  const datePath = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`
  const targetDir = path.join(uploadDir, datePath)

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // 生成唯一文件名
  const ext = path.extname(file.originalFilename) || '.jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
  const targetPath = path.join(targetDir, filename)

  // 移动文件
  fs.renameSync(file.filepath, targetPath)

  // 保存文件记录
  const fileRecord = await File.create({
    filename,
    original_name: file.originalFilename || filename,
    url: `/uploads/${datePath}/${filename}`,
    size: file.size,
    mime_type: file.mimetype,
    upload_date: now.toISOString().split('T')[0],
    uploaded_by: ctx.state.user.id
  })

  ctx.body = success(fileRecord, '上传成功')
})

// 删除文件
router.delete('/files/:id', authMiddleware(), adminMiddleware, async (ctx) => {
  const fileRecord = await File.findByPk(ctx.params.id)

  if (!fileRecord) {
    ctx.body = fail('文件不存在', 404)
    return
  }

  // 标记为已删除
  await fileRecord.update({ is_deleted: 1 })

  ctx.body = success(null, '删除成功')
})

// 获取目录大小
function getDirectorySize(dirPath) {
  let totalSize = 0
  if (!fs.existsSync(dirPath)) return 0

  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      totalSize += getDirectorySize(filePath)
    } else {
      totalSize += stat.size
    }
  }
  return totalSize
}

module.exports = router
