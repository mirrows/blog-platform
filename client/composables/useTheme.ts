/**
 * 主题管理：暗黑模式跟随系统 + 手动切换 + 持久化
 */
export const useTheme = () => {
  const theme = ref<'light' | 'dark'>('light')

  // 检测系统偏好
  const getSystemTheme = (): 'light' | 'dark' => {
    if (process.client && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // 应用主题到 DOM
  const applyTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    if (process.client) {
      document.documentElement.setAttribute('data-theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      localStorage.setItem('theme', newTheme)
    }
  }

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(newTheme)
  }

  // 初始化主题
  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (savedTheme) {
        applyTheme(savedTheme)
      } else {
        // 跟随系统偏好
        applyTheme(getSystemTheme())
      }
    }
  }

  // 监听系统主题变化
  const watchSystemTheme = () => {
    if (process.client && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        // 只有在用户没有手动设置主题时才跟随系统
        const savedTheme = localStorage.getItem('theme')
        if (!savedTheme) {
          applyTheme(e.matches ? 'dark' : 'light')
        }
      })
    }
  }

  // 初始化
  initTheme()
  watchSystemTheme()

  return {
    theme,
    toggleTheme,
    applyTheme,
    getSystemTheme,
  }
}
