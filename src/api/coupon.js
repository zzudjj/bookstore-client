import axios from 'axios'

// 包装的axios ajax请求接口
function ajax(url, data = {}, method = 'GET') {
  return new Promise(function (resolve, reject) {
    let promise

    if (method === 'GET') {
      // 准备url query参数数据
      let dataStr = ''
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }

      promise = axios.get(url)
    } else {
      promise = axios.post(url, data)
    }

    promise.then(function (response) {
      resolve(response)
    }).catch(function (error) {
      reject(error)
    })
  })
}

// ==================== 管理员接口 ====================

/**
 * 创建优惠券模板（管理员）
 */
export function createCouponTemplate(templateData) {
  return ajax('/coupon/admin/template', templateData, 'POST')
}

/**
 * 获取所有优惠券模板（管理员）
 */
export function getAllCouponTemplates() {
  return ajax('/coupon/admin/templates')
}

/**
 * 更新优惠券模板（管理员）
 */
export function updateCouponTemplate(id, templateData) {
  return axios.put(`/coupon/admin/template/${id}`, templateData)
}

/**
 * 更新优惠券模板状态（管理员）
 */
export function updateCouponTemplateStatus(id, status) {
  return axios.put(`/coupon/admin/template/${id}/status`, null, {
    params: { status }
  })
}

/**
 * 删除优惠券模板（管理员）
 */
export function deleteCouponTemplate(id) {
  return axios.delete(`/coupon/admin/template/${id}`)
}

// ==================== 用户接口 ====================

/**
 * 获取可领取的优惠券模板
 */
export function getAvailableCouponTemplates() {
  return ajax('/coupon/templates')
}

/**
 * 用户领取优惠券
 */
export function claimCoupon(templateId) {
  return axios.post(`/coupon/claim/${templateId}`)
}

/**
 * 获取用户的所有优惠券
 */
export function getUserCoupons() {
  return ajax('/coupon/my')
}

/**
 * 获取用户可用的优惠券
 */
export function getAvailableUserCoupons() {
  return ajax('/coupon/my/available')
}

/**
 * 计算优惠券折扣
 */
export function calculateCouponDiscount(couponCode, orderAmount) {
  return ajax('/coupon/calculate', { couponCode, orderAmount }, 'POST')
}

/**
 * 验证优惠券是否可用
 */
export function validateCoupon(couponCode, orderAmount) {
  return ajax('/coupon/validate', { couponCode, orderAmount })
}

/**
 * 使用优惠券（内部接口）
 */
export function useCoupon(usageData) {
  return ajax('/coupon/internal/use', usageData, 'POST')
}

// ==================== 工具函数 ====================

/**
 * 格式化优惠券类型
 */
export function formatCouponType(type) {
  const typeMap = {
    1: '满减券',
    2: '折扣券'
  }
  return typeMap[type] || '未知类型'
}

/**
 * 格式化优惠券状态
 */
export function formatCouponStatus(status) {
  const statusMap = {
    0: '停用',
    1: '启用'
  }
  return statusMap[status] || '未知状态'
}

/**
 * 格式化用户优惠券状态
 */
export function formatUserCouponStatus(status) {
  const statusMap = {
    1: '未使用',
    2: '已使用',
    3: '已过期'
  }
  return statusMap[status] || '未知状态'
}

/**
 * 格式化优惠描述
 */
export function formatDiscountDesc(template) {
  if (template.type === 1) {
    // 满减券
    return `满${template.minOrderAmount}减${template.discountValue}`
  } else if (template.type === 2) {
    // 折扣券
    const discount = (template.discountValue / 10).toFixed(1)
    if (template.maxDiscountAmount) {
      return `${discount}折优惠（最多减${template.maxDiscountAmount}元）`
    } else {
      return `${discount}折优惠`
    }
  }
  return '优惠券'
}

/**
 * 检查优惠券是否即将过期（3天内）
 */
export function isExpiringSoon(expireTime) {
  const now = new Date()
  const expire = new Date(expireTime)
  const diffTime = expire.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays > 0
}

/**
 * 检查优惠券是否已过期
 */
export function isExpired(expireTime) {
  const now = new Date()
  const expire = new Date(expireTime)
  return expire.getTime() < now.getTime()
}

/**
 * 格式化剩余时间
 */
export function formatRemainingTime(expireTime) {
  const now = new Date()
  const expire = new Date(expireTime)
  const diffTime = expire.getTime() - now.getTime()
  
  if (diffTime <= 0) {
    return '已过期'
  }
  
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (diffDays > 0) {
    return `${diffDays}天${diffHours}小时`
  } else {
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHours}小时${diffMinutes}分钟`
  }
}

/**
 * 计算优惠券使用率
 */
export function calculateUsageRate(usedQuantity, receivedQuantity) {
  if (receivedQuantity === 0) return 0
  return ((usedQuantity / receivedQuantity) * 100).toFixed(1)
}

/**
 * 获取优惠券状态颜色
 */
export function getCouponStatusColor(status) {
  const colorMap = {
    1: 'success', // 未使用 - 绿色
    2: 'info',    // 已使用 - 蓝色
    3: 'danger'   // 已过期 - 红色
  }
  return colorMap[status] || 'default'
}

/**
 * 获取模板状态颜色
 */
export function getTemplateStatusColor(status) {
  const colorMap = {
    0: 'danger',  // 停用 - 红色
    1: 'success'  // 启用 - 绿色
  }
  return colorMap[status] || 'default'
}
