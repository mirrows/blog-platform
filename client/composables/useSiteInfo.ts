/**
 * 首页实时信息：时间、访问时长、IP定位
 */
export const useSiteInfo = () => {
  const currentTime = ref('')
  const visitDuration = ref('0小时0分0秒')
  const ip = ref('')
  const location = ref('')

  // 更新实时时间
  const updateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    currentTime.value = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
  }

  // 更新访问时长（从 sessionStorage 读取开始时间）
  const updateDuration = () => {
    if (process.client) {
      const startTime = sessionStorage.getItem('visitStartTime')
      if (!startTime) return

      const elapsed = Date.now() - Number(startTime)
      const hours = Math.floor(elapsed / 3600000)
      const minutes = Math.floor((elapsed % 3600000) / 60000)
      const seconds = Math.floor((elapsed % 60000) / 1000)
      visitDuration.value = `${hours}小时${minutes}分${seconds}秒`
    }
  }

  // 获取 IP 和地理位置
  const fetchIpInfo = async () => {
    try {
      const api = useApi()
      const res = await api.get<{ ip: string; location: string }>('/ip')
      if (res.code === 200 && res.data) {
        ip.value = res.data.ip
        location.value = res.data.location
      }
    } catch (err) {
      console.error('获取IP信息失败:', err)
    }
  }

  // 启动定时器
  let timeTimer: ReturnType<typeof setInterval>

  const start = () => {
    if (process.client) {
      // 从 sessionStorage 读取访问开始时间，如果不存在则创建
      let startTime = sessionStorage.getItem('visitStartTime')
      if (!startTime) {
        startTime = String(Date.now())
        sessionStorage.setItem('visitStartTime', startTime)
      }
    }

    updateTime()
    updateDuration()
    fetchIpInfo()

    // 只需要一个定时器更新时间和时长
    timeTimer = setInterval(() => {
      updateTime()
      updateDuration()
    }, 1000)
  }

  const stop = () => {
    if (timeTimer) clearInterval(timeTimer)
  }

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    stop()
  })

  return {
    currentTime,
    visitDuration,
    ip,
    location,
  }
}
