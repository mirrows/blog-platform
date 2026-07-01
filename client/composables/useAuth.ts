/**
 * 认证状态管理
 */
export const useAuth = () => {
  const user = ref<any>(null)
  const token = ref<string>('')

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // 初始化：从 localStorage 恢复状态
  const init = () => {
    if (process.client) {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      if (savedToken) token.value = savedToken
      if (savedUser) user.value = JSON.parse(savedUser)
    }
  }

  // 登录
  const login = async (username: string, password: string) => {
    const api = useApi()
    const res = await api.post<{ token: string; user: any }>('/auth/login', {
      username,
      password,
    })

    if (res.code === 200 && res.data) {
      token.value = res.data.token
      user.value = res.data.user
      if (process.client) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
      }
      return true
    }
    return false
  }

  // 注册
  const register = async (username: string, email: string, password: string) => {
    const api = useApi()
    const res = await api.post('/auth/register', {
      username,
      email,
      password,
    })
    return res.code === 200
  }

  // 登出
  const logout = () => {
    token.value = ''
    user.value = null
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    navigateTo('/')
  }

  // 获取当前用户信息
  const fetchUser = async () => {
    const api = useApi()
    const res = await api.get('/auth/me')
    if (res.code === 200 && res.data) {
      user.value = res.data
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(res.data))
      }
    }
  }

  init()

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
  }
}
