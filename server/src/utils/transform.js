/**
 * 字段转换工具
 * 用于将数据库字段（下划线命名）转换为 API 响应字段（小驼峰命名）
 */

/**
 * 将下划线命名转换为小驼峰命名
 * @param {string} str - 下划线命名字符串
 * @returns {string} 小驼峰命名字符串
 */
function camelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 获取对象的纯净数据（处理 Sequelize 实例）
 * Sequelize 实例包含 dataValues、_previousDataValues 等内部属性，
 * 需要调用 toJSON() 获取纯净的普通对象
 */
function toPlainObject(obj) {
  // Sequelize 实例有 toJSON 方法（且不是 Object.prototype 上的）
  if (obj !== null && typeof obj === 'object' && typeof obj.toJSON === 'function') {
    return obj.toJSON()
  }
  return obj
}

/**
 * 递归转换对象的所有键
 * @param {*} obj - 需要转换的对象
 * @param {Function} callback - 键转换函数
 * @returns {*} 转换后的对象
 */
function transformKeys(obj, callback) {
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item, callback))
  }

  // 处理对象
  if (obj !== null && typeof obj === 'object') {
    // 先获取纯净的普通对象（处理 Sequelize 实例）
    const plain = toPlainObject(obj)
    // 转换键名
    return Object.keys(plain).reduce((result, key) => {
      const newKey = callback(key)
      result[newKey] = transformKeys(plain[key], callback)
      return result
    }, {})
  }

  // 其他类型直接返回
  return obj
}

/**
 * 转换 Sequelize 查询结果为小驼峰命名
 * @param {*} data - Sequelize 查询结果（可能是单个对象、数组或包含 list 的分页对象）
 * @returns {*} 转换后的结果
 */
function transformResponse(data) {
  // 处理分页响应格式 { list: [...], pagination: {...} }
  if (data && typeof data === 'object' && data.list && Array.isArray(data.list)) {
    return {
      list: transformKeys(data.list, camelCase),
      pagination: transformKeys(data.pagination, camelCase)
    }
  }

  // 处理普通数组
  if (Array.isArray(data)) {
    return transformKeys(data, camelCase)
  }

  // 处理单个对象
  if (data !== null && typeof data === 'object') {
    return transformKeys(data, camelCase)
  }

  return data
}

module.exports = {
  camelCase,
  transformKeys,
  transformResponse
}
