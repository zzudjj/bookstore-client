<template>
  <div class="coupon-selector">
    <div v-if="isSpikeOrder" class="spike-order-notice">
      <i class="el-icon-warning"></i>
      <span>秒杀订单不支持使用优惠券</span>
    </div>
    <div v-else class="coupon-section">
      <div class="section-header" @click="showCouponDialog = true">
        <span class="label">优惠券</span>
        <div class="coupon-info">
          <span v-if="selectedCoupon" class="selected-coupon">
            {{ selectedCoupon.couponName }} -{{ formatDiscount(selectedCoupon) }}
          </span>
          <span v-else class="no-coupon">
            {{ availableCoupons.length > 0 ? '选择优惠券' : '暂无可用优惠券' }}
          </span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      
      <div v-if="selectedCoupon" class="discount-info">
        <span class="discount-amount">-¥{{ discountAmount.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 优惠券选择对话框 -->
    <el-dialog
      title="选择优惠券"
      :visible.sync="showCouponDialog"
      width="700px"
      class="coupon-dialog">
      
      <div v-if="loading" class="loading-state">
        <el-loading></el-loading>
      </div>
      
      <div v-else>
        <div class="order-info">
          <p>订单金额: ¥{{ orderAmount.toFixed(2) }}</p>
        </div>
        
        <el-radio-group v-model="selectedCouponId" class="coupon-list">
          <!-- 不使用优惠券选项 -->
          <div
            class="coupon-option"
            :class="{ active: selectedCouponId === null }"
            @click="selectedCouponId = null">
            <div class="coupon-content">
              <div class="coupon-left">
                <div class="no-coupon-icon">
                  <i class="el-icon-close"></i>
                </div>
              </div>
              <div class="coupon-right">
                <h4>不使用优惠券</h4>
                <p>订单原价</p>
              </div>
            </div>
            <div class="coupon-radio">
              <el-radio :label="null">
                <span></span>
              </el-radio>
            </div>
          </div>
          
          <!-- 可用优惠券列表 -->
          <div
            v-for="coupon in availableCoupons"
            :key="coupon.id"
            class="coupon-option"
            :class="{
              active: selectedCouponId === coupon.id,
              disabled: !coupon.canUse
            }"
            @click="coupon.canUse && (selectedCouponId = coupon.id)">
            
            <div class="coupon-content">
              <div class="coupon-left" :class="getCouponTypeClass(coupon.type)">
                <div class="coupon-amount">
                  <span class="amount">{{ formatAmount(coupon) }}</span>
                  <span class="unit">{{ coupon.type === 1 ? '元' : '折' }}</span>
                </div>
              </div>
              <div class="coupon-right">
                <h4>{{ coupon.couponName }}</h4>
                <p class="condition">{{ coupon.discountDesc }}</p>
                <p class="expire-time">{{ formatExpireTime(coupon.expireTime) }}</p>
                <div v-if="!coupon.canUse" class="unavailable-reason">
                  {{ coupon.unavailableReason }}
                </div>
                <div v-else-if="coupon.calculatedDiscount" class="discount-preview">
                  可减 ¥{{ coupon.calculatedDiscount.toFixed(2) }}
                </div>
              </div>
            </div>
            <div class="coupon-radio">
              <el-radio
                :label="coupon.id"
                :disabled="!coupon.canUse">
                <span></span>
              </el-radio>
            </div>
          </div>
        </el-radio-group>
        
        <div v-if="availableCoupons.length === 0" class="empty-state">
          <i class="el-icon-tickets"></i>
          <p>暂无可用优惠券</p>
          <el-button type="text" @click="goToCouponCenter">去领取优惠券</el-button>
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCouponDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmSelection">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  getAvailableUserCoupons, 
  calculateCouponDiscount,
  formatRemainingTime,
  isExpiringSoon 
} from '@/api/coupon'

export default {
  name: 'CouponSelector',
  props: {
    orderAmount: {
      type: Number,
      required: true
    },
    isSpikeOrder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showCouponDialog: false,
      availableCoupons: [],
      selectedCoupon: null,
      selectedCouponId: null,
      discountAmount: 0,
      loading: false
    }
  },
  watch: {
    orderAmount: {
      handler(newAmount) {
        if (newAmount > 0) {
          this.loadAvailableCoupons()
        }
      },
      immediate: true
    },
    
    showCouponDialog(val) {
      if (val) {
        this.selectedCouponId = this.selectedCoupon ? this.selectedCoupon.id : null
        this.loadAvailableCoupons()
      }
    }
  },
  methods: {
    async loadAvailableCoupons() {
      if (this.orderAmount <= 0 || this.isSpikeOrder) return
      
      this.loading = true
      try {
        const response = await getAvailableUserCoupons()
        if (response.data.code === 200) {
          const coupons = response.data.data
          
          // 为每个优惠券计算是否可用和折扣金额
          for (let coupon of coupons) {
            try {
              const calcResponse = await calculateCouponDiscount(coupon.couponCode, this.orderAmount)
              if (calcResponse.data.code === 200) {
                const result = calcResponse.data.data
                coupon.canUse = result.available
                coupon.calculatedDiscount = result.available ? result.discountAmount : 0
                coupon.unavailableReason = result.available ? '' : result.reason
              } else {
                coupon.canUse = false
                coupon.unavailableReason = '计算失败'
              }
            } catch (error) {
              coupon.canUse = false
              coupon.unavailableReason = '计算失败'
            }
          }
          
          this.availableCoupons = coupons
        } else {
          this.$message.error('加载优惠券失败')
        }
      } catch (error) {
        console.error('加载优惠券失败:', error)
        this.$message.error('加载优惠券失败')
      } finally {
        this.loading = false
      }
    },

    confirmSelection() {
      // 根据selectedCouponId找到对应的优惠券
      if (this.selectedCouponId === null) {
        this.selectedCoupon = null
      } else {
        this.selectedCoupon = this.availableCoupons.find(c => c.id === this.selectedCouponId)
      }

      this.updateDiscountAmount()
      this.showCouponDialog = false

      // 通知父组件优惠券选择变化
      this.$emit('coupon-change', {
        coupon: this.selectedCoupon,
        discountAmount: this.discountAmount
      })
    },
    
    updateDiscountAmount() {
      if (this.selectedCoupon && this.selectedCoupon.canUse) {
        this.discountAmount = this.selectedCoupon.calculatedDiscount || 0
      } else {
        this.discountAmount = 0
      }
    },
    
    formatAmount(coupon) {
      if (coupon.type === 1) {
        return coupon.discountValue
      } else {
        return (coupon.discountValue / 10).toFixed(1)
      }
    },
    
    formatDiscount(coupon) {
      if (coupon.type === 1) {
        return `¥${coupon.discountValue}`
      } else {
        return `${(coupon.discountValue / 10).toFixed(1)}折`
      }
    },
    
    formatExpireTime(expireTime) {
      if (isExpiringSoon(expireTime)) {
        return `即将过期: ${formatRemainingTime(expireTime)}`
      } else {
        const date = new Date(expireTime)
        return `有效期至: ${date.toLocaleDateString()}`
      }
    },
    
    getCouponTypeClass(type) {
      return type === 1 ? 'full-reduction' : 'discount'
    },
    
    goToCouponCenter() {
      this.$router.push('/user/coupons')
      this.showCouponDialog = false
    }
  }
}
</script>

<style scoped>
.coupon-selector {
  margin: 15px 0;
}

.coupon-section {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 15px;
  background: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.label {
  font-weight: 500;
  color: #303133;
}

.coupon-info {
  display: flex;
  align-items: center;
  color: #606266;
}

.selected-coupon {
  color: #409eff;
  font-weight: 500;
}

.no-coupon {
  color: #909399;
}

.discount-info {
  margin-top: 10px;
  text-align: right;
}

.discount-amount {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.order-info {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 6px;
  margin-bottom: 20px;
}

.order-info p {
  margin: 0;
  font-weight: 500;
  color: #303133;
}

.coupon-list {
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
}

.coupon-list .el-radio-group {
  width: 100%;
}

.coupon-option {
  display: flex;
  align-items: center;
  padding: 20px 15px;
  min-height: 100px;
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
  box-sizing: border-box;
}

.coupon-option:hover:not(.disabled) {
  border-color: #409eff;
}

.coupon-option.active {
  border-color: #409eff;
  background: #f0f9ff;
}

.coupon-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.coupon-content {
  display: flex;
  flex: 1;
  align-items: center;
}

.coupon-left {
  width: 90px;
  height: 70px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 20px;
  flex-shrink: 0;
}

.coupon-left.full-reduction {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.coupon-left.discount {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.no-coupon-icon {
  background: #909399;
  width: 90px;
  height: 70px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.coupon-amount .amount {
  font-size: 20px;
  font-weight: bold;
}

.coupon-amount .unit {
  font-size: 12px;
  margin-left: 2px;
}

.coupon-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 70px;
}

.coupon-right h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.coupon-right p {
  margin: 0 0 5px 0;
  font-size: 13px;
  color: #606266;
}

.condition {
  font-weight: 500;
  color: #409eff !important;
}

.expire-time {
  font-size: 12px !important;
  color: #909399 !important;
}

.unavailable-reason {
  color: #f56c6c;
  font-size: 12px;
  font-weight: 500;
}



.coupon-radio {
  margin-left: 15px;
  flex-shrink: 0;
}

.coupon-radio .el-radio {
  margin-right: 0;
}

.coupon-radio .el-radio__label {
  display: none;
}

.discount-preview {
  color: #67c23a;
  font-size: 13px;
  font-weight: 600;
  margin-top: 2px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-state p {
  margin: 0 0 15px 0;
}

.loading-state {
  height: 200px;
  position: relative;
}

.dialog-footer {
  text-align: right;
}

.coupon-dialog .el-dialog__body {
  padding: 20px 24px;
}

.order-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.order-info p {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.spike-order-notice {
  padding: 12px 16px;
  background-color: #fff6f7;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
  color: #f56c6c;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}
</style>
