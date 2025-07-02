import ajax from './ajax'

// 获取秒杀活动列表（前端用户页面）
export const reqGetSpikeList = () => ajax('/api/spike/list')

// 获取当前进行中的秒杀活动
export const reqGetActiveActivities = () => ajax('/api/spike/activities')

// 获取指定活动的秒杀商品列表
export const reqGetSpikeGoods = (activityId) => ajax('/api/spike/goods', {activityId})

// 获取秒杀商品详情
export const reqGetSpikeGoodsDetail = (goodsId) => ajax(`/api/spike/goods/${goodsId}`)

// 执行秒杀
export const reqDoSpike = (spikeGoodsId, quantity = 1) => ajax('/api/spike/doSpike', {spikeGoodsId, quantity}, 'POST')

// 根据图书ID执行秒杀
export const reqSpikeBook = (bookId, quantity = 1) => ajax('/api/spike/spikeBook', {id: bookId, quantity}, 'POST')

// 获取用户秒杀订单列表
export const reqGetUserSpikeOrders = (page = 1, pageSize = 10) => ajax('/api/spike/orders', {page, pageSize})

// 获取秒杀订单详情
export const reqGetSpikeOrderDetail = (orderId) => ajax(`/api/spike/orders/${orderId}`)

// 取消秒杀订单
export const reqCancelSpikeOrder = (orderId) => ajax(`/api/spike/orders/${orderId}/cancel`, {}, 'POST')

// ========================================
// 管理员接口
// ========================================

// 获取所有秒杀活动（管理员）
export const reqGetAllActivities = (page = 1, pageSize = 10) => ajax('/api/spike/admin/activities', {page, pageSize})

// 创建秒杀活动
export const reqCreateActivity = (activity) => ajax('/api/spike/admin/activities', activity, 'POST')

// 添加秒杀商品
export const reqAddSpikeGoods = (spikeGoods) => ajax('/api/spike/admin/goods', spikeGoods, 'POST')

// 获取秒杀统计数据
export const reqGetSpikeStatistics = (activityId) => ajax('/api/spike/admin/statistics', {activityId})

// 删除秒杀活动
export const reqDeleteActivity = (activityId) => ajax(`/api/spike/admin/activities/${activityId}`, {}, 'DELETE')

// 更新活动状态
export const reqUpdateActivityStatus = (activityId, status) => ajax(`/api/spike/admin/activities/${activityId}/status`, {status}, 'PUT')

// 获取活动详情
export const reqGetActivityDetail = (activityId) => ajax(`/api/spike/admin/activities/${activityId}`)

// 更新活动
export const reqUpdateActivity = (activityId, activity) => ajax(`/api/spike/admin/activities/${activityId}`, activity, 'PUT')

// 批量操作活动
export const reqBatchOperateActivities = (ids, operation) => ajax('/api/spike/admin/activities/batch', {ids, operation}, 'POST')

// ========== 商品管理相关 ==========

// 获取活动商品列表
export const reqGetActivityGoods = (activityId, page, pageSize) => ajax(`/api/spike/admin/activities/${activityId}/goods`, {page, pageSize})

// 更新秒杀商品
export const reqUpdateSpikeGoods = (goodsId, goods) => ajax(`/api/spike/admin/goods/${goodsId}`, goods, 'PUT')

// 删除秒杀商品
export const reqDeleteSpikeGoods = (goodsId) => ajax(`/api/spike/admin/goods/${goodsId}`, {}, 'DELETE')
