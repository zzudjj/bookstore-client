import ajax from "./ajax";

const BASE_URL = ''  // 移除重复的/api前缀

//初始化订单
export const reqInitOrder = (ids,from,account) => ajax(BASE_URL+"/initOrder",{ids,from,account})

//提交订单 addOrder
export const reqAddOrder = (orderInitDto) => ajax(BASE_URL+"/addOrder", {
  account: orderInitDto.account,
  bookList: orderInitDto.bookList,
  expense: orderInitDto.expense,
  addressList: orderInitDto.addressList,
  address: orderInitDto.address,
  couponCode: orderInitDto.couponCode,
  isSpikeOrder: orderInitDto.isSpikeOrder
},"POST")

//管理员得到订单列表
export const reqAdminGetOrderList = (page,pageSize) => ajax(BASE_URL+"/getAdminOrderList",{page,pageSize})

//管理员得到订单列表（带搜索参数）
export const reqAdminGetOrderListWithParams = (params) => ajax(BASE_URL+"/getAdminOrderList", params)

//管理员得到订单的明细getOrderDto
export const reqAdminGetOrderDetail = (id) => ajax(BASE_URL+"/getOrderDto",{id})

//用户获取订单详情
export const reqGetOrderDetail = (orderId, token) => ajax(BASE_URL+"/getUserOrderDetail", {orderId}, 'GET', token)

//获取用户订单统计信息
export const reqGetUserOrderStats = (token) => ajax(BASE_URL+"/getUserOrderStats", {}, 'GET', token)

//删除订单
export const reqDelOrder = (id) => ajax(BASE_URL+"/delOrder",{id})

//发货deliverOrder
export const reqDeliverOrder = (id,logisticsCompany,logisticsNum) => ajax(BASE_URL+"/deliverOrder",{id,logisticsCompany,logisticsNum})

//普通用户得到自己的订单列表getUserOrderList
export const reqUserGetOrderList = (account,page,pageSize,orderStatus,beUserDelete) => ajax(BASE_URL+"/getUserOrderList",{account,page,pageSize,orderStatus,beUserDelete})

//修改订单状态modifyOrderStatus
export const reqModOrderStatus = (id,orderStatus) => ajax(BASE_URL+"/modifyOrderStatus",{id,orderStatus})

//确认支付
export const reqConfirmPayment = (orderId) => ajax(BASE_URL+"/confirmPayment",{orderId},"POST")

//得到时间筛选后的订单统计信息
export const reqGetOrderStatistic = (beginDate,endDate) => ajax(BASE_URL+"/order/date",{beginDate,endDate})
