import ajax from "./ajax";

const BASE_URL = "/dashboard";

/**
 * 管理员仪表盘API接口
 * 
 * @author: 黄龙
 * @date: 2025/07/03
 * @description: 提供管理员仪表盘所需的各种统计数据API
 */

// 获取仪表盘概览数据
export const reqDashboardOverview = () => ajax(BASE_URL + "/overview", {}, "GET");

// 获取销售统计数据
export const reqSalesStatistics = (days = 7) => ajax(BASE_URL + "/sales", { period: days }, "GET");

// 获取库存统计数据
export const reqInventoryStatistics = () => ajax(BASE_URL + "/inventory", {}, "GET");

// 获取客户统计数据
export const reqCustomerStatistics = () => ajax(BASE_URL + "/customers", {}, "GET");

// 获取财务统计数据
export const reqFinancialStatistics = (startDate, endDate) => ajax(BASE_URL + "/financial", { startDate, endDate }, "GET");

// 获取热销商品排行
export const reqBestsellers = (limit = 10) => ajax(BASE_URL + "/bestsellers", { limit }, "GET");

// 获取最新订单
export const reqRecentOrders = (limit = 10) => ajax(BASE_URL + "/recent-orders", { limit }, "GET");

// 获取低库存预警
export const reqLowStockAlerts = (threshold = 10) => ajax(BASE_URL + "/low-stock", { threshold }, "GET");
