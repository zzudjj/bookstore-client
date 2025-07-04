<template>
  <!-- ⚡ 现代化秒杀页面 -->
  <div class="modern-spike-page">
    <!-- 🧭 导航栏 -->
    <Nav></Nav>
    
    <!-- ⚡ 秒杀主体区域 -->
    <main class="spike-main">
      <div class="container">
        
        <!-- 🍞 面包屑导航 -->
        <div class="breadcrumb-nav">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
              <i class="el-icon-house"></i>
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <i class="el-icon-lightning"></i>
              限时秒杀
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <!-- 🎯 秒杀头部横幅 -->
        <div class="spike-header">
          <div class="header-content">
            <div class="header-left">
              <div class="spike-logo">
                <i class="el-icon-lightning"></i>
              </div>
              <div class="header-text">
                <h1 class="spike-title">限时秒杀</h1>
                <p class="spike-subtitle">精选好书，限时抢购，错过再等一天！</p>
              </div>
            </div>
            <div class="header-right">
              <div class="countdown-section">
                <div class="countdown-label">{{ countdownLabel }}</div>
                <div class="countdown-timer">
                  <div class="time-block">
                    <span class="time-value">{{ countdown.hours }}</span>
                    <span class="time-unit">时</span>
                  </div>
                  <div class="time-separator">:</div>
                  <div class="time-block">
                    <span class="time-value">{{ countdown.minutes }}</span>
                    <span class="time-unit">分</span>
                  </div>
                  <div class="time-separator">:</div>
                  <div class="time-block">
                    <span class="time-value">{{ countdown.seconds }}</span>
                    <span class="time-unit">秒</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 📅 秒杀时段选择 -->
        <div class="spike-schedule">
          <div class="schedule-header">
            <h3>
              <i class="el-icon-time"></i>
              秒杀时段
            </h3>
            <div class="schedule-tips">
              <i class="el-icon-info"></i>
              每个时段限量抢购，售完即止
            </div>
          </div>
          
          <div class="time-slots">
            <div 
              v-for="(spike, index) in spikeList" 
              :key="index"
              class="time-slot"
              :class="{ 
                'active': activeName == index,
                'upcoming': spike.status === 'upcoming',
                'ongoing': spike.status === 'ongoing',
                'ended': spike.status === 'ended'
              }"
              @click="selectTimeSlot(index)">
              
              <div class="slot-time">{{ spike.startTime }}</div>
              <div class="slot-name">{{ spike.spikeName }}</div>
              <div class="slot-status">
                <span v-if="spike.status === 'upcoming'" class="status-upcoming">
                  <i class="el-icon-time"></i>
                  即将开始
                </span>
                <span v-else-if="spike.status === 'ongoing'" class="status-ongoing">
                  <i class="el-icon-lightning"></i>
                  抢购中
                </span>
                <span v-else class="status-ended">
                  <i class="el-icon-circle-close"></i>
                  已结束
                </span>
              </div>
              <div class="slot-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: spike.progress + '%' }"></div>
                </div>
                <div class="progress-text">已抢{{ spike.progress }}%</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 📚 秒杀商品列表 -->
        <div class="spike-products">
          <div class="products-header">
            <h3>
              <i class="el-icon-goods"></i>
              秒杀商品
            </h3>
            <div class="view-options">
              <el-button-group>
                <el-button 
                  :type="viewMode === 'grid' ? 'primary' : 'default'"
                  icon="el-icon-menu"
                  size="small"
                  @click="viewMode = 'grid'">
                  网格
                </el-button>
                <el-button 
                  :type="viewMode === 'list' ? 'primary' : 'default'"
                  icon="el-icon-s-unfold"
                  size="small"
                  @click="viewMode = 'list'">
                  列表
                </el-button>
              </el-button-group>
            </div>
          </div>
          
          <!-- 📦 商品网格视图 -->
          <div v-if="viewMode === 'grid'" class="products-grid">
            <div 
              v-for="book in currentSpikeBooks" 
              :key="book.id"
              class="product-card"
              :class="{ 'sold-out': book.stock <= 0 }">
              
              <!-- 📷 商品图片 -->
              <div class="product-image">
                <el-image
                  :src="getBookCoverUrl(book.coverImg) || imgS"
                  fit="cover"
                  class="book-cover"
                  :alt="book.name">
                  <div slot="error" class="image-error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                
                <!-- 🏷️ 秒杀标签 -->
                <div class="spike-badge">
                  <i class="el-icon-lightning"></i>
                  秒杀
                </div>
                
                <!-- 📊 库存进度 -->
                <div class="stock-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: ((book.totalStock - book.stock) / book.totalStock * 100) + '%' }">
                    </div>
                  </div>
                  <div class="stock-text">
                    仅剩{{ book.stock }}件
                  </div>
                </div>
              </div>
              
              <!-- 📝 商品信息 -->
              <div class="product-info">
                <h4 class="product-title">{{ book.name }}</h4>
                <p class="product-author">{{ book.author }}</p>
                
                <!-- 💰 价格信息 -->
                <div class="price-section">
                  <div class="spike-price">
                    <span class="currency">¥</span>
                    <span class="price-value">{{ book.spikePrice }}</span>
                  </div>
                  <div class="original-price">¥{{ book.price }}</div>
                  <div class="discount-badge">
                    {{ Math.round((book.spikePrice / book.price) * 10) }}折
                  </div>
                </div>
                
                <!-- 🛒 购买按钮 -->
                <div class="action-section">
                  <el-button
                    type="danger"
                    size="medium"
                    :disabled="book.stock <= 0"
                    @click="spikeBook(book)"
                    class="spike-btn">
                    <i class="el-icon-lightning"></i>
                    <span v-if="book.stock > 0">立即秒杀</span>
                    <span v-else>已售罄</span>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 📭 空状态 -->
          <div v-if="!currentSpikeBooks || currentSpikeBooks.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="el-icon-box"></i>
            </div>
            <h3 class="empty-title">暂无秒杀商品</h3>
            <p class="empty-description">
              当前时段暂无秒杀商品，请选择其他时段或稍后再来
            </p>
          </div>
        </div>
        
      </div>
    </main>
    
    <!-- 🦶 页脚 -->
    <Footer></Footer>
  </div>
</template>

<script>
import Nav from "../../components/Common/BaseNavigation";
import Footer from "../../components/Common/BaseFooter";
import {getBookCoverUrl} from "../../utils/imageUtils";

export default {
  name: "Spike",
  components: { Nav, Footer },
  
  data() {
    return {
      activeName: 0,
      imgS: require('../../assets/image/bookdefault.jpg'),
      viewMode: 'grid', // 'grid' 或 'list'
      countdownTimer: null,
      countdownLabel: '距离下场结束',
      countdown: {
        hours: '--',
        minutes: '--',
        seconds: '--'
      },
      targetTime: null, // 目标时间

      spikeList: [], // 改为空数组，从API获取数据
      loading: false,
      error: null
    };
  },

  computed: {
    // 当前选中时段的商品
    currentSpikeBooks() {
      if (this.spikeList[this.activeName]) {
        return this.spikeList[this.activeName].bookList || [];
      }
      return [];
    }
  },

  methods: {
    // 加载秒杀活动列表
    async loadSpikeList() {
      try {
        this.loading = true;
        this.error = null;

        const response = await this.$http.get('/api/spike/list');

        if (response.data.code === 200) {
          // 处理后端返回的数据，转换为前端需要的格式
          this.spikeList = this.formatSpikeData(response.data.data);
          // 重新计算倒计时
          this.calculateNextTarget();
        } else {
          this.error = response.data.message || '获取秒杀活动失败';
          this.$message.error(this.error);
        }
      } catch (error) {
        console.error('加载秒杀活动失败:', error);
        this.error = '网络错误，请稍后重试';
        this.$message.error(this.error);

        // 如果API调用失败，使用备用数据
        this.loadFallbackData();
      } finally {
        this.loading = false;
      }
    },

    // 格式化后端数据为前端需要的格式
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
          startTime: activity.startTimeStr || this.formatTime(activity.startTime),
          endTime: activity.endTimeStr || this.formatTime(activity.endTime),
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
            stock: goods.spikeStock || 0, // 当前剩余库存（后端已修复，直接使用spikeStock）
            totalStock: (goods.spikeStock || 0) + (goods.soldCount || 0), // 初始总库存 = 当前库存 + 已售数量
            coverImg: goods.coverImg || (goods.book && goods.book.coverImg) || this.imgS
          }))
        };
      });
    },

    // 状态映射
    mapStatus(status) {
      const statusMap = {
        0: 'upcoming',  // 未开始
        1: 'ongoing',   // 进行中
        2: 'ended',     // 已结束
        3: 'cancelled'  // 已取消
      };
      return statusMap[status] || 'unknown';
    },

    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '';
      const date = new Date(timeStr);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },

    // 备用数据（API失败时使用）
    loadFallbackData() {
      this.spikeList = [
        {
          spikeName: "系统维护中",
          startTime: "00:00",
          status: "ended",
          progress: 0,
          bookList: []
        }
      ];
    },

    // 选择时段
    selectTimeSlot(index) {
      this.activeName = index;
    },

    // 秒杀商品
    async spikeBook(book) {
      if (book.stock <= 0) {
        this.$message({
          type: 'warning',
          message: '商品已售罄'
        });
        return;
      }

      try {
        await this.$confirm(`确定要秒杀《${book.name}》吗？`, '秒杀确认', {
          confirmButtonText: '立即秒杀',
          cancelButtonText: '取消',
          type: 'warning'
        });

        // 调用真实的秒杀API
        const response = await this.$http.post('/api/spike/spikeBook', {
          id: book.id,
          quantity: 1
        });

        if (response.data.code === 200) {
          this.$message({
            type: 'success',
            message: '秒杀成功！正在跳转到支付页面...'
          });

          // 刷新数据
          await this.loadSpikeList();

          // 跳转到支付页面
          setTimeout(() => {
            this.$router.push({
              path: '/buyPage',
              query: {
                orderId: response.data.data.orderId,
                type: 'spike'
              }
            });
          }, 1500);

        } else {
          this.$message({
            type: 'error',
            message: response.data.message || '秒杀失败'
          });
        }

      } catch (error) {
        if (error === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消秒杀'
          });
        } else {
          console.error('秒杀请求失败:', error);
          this.$message({
            type: 'error',
            message: '网络错误，请稍后重试'
          });
        }
      }
    },

    // 更新倒计时显示
    updateCountdownDisplay() {
      if (!this.targetTime) {
        // 没有目标时间，显示横杠
        this.countdown.hours = '--';
        this.countdown.minutes = '--';
        this.countdown.seconds = '--';
        return;
      }

      const now = new Date();
      const diff = this.targetTime - now;

      if (diff <= 0) {
        // 时间到了，重新计算下一个目标时间
        this.calculateNextTarget();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.countdown.hours = hours.toString().padStart(2, '0');
      this.countdown.minutes = minutes.toString().padStart(2, '0');
      this.countdown.seconds = seconds.toString().padStart(2, '0');
    },

    // 计算下一个目标时间
    calculateNextTarget() {
      if (!this.spikeList || this.spikeList.length === 0) {
        this.targetTime = null;
        this.countdownLabel = '暂无活动';
        return;
      }

      const now = new Date();
      let ongoingActivity = null;
      let upcomingActivity = null;

      // 查找正在进行的活动和即将开始的活动
      for (const activity of this.spikeList) {
        const startTime = new Date(activity.startTimeRaw || activity.startTime);
        const endTime = new Date(activity.endTimeRaw || activity.endTime);

        if (now >= startTime && now < endTime) {
          // 正在进行的活动
          ongoingActivity = activity;
          break;
        } else if (now < startTime) {
          // 即将开始的活动
          if (!upcomingActivity || startTime < new Date(upcomingActivity.startTimeRaw || upcomingActivity.startTime)) {
            upcomingActivity = activity;
          }
        }
      }

      if (ongoingActivity) {
        // 有正在进行的活动，倒计时到结束时间
        this.targetTime = new Date(ongoingActivity.endTimeRaw || ongoingActivity.endTime);
        this.countdownLabel = '距离本场结束';
      } else if (upcomingActivity) {
        // 没有正在进行的活动，但有即将开始的活动
        this.targetTime = new Date(upcomingActivity.startTimeRaw || upcomingActivity.startTime);
        this.countdownLabel = '距离下场开始';
      } else {
        // 没有任何活动
        this.targetTime = null;
        this.countdownLabel = '暂无活动';
      }
    },

    // 启动倒计时
    startCountdown() {
      // 先计算目标时间
      this.calculateNextTarget();

      // 启动定时器
      this.countdownTimer = setInterval(() => {
        this.updateCountdownDisplay();
      }, 1000);
    },

    // 标签页点击（兼容旧版本）
    handleClick() {
      // 处理标签页切换
    },

    // 获取图书封面完整URL
    getBookCoverUrl(coverImg) {
      return getBookCoverUrl(coverImg);
    }
  },

  async mounted() {
    this.startCountdown();
    // 加载秒杀活动数据
    await this.loadSpikeList();
  },

  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }
};
</script>

<style scoped>
/* ⚡ 现代化秒杀页面样式 */

.modern-spike-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

/* 📦 通用容器 */
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 🎯 秒杀主体 */
.spike-main {
  padding: 30px 0 60px;
}

/* 🍞 面包屑导航 */
.breadcrumb-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 15px 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.breadcrumb-nav .el-breadcrumb {
  font-size: 14px;
}

.breadcrumb-nav .el-breadcrumb__item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.breadcrumb-nav i {
  font-size: 16px;
  color: #ff6b6b;
}

/* 🎯 秒杀头部横幅 */
.spike-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 25px;
}

.spike-logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  animation: pulse 2s infinite;
}

.spike-logo i {
  font-size: 36px;
  color: white;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
  }
}

.header-text {
  flex: 1;
}

.spike-title {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.spike-subtitle {
  font-size: 18px;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
}

/* ⏰ 倒计时区域 */
.header-right {
  text-align: center;
}

.countdown-section {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 15px;
  padding: 25px;
  color: white;
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3);
}

.countdown-label {
  font-size: 14px;
  color: #bdc3c7;
  margin-bottom: 15px;
  font-weight: 500;
}

.countdown-timer {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.time-block {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 8px;
  min-width: 50px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.time-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  color: #ff6b6b;
}

.time-unit {
  display: block;
  font-size: 12px;
  color: #bdc3c7;
  margin-top: 2px;
}

.time-separator {
  font-size: 20px;
  font-weight: 700;
  color: #ff6b6b;
}

/* 📅 秒杀时段选择 */
.spike-schedule {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.schedule-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.schedule-header i {
  color: #ff6b6b;
  font-size: 22px;
}

.schedule-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7f8c8d;
  font-size: 14px;
}

.schedule-tips i {
  color: #3498db;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.time-slot {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.time-slot::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.1), transparent);
  transition: left 0.5s ease;
}

.time-slot:hover::before {
  left: 100%;
}

.time-slot:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.time-slot.active {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-color: #ff6b6b;
  color: white;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
}

.time-slot.upcoming {
  border-color: #3498db;
}

.time-slot.ongoing {
  border-color: #27ae60;
  background: linear-gradient(135deg, rgba(39, 174, 96, 0.1) 0%, rgba(46, 204, 113, 0.1) 100%);
}

.time-slot.ended {
  opacity: 0.6;
  cursor: not-allowed;
}

.slot-time {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.slot-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.slot-status {
  margin-bottom: 15px;
}

.status-upcoming {
  color: #3498db;
  font-size: 14px;
  font-weight: 500;
}

.status-ongoing {
  color: #27ae60;
  font-size: 14px;
  font-weight: 500;
  animation: blink 1.5s infinite;
}

.status-ended {
  color: #95a5a6;
  font-size: 14px;
  font-weight: 500;
}

.time-slot.active .status-upcoming,
.time-slot.active .status-ongoing,
.time-slot.active .status-ended {
  color: rgba(255, 255, 255, 0.9);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.5; }
}

.slot-progress {
  margin-top: 10px;
}

.progress-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.time-slot.active .progress-bar {
  background: rgba(255, 255, 255, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  transition: width 0.3s ease;
}

.time-slot.active .progress-fill {
  background: rgba(255, 255, 255, 0.8);
}

.progress-text {
  font-size: 12px;
  color: #7f8c8d;
  text-align: center;
}

.time-slot.active .progress-text {
  color: rgba(255, 255, 255, 0.9);
}

/* 📚 秒杀商品列表 */
.spike-products {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.products-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.products-header i {
  color: #ff6b6b;
  font-size: 22px;
}

/* 📦 商品网格视图 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #ff6b6b;
}

.product-card.sold-out {
  opacity: 0.6;
  filter: grayscale(50%);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f5f5f5;
  color: #999;
  font-size: 48px;
}

.spike-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 10px rgba(255, 107, 107, 0.4);
}

.stock-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  font-size: 12px;
}

.stock-progress .progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.stock-progress .progress-fill {
  height: 100%;
  background: #ff6b6b;
}

.stock-text {
  text-align: center;
  font-weight: 500;
}

.product-info {
  padding: 20px;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-author {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0 0 15px 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.spike-price {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency {
  font-size: 14px;
  color: #ff6b6b;
  font-weight: 600;
}

.price-value {
  font-size: 24px;
  font-weight: 700;
  color: #ff6b6b;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 14px;
}

.discount-badge {
  background: #ff6b6b;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.action-section {
  margin-top: 15px;
}

.spike-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border: none;
}

.spike-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.spike-btn:disabled {
  background: #bdc3c7;
  transform: none;
  box-shadow: none;
}

/* 📭 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 40px;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-icon i {
  font-size: 64px;
  color: #bdc3c7;
}

.empty-title {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.empty-description {
  margin: 0;
  color: #7f8c8d;
  line-height: 1.6;
}

/* 📱 响应式设计 */
@media (max-width: 1200px) {
  .container {
    padding: 0 15px;
  }

  .header-content {
    gap: 30px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .spike-main {
    padding: 20px 0 40px;
  }

  .spike-header {
    padding: 30px 20px;
  }

  .header-content {
    flex-direction: column;
    gap: 25px;
    text-align: center;
  }

  .header-left {
    flex-direction: column;
    gap: 20px;
  }

  .spike-logo {
    width: 60px;
    height: 60px;
  }

  .spike-logo i {
    font-size: 28px;
  }

  .spike-title {
    font-size: 28px;
  }

  .spike-subtitle {
    font-size: 16px;
  }

  .countdown-section {
    padding: 20px;
  }

  .time-slots {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }

  .products-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }

  .spike-header {
    padding: 20px 15px;
  }

  .spike-title {
    font-size: 24px;
  }

  .countdown-timer {
    gap: 8px;
  }

  .time-block {
    min-width: 40px;
    padding: 8px 6px;
  }

  .time-value {
    font-size: 20px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-card {
    margin: 0 auto;
    max-width: 300px;
  }
}

/* 🎬 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spike-header {
  animation: fadeInUp 0.6s ease-out;
}

.spike-schedule {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.spike-products {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

/* Element UI 组件样式覆盖 */
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  color: #ff6b6b !important;
  font-weight: 500;
}

.el-breadcrumb__inner a:hover,
.el-breadcrumb__inner.is-link:hover {
  color: #ee5a24 !important;
}

.el-breadcrumb__separator {
  color: #bdc3c7 !important;
}

.el-button-group .el-button {
  border-radius: 6px !important;
}

.el-button-group .el-button:first-child {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.el-button-group .el-button:last-child {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>
