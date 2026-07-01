/**
 * IP 定位工具
 * 使用 ip2region 进行 IP 地理定位
 */

let ip2region = null
try {
  ip2region = require('ip2region')
} catch (err) {
  // ip2region 为可选依赖，未安装时返回默认值
}

function getIpLocation(ip) {
  // 本地地址直接返回
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
    return { fullLocation: '本地' }
  }

  if (!ip2region) {
    return { fullLocation: '未知位置' }
  }

  try {
    const query = new ip2region()
    const res = query.search(ip)
    const region = res?.province || ''
    const city = res?.city || ''
    const fullLocation = `${region}${city}`.replace(/0/g, '').trim()
    return { fullLocation: fullLocation || '未知位置' }
  } catch (err) {
    return { fullLocation: '未知位置' }
  }
}

function getClientIp(ctx) {
  const ip = ctx.headers['x-forwarded-for']
    || ctx.headers['x-real-ip']
    || ctx.ip
    || ctx.request.ip
    || ''
  return ip.replace(/::ffff:/, '').split(',')[0].trim()
}

module.exports = { getIpLocation, getClientIp }
