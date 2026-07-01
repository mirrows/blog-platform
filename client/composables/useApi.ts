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
      const { data, error } = await useFetch(fullUrl, {
        method: options.method || 'GET',
        body: options.body,
        headers,
        onRequest({ request, options }) {
          // 不设置 Content-Type，让浏览器自动处理 FormData
        },
      })

      if (error.value) {
        console.error('API Error:', error.value)
        return {
          code: error.value.statusCode || 500,
          message: error.value.message || '网络错误',
          data: null as T,
        }
      }

      return data.value as any
    } catch (err: any) {
      console.error('Request Error:', err)
      return {
        code: 500,
        message: err.message || '请求失败',
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
