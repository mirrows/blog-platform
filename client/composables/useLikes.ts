/**
 * 点赞/收藏状态管理
 */
export const useLikes = () => {
  const api = useApi()

  // 点赞/取消点赞
  const toggleLike = async (postId: number) => {
    const res = await api.post(`/posts/${postId}/like`)
    return res
  }

  // 检查是否已点赞
  const checkLikeStatus = async (postId: number) => {
    const res = await api.get(`/posts/${postId}/like/status`)
    return res
  }

  // 收藏/取消收藏
  const toggleFavorite = async (postId: number) => {
    const res = await api.post(`/posts/${postId}/favorite`)
    return res
  }

  // 检查是否已收藏
  const checkFavoriteStatus = async (postId: number) => {
    const res = await api.get(`/posts/${postId}/favorite/status`)
    return res
  }

  // 获取我的收藏列表
  const getFavorites = async (page = 1, pageSize = 10) => {
    const res = await api.get('/favorites', { page, pageSize })
    return res
  }

  return {
    toggleLike,
    checkLikeStatus,
    toggleFavorite,
    checkFavoriteStatus,
    getFavorites,
  }
}
