<template>
  <div class="enhanced-dashboard">
    <!-- 📊 核心指标卡片 -->
    <div class="metrics-grid">
      <div class="metric-card sales">
        <div class="metric-icon">
          <i class="el-icon-money"></i>
        </div>
        <div class="metric-content">
          <h3>今日销售额</h3>
          <div class="metric-value">¥{{ formatNumber(overview.todaySales) }}</div>
          <div class="metric-change" :class="{ positive: overview.salesGrowthRate > 0, negative: overview.salesGrowthRate < 0 }">
            <i :class="overview.salesGrowthRate > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            {{ Math.abs(overview.salesGrowthRate).toFixed(1) }}%
          </div>
        </div>
      </div>

      <div class="metric-card orders">
        <div class="metric-icon">
          <i class="el-icon-shopping-cart-2"></i>
        </div>
        <div class="metric-content">
          <h3>今日订单</h3>
          <div class="metric-value">{{ overview.todayOrders }}</div>
          <div class="metric-subtitle">总订单: {{ overview.totalOrders }}</div>
        </div>
      </div>

      <div class="metric-card users">
        <div class="metric-icon">
          <i class="el-icon-user"></i>
        </div>
        <div class="metric-content">
          <h3>总用户数</h3>
          <div class="metric-value">{{ overview.totalUsers }}</div>
          <div class="metric-subtitle">本月新增: {{ overview.monthlyNewUsers }}</div>
        </div>
      </div>

      <div class="metric-card inventory">
        <div class="metric-icon">
          <i class="el-icon-goods"></i>
        </div>
        <div class="metric-content">
          <h3>商品库存</h3>
          <div class="metric-value">{{ overview.totalBooks }}</div>
          <div class="metric-subtitle">待处理: {{ overview.pendingOrders }}</div>
        </div>
      </div>
    </div>

    <!-- 📈 图表区域 -->
    <div class="charts-section">
      <div class="chart-container">
        <div class="chart-header">
          <h3>销售趋势</h3>
          <el-radio-group v-model="salesPeriod" @change="loadSalesData">
            <el-radio-button label="7">最近7天</el-radio-button>
            <el-radio-button label="15">最近15天</el-radio-button>
            <el-radio-button label="30">最近30天</el-radio-button>
          </el-radio-group>
        </div>
        <div id="salesChart" class="chart-content"></div>
      </div>

      <div class="chart-container">
        <div class="chart-header">
          <h3>库存分布</h3>
        </div>
        <div id="inventoryChart" class="chart-content"></div>
      </div>
    </div>

    <!-- 📋 数据表格区域 -->
    <div class="tables-section">
      <div class="table-container">
        <div class="table-header">
          <h3>最新订单</h3>
          <el-button type="text" @click="$router.push('/admin/orderList')">查看全部</el-button>
        </div>
        <el-table :data="recentOrders" style="width: 100%" size="small">
          <el-table-column prop="orderId" label="订单号" width="180"></el-table-column>
          <el-table-column prop="account" label="用户" width="120"></el-table-column>
          <el-table-column prop="orderStatus" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag :type="getOrderStatusType(scope.row.orderStatus)" size="mini">
                {{ scope.row.orderStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="金额" width="100">
            <template slot-scope="scope">
              ¥{{ scope.row.expense ? scope.row.expense.finallyPrice : '0.00' }}
            </template>
          </el-table-column>
          <el-table-column prop="orderTime" label="下单时间">
            <template slot-scope="scope">
              {{ formatDateTime(scope.row.orderTime) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="table-container">
        <div class="table-header">
          <h3>库存预警</h3>
          <el-button type="text" @click="$router.push('/admin/bookList')">查看全部</el-button>
        </div>
        <el-table :data="lowStockAlerts" style="width: 100%" size="small">
          <el-table-column prop="bookName" label="图书名称"></el-table-column>
          <el-table-column prop="author" label="作者" width="120"></el-table-column>
          <el-table-column prop="stock" label="库存" width="80">
            <template slot-scope="scope">
              <span :class="{ 'low-stock': scope.row.stock <= 10, 'out-of-stock': scope.row.stock === 0 }">
                {{ scope.row.stock }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="80">
            <template slot-scope="scope">
              ¥{{ scope.row.price }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 💰 财务统计 -->
    <div class="financial-section">
      <div class="financial-header">
        <h3>财务统计</h3>
        <el-date-picker
          v-model="financialDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="loadFinancialData"
          size="small">
        </el-date-picker>
      </div>
      
      <div class="financial-cards">
        <div class="financial-card">
          <div class="financial-label">日销售额</div>
          <div class="financial-value">¥{{ formatNumber(financial.dailySales) }}</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">日订单数</div>
          <div class="financial-value">{{ financial.dailyOrders }}</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">平均订单金额</div>
          <div class="financial-value">¥{{ formatNumber(financial.avgOrderAmount) }}</div>
        </div>
        <div class="financial-card">
          <div class="financial-label">预估利润</div>
          <div class="financial-value">¥{{ formatNumber(financial.estimatedProfit) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {
  reqDashboardOverview,
  reqSalesStatistics,
  reqInventoryStatistics,
  reqFinancialStatistics,
  reqRecentOrders,
  reqLowStockAlerts
} from '../../api/dashboard';

export default {
  name: "EnhancedDashboard",
  
  data() {
    return {
      overview: {
        todaySales: 0,
        todayOrders: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalBooks: 0,
        monthlyNewUsers: 0,
        pendingOrders: 0,
        salesGrowthRate: 0
      },
      salesPeriod: '7',
      salesChart: null,
      inventoryChart: null,
      recentOrders: [],
      lowStockAlerts: [],
      financial: {
        dailySales: 0,
        dailyOrders: 0,
        avgOrderAmount: 0,
        estimatedProfit: 0
      },
      financialDateRange: null,
      loading: false
    };
  },

  mounted() {
    this.initDashboard();
  },

  methods: {
    async initDashboard() {
      this.loading = true;
      try {
        await Promise.all([
          this.loadOverviewData(),
          this.loadSalesData(),
          this.loadInventoryData(),
          this.loadRecentOrders(),
          this.loadLowStockAlerts(),
          this.loadFinancialData()
        ]);
      } catch (error) {
        console.error('加载仪表盘数据失败:', error);
        this.$message.error('加载仪表盘数据失败');
      } finally {
        this.loading = false;
      }
    },

    async loadOverviewData() {
      try {
        console.log('开始加载概览数据...');
        const response = await reqDashboardOverview();
        console.log('概览数据响应:', response);
        if (response && response.code === 200) {
          // 直接使用response，不需要response.data
          this.overview = { ...this.overview, ...response };
          console.log('概览数据更新成功:', this.overview);
        } else {
          console.error('概览数据响应格式错误:', response);
        }
      } catch (error) {
        console.error('加载概览数据失败:', error);
      }
    },

    async loadSalesData() {
      try {
        const response = await reqSalesStatistics(parseInt(this.salesPeriod));
        if (response && response.code === 200) {
          this.renderSalesChart(response);
        } else {
          console.error('销售数据响应格式错误:', response);
          // 使用默认数据
          this.renderSalesChart({
            dateLabels: [],
            orderCounts: [],
            salesAmounts: []
          });
        }
      } catch (error) {
        console.error('加载销售数据失败:', error);
        // 使用默认数据
        this.renderSalesChart({
          dateLabels: [],
          orderCounts: [],
          salesAmounts: []
        });
      }
    },

    async loadInventoryData() {
      try {
        const response = await reqInventoryStatistics();
        if (response && response.code === 200) {
          this.renderInventoryChart(response);
        } else {
          console.error('库存数据响应格式错误:', response);
          // 使用默认数据
          this.renderInventoryChart({
            normalStockCount: 0,
            lowStockCount: 0,
            outOfStockCount: 0
          });
        }
      } catch (error) {
        console.error('加载库存数据失败:', error);
        // 使用默认数据
        this.renderInventoryChart({
          normalStockCount: 0,
          lowStockCount: 0,
          outOfStockCount: 0
        });
      }
    },

    async loadRecentOrders() {
      try {
        const response = await reqRecentOrders(5);
        if (response && response.code === 200) {
          this.recentOrders = response.orders || [];
        } else {
          console.error('最新订单响应格式错误:', response);
          this.recentOrders = [];
        }
      } catch (error) {
        console.error('加载最新订单失败:', error);
        this.recentOrders = [];
      }
    },

    async loadLowStockAlerts() {
      try {
        const response = await reqLowStockAlerts(10);
        if (response && response.code === 200) {
          this.lowStockAlerts = response.books || [];
        } else {
          console.error('库存预警响应格式错误:', response);
          this.lowStockAlerts = [];
        }
      } catch (error) {
        console.error('加载库存预警失败:', error);
        this.lowStockAlerts = [];
      }
    },

    async loadFinancialData() {
      try {
        let startDate = null;
        let endDate = null;

        if (this.financialDateRange && this.financialDateRange.length === 2) {
          startDate = this.formatDate(this.financialDateRange[0]);
          endDate = this.formatDate(this.financialDateRange[1]);
        }

        const response = await reqFinancialStatistics(startDate, endDate);
        if (response && response.code === 200) {
          this.financial = { ...this.financial, ...response };
        }
      } catch (error) {
        console.error('加载财务数据失败:', error);
      }
    },

    renderSalesChart(data) {
      this.$nextTick(() => {
        if (!this.salesChart) {
          this.salesChart = echarts.init(document.getElementById('salesChart'));
        }

        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: ['订单数量', '销售额']
          },
          xAxis: {
            type: 'category',
            data: data.dateLabels || []
          },
          yAxis: [
            {
              type: 'value',
              name: '订单数量',
              position: 'left'
            },
            {
              type: 'value',
              name: '销售额',
              position: 'right'
            }
          ],
          series: [
            {
              name: '订单数量',
              type: 'line',
              data: data.orderCounts || [],
              smooth: true,
              itemStyle: { color: '#409EFF' }
            },
            {
              name: '销售额',
              type: 'line',
              yAxisIndex: 1,
              data: data.salesAmounts || [],
              smooth: true,
              itemStyle: { color: '#67C23A' }
            }
          ]
        };

        this.salesChart.setOption(option);
      });
    },

    renderInventoryChart(data) {
      this.$nextTick(() => {
        if (!this.inventoryChart) {
          this.inventoryChart = echarts.init(document.getElementById('inventoryChart'));
        }

        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}本 ({d}%)<br/>阈值说明：<br/>• 缺货: 库存=0<br/>• 库存紧张: 0<库存≤20<br/>• 正常库存: 库存>20'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            top: 30,
            itemWidth: 12,
            itemHeight: 12,
            textStyle: {
              fontSize: 12
            },
            data: [
              { name: '正常库存', icon: 'circle' },
              { name: '库存紧张', icon: 'circle' },
              { name: '缺货', icon: 'circle' }
            ]
          },
          series: [
            {
              name: '库存分布',
              type: 'pie',
              radius: ['35%', '55%'],
              center: ['65%', '50%'], // 进一步向右移动
              avoidLabelOverlap: true,
              label: {
                show: false // 隐藏外部标签，避免重叠
              },
              labelLine: {
                show: false
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 14,
                  fontWeight: 'bold',
                  formatter: '{b}\n{c}本 ({d}%)'
                }
              },
              data: [
                { value: data.normalStockCount || 0, name: '正常库存', itemStyle: { color: '#67C23A' } },
                { value: data.lowStockCount || 0, name: '库存紧张', itemStyle: { color: '#E6A23C' } },
                { value: data.outOfStockCount || 0, name: '缺货', itemStyle: { color: '#F56C6C' } }
              ]
            }
          ]
        };

        this.inventoryChart.setOption(option);
      });
    },

    formatNumber(num) {
      if (num === null || num === undefined) return '0';
      return Number(num).toLocaleString();
    },

    formatDate(date) {
      if (!date) return null;
      const d = new Date(date);
      return d.getFullYear() + '-' + 
             String(d.getMonth() + 1).padStart(2, '0') + '-' + 
             String(d.getDate()).padStart(2, '0');
    },

    formatDateTime(dateTime) {
      if (!dateTime) return '';
      const date = new Date(dateTime);
      return date.getFullYear() + '-' + 
             String(date.getMonth() + 1).padStart(2, '0') + '-' + 
             String(date.getDate()).padStart(2, '0') + ' ' +
             String(date.getHours()).padStart(2, '0') + ':' + 
             String(date.getMinutes()).padStart(2, '0');
    },

    getOrderStatusType(status) {
      const statusMap = {
        '待付款': 'warning',
        '待发货': 'primary',
        '已发货': 'success',
        '已收货': 'success',
        '已评价': 'info',
        '已取消': 'danger'
      };
      return statusMap[status] || 'info';
    }
  },

  beforeDestroy() {
    if (this.salesChart) {
      this.salesChart.dispose();
    }
    if (this.inventoryChart) {
      this.inventoryChart.dispose();
    }
  }
};
</script>

<style scoped>
.enhanced-dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 📊 核心指标卡片样式 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.metric-card.sales .metric-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.metric-card.orders .metric-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.metric-card.users .metric-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.metric-card.inventory .metric-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.metric-content h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.metric-change {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.metric-change.positive { color: #67C23A; }
.metric-change.negative { color: #F56C6C; }

.metric-subtitle {
  font-size: 12px;
  color: #999;
}

/* 📈 图表区域样式 */
.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.chart-content {
  height: 300px;
}

/* 📋 数据表格区域样式 */
.tables-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  min-height: 400px; /* 确保表格区域有足够高度 */
}

.table-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 防止内容溢出 */
  max-height: 400px; /* 限制最大高度 */
  display: flex;
  flex-direction: column;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

/* 表格内容区域 */
.el-table {
  flex: 1;
  overflow-y: auto; /* 允许表格内容滚动 */
}

.low-stock {
  color: #E6A23C;
  font-weight: bold;
}

.out-of-stock {
  color: #F56C6C;
  font-weight: bold;
}

/* 💰 财务统计样式 */
.financial-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.financial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.financial-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.financial-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.financial-card {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
}

.financial-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.financial-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .tables-section {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .table-container {
    max-height: 350px;
  }
}

@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
  }

  .tables-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .enhanced-dashboard {
    padding: 10px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .financial-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-container {
    padding: 16px;
    max-height: 300px;
  }
}
</style>
