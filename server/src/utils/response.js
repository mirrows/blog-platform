/**
 * 统一响应格式工具
 */
const { transformResponse } = require('./transform')

function success(data, message = 'success') {
  return {
    code: 200,
    message,
    data: transformResponse(data)
  }
}

function successWithPagination(list, pagination) {
  return {
    code: 200,
    message: 'success',
    data: transformResponse({ list, pagination })
  }
}

function fail(message, code = 400) {
  return {
    code,
    message
  }
}

module.exports = { success, successWithPagination, fail }
