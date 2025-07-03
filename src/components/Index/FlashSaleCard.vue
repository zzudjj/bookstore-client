<template>
  <div class="flash-sale-section">
    <!-- 📊 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="2" animated />
      <div class="loading-cards">
        <el-skeleton-item v-for="i in 4" :key="i" variant="image" class="skeleton-card" />
      </div>
    </div>

    <!-- ⚠️ 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <i class="el-icon-warning-outline"></i>
      </div>
      <p class="error-message">{{ error }}</p>
      <el-button size="small" @click="loadSpikeData">重试</el-button>
    </div>

    <!-- 📭 空状态 -->
    <div v-else-if="!spikeBooks || spikeBooks.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="el-icon-lightning"></i>
      </div>
      <h3 class="empty-title">暂无秒杀活动</h3>
      <p class="empty-description">敬请期待下次精彩的秒杀活动！</p>
      <router-link to="/spike" class="empty-link">
        <el-button type="primary" size="small">
          <i class="el-icon-view"></i>
          查看往期活动
        </el-button>
      </router-link>
    </div>

    <!-- 🎯 秒杀商品展示 -->
    <div v-else class="spike-showcase">
      <!-- 🏷️ 活动头部 -->
      <div class="spike-header">
        <div class="header-left">
          <div class="spike-badge" :class="currentActivity ? currentActivity.status : ''">
            <i class="el-icon-lightning"></i>
            <span v-if="currentActivity && currentActivity.status === 'upcoming'">即将开始</span>
            <span v-else-if="currentActivity && currentActivity.status === 'ongoing'">限时秒杀</span>
            <span v-else-if="currentActivity && currentActivity.status === 'ended'">已结束</span>
            <span v-else>限时秒杀</span>
          </div>
          <div class="activity-info" v-if="currentActivity">
            <span class="activity-name">{{ currentActivity.spikeName }}</span>
            <span class="activity-time">{{ formatActivityTime(currentActivity) }}</span>
          </div>
        </div>
        <div class="header-right">
          <router-link to="/spike" class="view-more-btn">
            <span>进入秒杀会场</span>
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
      </div>

      <!-- 📚 商品卡片列表 -->
      <div class="spike-cards">
        <div
          v-for="book in displayBooks"
          :key="book.id"
          class="spike-card"
          @click="goToBookDetail(book)">

          <!-- 📷 商品图片 -->
          <div class="card-image">
            <el-image
              :src="getBookCoverUrl(book.coverImg)"
              fit="cover"
              class="book-cover"
              :alt="book.name">
              <div slot="error" class="image-error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>

            <!-- 🏷️ 秒杀标签 -->
            <div class="spike-tag">
              <i class="el-icon-lightning"></i>
              <span>秒杀</span>
            </div>

            <!-- 📊 库存进度条 -->
            <div class="stock-progress" v-if="book.stock">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: getStockProgress(book) + '%' }">
                </div>
              </div>
              <div class="progress-text">仅剩{{ book.stock }}件</div>
            </div>
          </div>

          <!-- 📝 商品信息 -->
          <div class="card-content">
            <h4 class="book-title">{{ book.name }}</h4>
            <p class="book-author">{{ book.author }}</p>

            <!-- 💰 价格信息 -->
            <div class="price-section">
              <div class="spike-price">
                <span class="currency">¥</span>
                <span class="price-value">{{ book.spikePrice || book.price }}</span>
              </div>
              <div class="original-price" v-if="book.spikePrice && book.spikePrice < book.price">
                ¥{{ book.price }}
              </div>
              <div class="discount-badge" v-if="book.spikePrice && book.spikePrice < book.price">
                {{ Math.round((book.spikePrice / book.price) * 10) }}折
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBookCoverUrl } from '../../utils/imageUtils'

export default {
  name: "FlashSaleCard",

  data() {
    return {
      loading: false,
      error: null,
      spikeActivities: [],
      spikeBooks: [],
      currentActivity: null,
      maxDisplayCount: 4 // 最多显示4个商品
    }
  },

  computed: {
    // 显示的商品列表（最多4个）
    displayBooks() {
      return this.spikeBooks.slice(0, this.maxDisplayCount)
    }
  },

  mounted() {
    this.loadSpikeData()
  },

  methods: {
    // 加载秒杀数据（参考秒杀会场的实现）
    async loadSpikeData() {
      try {
        this.loading = true
        this.error = null

        const response = await this.$http.get('/api/spike/list')

        if (response.data.code === 200) {
          this.spikeActivities = response.data.data
          this.processSpikeData()
        } else {
          this.error = response.data.message || '获取秒杀活动失败'
        }
      } catch (error) {
        console.error('加载秒杀数据失败:', error)
        this.error = '网络错误，请稍后重试'

        // 使用备用数据
        this.loadFallbackData()
      } finally {
        this.loading = false
      }
    },

    // 处理秒杀数据（按照正确的优先级选择活动）
    processSpikeData() {
      if (!this.spikeActivities || this.spikeActivities.length === 0) {
        this.spikeBooks = []
        this.currentActivity = null
        return
      }

      // 使用秒杀会场相同的格式化逻辑
      const formattedActivities = this.formatSpikeData(this.spikeActivities)

      // 按照优先级选择活动：正在进行 > 即将开始 > 刚刚结束
      const targetActivity = this.selectBestActivity(formattedActivities)

      if (targetActivity) {
        this.currentActivity = targetActivity
        this.spikeBooks = targetActivity.bookList || []
      } else {
        this.currentActivity = null
        this.spikeBooks = []
      }
    },

    // 选择最佳活动进行展示
    selectBestActivity(activities) {
      if (!activities || activities.length === 0) {
        return null
      }

      let ongoingActivity = null
      let upcomingActivity = null
      let recentEndedActivity = null

      // 分类活动
      for (const activity of activities) {
        const startTime = new Date(activity.startTime)
        const endTime = new Date(activity.endTime)

        if (activity.status === 'ongoing') {
          // 正在进行的活动，直接选择
          ongoingActivity = activity
          break // 找到正在进行的就直接返回
        } else if (activity.status === 'upcoming') {
          // 即将开始的活动，选择离当前时间最近的
          if (!upcomingActivity || startTime < new Date(upcomingActivity.startTime)) {
            upcomingActivity = activity
          }
        } else if (activity.status === 'ended') {
          // 已结束的活动，选择刚刚结束的（结束时间最晚的）
          if (!recentEndedActivity || endTime > new Date(recentEndedActivity.endTime)) {
            recentEndedActivity = activity
          }
        }
      }

      // 优先级：正在进行 > 即将开始 > 刚刚结束
      return ongoingActivity || upcomingActivity || recentEndedActivity
    },

    // 格式化秒杀数据（完全复制秒杀现场页面的逻辑）
    formatSpikeData(activities) {
      return activities.map(activity => {
        // 计算进度
        let progress = 0;
        if (activity.spikeGoodsList && activity.spikeGoodsList.length > 0) {
          const totalStock = activity.spikeGoodsList.reduce((sum, goods) => sum + goods.spikeStock, 0);
          const soldCount = activity.spikeGoodsList.reduce((sum, goods) => sum + (goods.soldCount || 0), 0);
          progress = totalStock > 0 ? Math.round((soldCount / totalStock) * 100) : 0;
        }

        // 动态计算活动状态（基于时间而不是数据库status字段）
        const now = new Date();
        const startTime = new Date(activity.startTime);
        const endTime = new Date(activity.endTime);
        let dynamicStatus;
        if (now < startTime) {
          dynamicStatus = 'upcoming'; // 未开始
        } else if (now >= startTime && now < endTime) {
          dynamicStatus = 'ongoing';  // 进行中
        } else {
          dynamicStatus = 'ended';    // 已结束
        }

        return {
          id: activity.id,
          spikeName: activity.activityName,
          startTime: activity.startTime,
          endTime: activity.endTime,
          startTimeRaw: activity.startTime, // 保存原始时间用于倒计时计算
          endTimeRaw: activity.endTime,     // 保存原始时间用于倒计时计算
          status: dynamicStatus,            // 使用动态计算的状态
          dbStatus: activity.status,        // 保存数据库中的启用/禁用状态
          progress: progress,
          bookList: (activity.spikeGoodsList || []).map(goods => ({
            id: goods.bookId, // 使用bookId作为前端的id
            spikeGoodsId: goods.id, // 保存秒杀商品ID用于API调用
            name: goods.name || (goods.book && goods.book.bookName) || '未知商品',
            author: goods.author || (goods.book && goods.book.author) || '未知作者',
            price: goods.originalPrice,
            spikePrice: goods.spikePrice,
            stock: goods.spikeStock || 0, // 当前剩余库存
            totalStock: (goods.spikeStock || 0) + (goods.soldCount || 0), // 初始总库存
            coverImg: goods.coverImg || (goods.book && goods.book.coverImg)
          }))
        };
      });
    },



    // 备用数据（API失败时使用）
    loadFallbackData() {
      // 创建一个即将开始的活动示例
      const now = new Date()
      const startTime = new Date(now.getTime() + 30 * 60 * 1000) // 30分钟后开始
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // 持续2小时

      this.currentActivity = {
        spikeName: '每日精选秒杀',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: 'upcoming'
      }

      this.spikeBooks = [
        {
          id: 1,
          bookName: "JavaScript高级程序设计（第4版）",
          author: "马特·弗里斯比",
          price: 89.00,
          spikePrice: 59.90,
          spikeStock: 15,
          totalStock: 50,
          coverImg: null
        },
        {
          id: 2,
          bookName: "Vue.js实战",
          author: "梁灏",
          price: 79.00,
          spikePrice: 49.90,
          spikeStock: 8,
          totalStock: 30,
          coverImg: null
        },
        {
          id: 3,
          bookName: "深入理解计算机系统",
          author: "布莱恩特",
          price: 139.00,
          spikePrice: 99.90,
          spikeStock: 23,
          totalStock: 40,
          coverImg: null
        },
        {
          id: 4,
          bookName: "算法导论（原书第3版）",
          author: "托马斯·科尔曼",
          price: 128.00,
          spikePrice: 89.90,
          spikeStock: 12,
          totalStock: 25,
          coverImg: null
        }
      ]
    },

    // 格式化活动时间
    formatActivityTime(activity) {
      if (!activity) return ''

      const now = new Date()
      const startTime = new Date(activity.startTime)
      const endTime = new Date(activity.endTime)

      if (activity.status === 'upcoming') {
        const timeDiff = startTime - now
        const hours = Math.floor(timeDiff / (1000 * 60 * 60))
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

        if (hours > 0) {
          return `${hours}小时${minutes}分钟后开始`
        } else if (minutes > 0) {
          return `${minutes}分钟后开始`
        } else {
          return '即将开始'
        }
      } else if (activity.status === 'ongoing') {
        const timeDiff = endTime - now
        const hours = Math.floor(timeDiff / (1000 * 60 * 60))
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

        if (hours > 0) {
          return `进行中，${hours}小时${minutes}分钟后结束`
        } else if (minutes > 0) {
          return `进行中，${minutes}分钟后结束`
        } else {
          return '即将结束'
        }
      } else {
        return '已结束'
      }
    },

    // 格式化时间
    formatTime(date) {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    },

    // 计算库存进度（与秒杀会场保持一致）
    getStockProgress(book) {
      if (!book.stock || !book.totalStock) return 0
      const soldCount = book.totalStock - book.stock
      return Math.min(100, Math.max(0, (soldCount / book.totalStock) * 100))
    },

    // 获取图书封面URL
    getBookCoverUrl(coverImg) {
      return getBookCoverUrl(coverImg)
    },

    // 跳转到图书详情
    goToBookDetail(book) {
      this.$router.push({
        path: '/book',
        query: { id: book.bookId || book.id }
      })
    }
  }
}
</script>

<style scoped>
/* 🎨 现代化秒杀卡片样式 */

.flash-sale-section {
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.flash-sale-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* 📊 加载状态 */
.loading-state {
  padding: 24px;
}

.loading-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.skeleton-card {
  height: 280px;
  border-radius: 12px;
}

/* ⚠️ 错误状态 */
.error-state {
  padding: 40px 24px;
  text-align: center;
  color: #909399;
}

.error-icon {
  font-size: 48px;
  color: #f56c6c;
  margin-bottom: 16px;
}

.error-message {
  margin: 0 0 16px 0;
  font-size: 14px;
}

/* 📭 空状态 */
.empty-state {
  padding: 40px 24px;
  text-align: center;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  color: #e6a23c;
  margin-bottom: 16px;
}

.empty-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.empty-description {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #909399;
}

.empty-link {
  text-decoration: none;
}

/* 🎯 秒杀展示区域 */
.spike-showcase {
  padding: 0;
}

/* 🏷️ 活动头部 */
.spike-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.spike-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.spike-badge i {
  font-size: 16px;
  color: #ffd700;
}

/* 不同状态的徽章样式 */
.spike-badge.upcoming {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.spike-badge.upcoming i {
  color: #ffc107;
}

.spike-badge.ongoing {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.spike-badge.ongoing i {
  color: #ffd700;
}

.spike-badge.ended {
  background: rgba(108, 117, 125, 0.2);
  color: #6c757d;
}

.spike-badge.ended i {
  color: #6c757d;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-name {
  font-size: 16px;
  font-weight: 600;
}

.activity-time {
  font-size: 12px;
  opacity: 0.9;
}

.header-right {
  display: flex;
  align-items: center;
}

.view-more-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.view-more-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(2px);
}

/* 📚 商品卡片列表 */
.spike-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 24px;
}

/* 🎴 单个商品卡片 */
.spike-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  position: relative;
}

.spike-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #ff6b6b;
}

/* 📷 商品图片区域 */
.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.spike-card:hover .book-cover {
  transform: scale(1.05);
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f5f7fa;
  color: #c0c4cc;
  font-size: 24px;
}

/* 🏷️ 秒杀标签 */
.spike-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
}

.spike-tag i {
  font-size: 12px;
  color: #ffd700;
}

/* 📊 库存进度条 */
.stock-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ffd700);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  text-align: center;
  font-weight: 500;
}

/* 📝 商品信息区域 */
.card-content {
  padding: 16px;
}

.book-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 38px;
}

.book-author {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: #909399;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 💰 价格信息 */
.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.spike-price {
  display: flex;
  align-items: baseline;
  color: #ff6b6b;
  font-weight: 700;
}

.currency {
  font-size: 12px;
  margin-right: 2px;
}

.price-value {
  font-size: 18px;
}

.original-price {
  font-size: 12px;
  color: #c0c4cc;
  text-decoration: line-through;
}

.discount-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  white-space: nowrap;
}

/* 📱 响应式设计 */
@media (max-width: 1200px) {
  .spike-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .spike-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .spike-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 16px;
  }

  .card-image {
    height: 160px;
  }
}

@media (max-width: 480px) {
  .spike-cards {
    grid-template-columns: 1fr;
  }

  .card-image {
    height: 200px;
  }
}

/* 🎭 动画效果 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spike-card {
  animation: slideInUp 0.6s ease forwards;
}

.spike-card:nth-child(1) { animation-delay: 0.1s; }
.spike-card:nth-child(2) { animation-delay: 0.2s; }
.spike-card:nth-child(3) { animation-delay: 0.3s; }
.spike-card:nth-child(4) { animation-delay: 0.4s; }

/* 🔥 悬浮效果增强 */
.spike-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.spike-card:hover::before {
  opacity: 1;
}
</style>
