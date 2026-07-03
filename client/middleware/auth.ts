/**
 * 认证中间件 - 检查用户是否已登录
 * 未登录时重定向到登录页
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 在客户端检查 localStorage
  if (process.client) {
    const token = localStorage.getItem('token')
    if (!token) {
      return navigateTo('/login')
    }
  }
})
