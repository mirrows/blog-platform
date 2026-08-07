/**
 * API 请求封装
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('token') || ''
    }
    return ''
  }

  const request = async <T = any>(
    url: string,
    options: {
      method?: string
      body?: any
      headers?: Record<string, string>
      params?: Record<string, any>
    } = {}
  ): Promise<{ code: number; message: string; data: T }> => {
    const token = getToken()
    const headers: Record<string, string> = {
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // 处理 params
    let fullUrl = `${baseURL}${url}`
    if (options.params) {
      const query = new URLSearchParams()
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value))
        }
      })
      const queryStr = query.toString()
      if (queryStr) {
        fullUrl += `?${queryStr}`
      }
    }

    try {
      const res = await $fetch(fullUrl, {
        method: (options.method || 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        body: options.body,
        headers,
      })

      return res as any
    } catch (err: any) {
      console.error('Request Error:', err)

      // // 401 未授权：清除本地 token 并跳转登录页
      // if (err?.response?.status === 401 && process.client) {
      //   localStorage.removeItem('token')
      //   localStorage.removeItem('user')
      //   if (window.location.pathname !== '/login') {
      //     window.location.href = '/login'
      //   }
      // }

      return {
        code: err?.response?.status || 500,
        message: err?.data?.message || err.message || '请求失败',
        data: null as T,
      }
    }
  }

  return {
    get: <T = any>(url: string, params?: Record<string, any>) =>
      request<T>(url, { method: 'GET', params }),

    post: <T = any>(url: string, body?: any) =>
      request<T>(url, { method: 'POST', body }),

    put: <T = any>(url: string, body?: any) =>
      request<T>(url, { method: 'PUT', body }),

    delete: <T = any>(url: string) =>
      request<T>(url, { method: 'DELETE' }),
  }
}
