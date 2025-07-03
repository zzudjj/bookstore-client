<template>
  <div class="coupon-center">
    <div class="header">
      <h2>优惠券中心</h2>
    </div>

    <!-- 标签页 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="可领取" name="available">
        <div class="available-coupon-list">
          <div
            v-for="template in availableTemplates"
            :key="template.id"
            class="available-coupon-item">
            <!-- 左栏：名称和有效期 -->
            <div class="coupon-left-col">
              <h4 class="coupon-name">{{ template.name }}</h4>
              <p class="coupon-validity">有效期: {{ template.validDays }}天</p>
            </div>

            <!-- 中间栏：金额/折扣和使用条件 -->
            <div class="coupon-middle-col">
              <div class="coupon-amount-info">
                <span class="amount-text">{{ formatAmount(template) }}</span>
                <span class="amount-unit">{{ template.type === 1 ? '元' : '折' }}</span>
              </div>
              <p class="coupon-condition">{{ formatConditionDesc(template) }}</p>
            </div>

            <!-- 右栏：余量和领取按钮 -->
            <div class="coupon-right-col">
              <div class="remaining-count">剩余 {{ template.remainingQuantity }}</div>
              <el-button
                class="claim-button"
                size="small"
                @click="claimCoupon(template)"
                :disabled="template.remainingQuantity <= 0">
                {{ template.remainingQuantity <= 0 ? '已抢完' : '立即领取' }}
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="availableTemplates.length === 0" class="empty-state">
          <i class="el-icon-tickets"></i>
          <p>暂无可领取的优惠券</p>
        </div>
      </el-tab-pane>

      <el-tab-pane label="我的优惠券" name="my">
        <div class="filter-tabs">
          <el-radio-group v-model="couponFilter" @change="filterMyCoupons">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="unused">未使用</el-radio-button>
            <el-radio-button label="used">已使用</el-radio-button>
            <el-radio-button label="expired">已过期</el-radio-button>
          </el-radio-group>
        </div>

        <div class="coupon-list">
          <div
            v-for="coupon in filteredMyCoupons"
            :key="coupon.id"
            class="my-coupon-item"
            :class="getCouponClass(coupon)">
            <!-- 左栏：金额/折扣 -->
            <div class="my-coupon-left-col">
              <div class="my-coupon-amount-info">
                <span class="my-amount-text">{{ formatAmount(coupon) }}</span>
                <span class="my-amount-unit">{{ coupon.type === 1 ? '元' : '折' }}</span>
              </div>
              <p class="my-coupon-condition">{{ formatMyCouponConditionDesc(coupon) }}</p>
            </div>

            <!-- 中间栏：名称 -->
            <div class="my-coupon-middle-col">
              <h4 class="my-coupon-name">{{ coupon.couponName }}</h4>
            </div>

            <!-- 右栏：有效期 -->
            <div class="my-coupon-right-col">
              <div class="my-time-info">
                <span v-if="coupon.status === 1">
                  有效期至: {{ formatExpireDate(coupon.expireTime) }}
                </span>
                <span v-else-if="coupon.status === 2">
                  使用时间: {{ formatTime(coupon.useTime) }}
                </span>
                <span v-else>
                  已于 {{ formatExpireDate(coupon.expireTime) }} 过期
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="filteredMyCoupons.length === 0" class="empty-state">
          <i class="el-icon-tickets"></i>
          <p>{{ getEmptyMessage() }}</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { 
  getAvailableCouponTemplates, 
  getUserCoupons, 
  claimCoupon,
  formatRemainingTime,
  isExpiringSoon 
} from '@/api/coupon'

export default {
  name: 'CouponCenter',
  data() {
    return {
      activeTab: 'available',
      availableTemplates: [],
      myCoupons: [],
      filteredMyCoupons: [],
      couponFilter: 'all',
      loading: false
    }
  },
  mounted() {
    this.loadAvailableTemplates()
    this.loadMyCoupons()
  },
  methods: {
    async loadAvailableTemplates() {
      this.loading = true
      try {
        // 先获取可领取优惠券模板
        const templatesResponse = await getAvailableCouponTemplates()

        if (templatesResponse.data.code === 200) {
          let availableTemplates = templatesResponse.data.data

          // 尝试获取用户已领取的优惠券来过滤已达上限的优惠券
          try {
            const userCouponsResponse = await getUserCoupons()

            if (userCouponsResponse.data.code === 200) {
              const userCoupons = userCouponsResponse.data.data

              // 统计用户每个模板已领取的数量
              const userCouponCount = {}
              userCoupons.forEach(coupon => {
                const templateId = coupon.couponTemplateId
                userCouponCount[templateId] = (userCouponCount[templateId] || 0) + 1
              })

              // 过滤掉用户已达到领取上限的优惠券
              availableTemplates = availableTemplates.filter(template => {
                const userClaimedCount = userCouponCount[template.id] || 0
                const perUserLimit = template.perUserLimit || 999999 // 如果没有限制，设为很大的数
                const canClaim = userClaimedCount < perUserLimit

                // 调试信息（可选）
                if (!canClaim) {
                  console.log(`优惠券 "${template.name}" 已达到领取上限 (${userClaimedCount}/${perUserLimit})`)
                }

                return canClaim
              })
            } else {
              console.warn('获取用户优惠券失败，将显示所有可领取优惠券:', userCouponsResponse.data.message)
            }
          } catch (userCouponsError) {
            console.warn('获取用户优惠券时发生错误，将显示所有可领取优惠券:', userCouponsError)
          }

          this.availableTemplates = availableTemplates
        } else {
          this.$message.error('加载可领取优惠券失败: ' + (templatesResponse.data.message || '未知错误'))
        }
      } catch (error) {
        console.error('加载可领取优惠券失败:', error)
        this.$message.error('加载可领取优惠券失败')
      } finally {
        this.loading = false
      }
    },

    async loadMyCoupons() {
      try {
        const response = await getUserCoupons()
        if (response.data.code === 200) {
          this.myCoupons = response.data.data
          this.filterMyCoupons()
        } else {
          this.$message.error('加载我的优惠券失败')
        }
      } catch (error) {
        console.error('加载我的优惠券失败:', error)
        this.$message.error('加载我的优惠券失败')
      }
    },

    async claimCoupon(template) {
      try {
        const response = await claimCoupon(template.id)
        if (response.data.code === 200) {
          this.$message.success('领取成功！')
          this.loadAvailableTemplates()
          this.loadMyCoupons()
        } else {
          this.$message.error(response.data.message || '领取失败')
        }
      } catch (error) {
        console.error('领取优惠券失败:', error)
        this.$message.error('领取失败')
      }
    },

    handleTabClick(tab) {
      if (tab.name === 'my') {
        this.loadMyCoupons()
      } else if (tab.name === 'available') {
        this.loadAvailableTemplates()
      }
    },

    filterMyCoupons() {
      if (this.couponFilter === 'all') {
        this.filteredMyCoupons = this.myCoupons
      } else if (this.couponFilter === 'unused') {
        this.filteredMyCoupons = this.myCoupons.filter(c => c.status === 1)
      } else if (this.couponFilter === 'used') {
        this.filteredMyCoupons = this.myCoupons.filter(c => c.status === 2)
      } else if (this.couponFilter === 'expired') {
        this.filteredMyCoupons = this.myCoupons.filter(c => c.status === 3)
      }
    },

    formatAmount(item) {
      if (item.type === 1) {
        return item.discountValue
      } else {
        return (item.discountValue / 10).toFixed(1)
      }
    },

    formatExpireTime(expireTime) {
      if (isExpiringSoon(expireTime)) {
        return `即将过期: ${formatRemainingTime(expireTime)}`
      } else {
        return `有效期至: ${this.formatTime(expireTime)}`
      }
    },

    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return date.toLocaleString('zh-CN')
    },

    getCouponClass(coupon) {
      if (coupon.status === 3) return 'expired'
      if (coupon.status === 2) return 'used'
      if (isExpiringSoon(coupon.expireTime)) return 'expiring'
      return 'available'
    },

    getStatusType(status) {
      const typeMap = {
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      return typeMap[status] || 'default'
    },

    getEmptyMessage() {
      const messageMap = {
        all: '暂无优惠券',
        unused: '暂无未使用的优惠券',
        used: '暂无已使用的优惠券',
        expired: '暂无已过期的优惠券'
      }
      return messageMap[this.couponFilter] || '暂无优惠券'
    },

    formatExpireDate(dateTime) {
      if (!dateTime) return ''
      const date = new Date(dateTime)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    formatConditionDesc(template) {
      if (template.type === 1) {
        // 满减券：显示"满X元可用"
        return `满${template.minOrderAmount || 0}元可用`
      } else {
        // 折扣券：根据是否有门槛显示不同描述
        if (template.minOrderAmount && template.minOrderAmount > 0) {
          return `满${template.minOrderAmount}元可用`
        } else {
          return '无门槛'
        }
      }
    },

    formatMyCouponConditionDesc(coupon) {
      if (coupon.type === 1) {
        // 满减券：显示"满X元可用"
        return `满${coupon.minOrderAmount || 0}元可用`
      } else {
        // 折扣券：根据是否有门槛显示不同描述
        if (coupon.minOrderAmount && coupon.minOrderAmount > 0) {
          return `满${coupon.minOrderAmount}元可用`
        } else {
          return '无门槛'
        }
      }
    }
  }
}
</script>

<style scoped>
.coupon-center {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header h2 {
  margin: 0 0 20px 0;
  color: #303133;
}

/* 可领取优惠券列表样式 */
.available-coupon-list {
  margin-top: 20px;
}

.available-coupon-item {
  display: flex;
  align-items: center;
  /* 从浅灰色渐变到浅紫色 */
  background: linear-gradient(to right, #f5f5f5 0%, #e6e0ff 100%);
  color: #333;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.available-coupon-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 左栏样式 */
.coupon-left-col {
  flex: 1;
  padding-right: 20px;
}

.coupon-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.coupon-validity {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 中间栏样式 */
.coupon-middle-col {
  flex: 1;
  text-align: center;
  padding: 0 20px;
}

.coupon-amount-info {
  margin-bottom: 8px;
}

.amount-text {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.amount-unit {
  font-size: 16px;
  margin-left: 4px;
  color: #333;
}

.coupon-condition {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 右栏样式 */
.coupon-right-col {
  flex-shrink: 0;
  text-align: center;
  padding-left: 20px;
  min-width: 100px;
}

.remaining-count {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.claim-button {
  background-color: #87ceeb !important;
  border-color: #87ceeb !important;
  color: white !important;
  min-width: 80px;
}

.claim-button:hover {
  background-color: #6bb6d6 !important;
  border-color: #6bb6d6 !important;
}

.claim-button:disabled {
  background-color: #d3d3d3 !important;
  border-color: #d3d3d3 !important;
  color: #999 !important;
}





.filter-tabs {
  margin-bottom: 20px;
}

.coupon-list {
  space-y: 15px;
}

.coupon-item {
  display: flex;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.coupon-item.available {
  border-left: 4px solid #67c23a;
}

.coupon-item.expiring {
  border-left: 4px solid #e6a23c;
}

.coupon-item.used {
  border-left: 4px solid #909399;
  opacity: 0.7;
}

.coupon-item.expired {
  border-left: 4px solid #f56c6c;
  opacity: 0.5;
}

/* 我的优惠券新样式 */
.my-coupon-item {
  display: flex;
  align-items: center;
  /* 与可领取优惠券相同的渐变背景 */
  background: linear-gradient(to right, #f5f5f5 0%, #e6e0ff 100%);
  color: #333;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.my-coupon-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 不同状态的透明度调整 */
.my-coupon-item.used {
  opacity: 0.7;
}

.my-coupon-item.expired {
  opacity: 0.5;
}

/* 左栏样式 - 金额/折扣 */
.my-coupon-left-col {
  flex: 1;
  text-align: center;
  padding-right: 20px;
}

.my-coupon-amount-info {
  margin-bottom: 8px;
}

.my-amount-text {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.my-amount-unit {
  font-size: 16px;
  margin-left: 4px;
  color: #333;
}

.my-coupon-condition {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 中间栏样式 - 名称 */
.my-coupon-middle-col {
  flex: 1;
  text-align: center;
  padding: 0 20px;
}

.my-coupon-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 右栏样式 - 有效期 */
.my-coupon-right-col {
  flex: 1;
  text-align: center;
  padding-left: 20px;
}

.my-time-info {
  font-size: 14px;
  color: #666;
}



.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}
</style>
