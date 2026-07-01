/**
 * 统一响应格式工具
 */

function success(data, message = 'success') {
  return {
    code: 200,
    message,
    data
  }
}

function successWithPagination(list, pagination) {
  return {
    code: 200,
    message: 'success',
    data: { list, pagination }
  }
}

function fail(message, code = 400) {
  return {
    code,
    message
  }
}

module.exports = { success, successWithPagination, fail }
