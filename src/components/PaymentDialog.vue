<template>
  <el-dialog
    title="确认支付"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="payment-dialog">
    
    <div class="payment-content">
      <!-- 订单信息 -->
      <div class="order-info">
        <h4>订单信息</h4>
        <div class="info-item">
          <span class="label">订单号：</span>
          <span class="value">{{ orderInfo.orderId }}</span>
        </div>
        <div class="info-item">
          <span class="label">商品数量：</span>
          <span class="value">{{ orderInfo.bookList ? orderInfo.bookList.length : 0 }}件</span>
        </div>
        <div class="info-item">
          <span class="label">收货人：</span>
          <span class="value">{{ orderInfo.address ? orderInfo.address.name : '' }}</span>
        </div>
      </div>

      <!-- 费用明细 -->
      <div class="expense-detail">
        <h4>费用明细</h4>
        <div class="expense-item">
          <span class="label">商品总价：</span>
          <span class="value">¥{{ ((orderInfo.expense && orderInfo.expense.productTotalMoney) || 0).toFixed(2) }}</span>
        </div>
        <div class="expense-item">
          <span class="label">运费：</span>
          <span class="value">¥{{ ((orderInfo.expense && orderInfo.expense.freight) || 0).toFixed(2) }}</span>
        </div>
        <div class="expense-item" v-if="orderInfo.expense && orderInfo.expense.activityDiscount > 0">
          <span class="label">活动优惠：</span>
          <span class="value discount">-¥{{ ((orderInfo.expense && orderInfo.expense.activityDiscount) || 0).toFixed(2) }}</span>
        </div>
        <div class="expense-item" v-if="orderInfo.expense && orderInfo.expense.coupon > 0">
          <span class="label">优惠券抵扣：</span>
          <span class="value discount">-¥{{ ((orderInfo.expense && orderInfo.expense.coupon) || 0).toFixed(2) }}</span>
        </div>
        <div class="expense-item total">
          <span class="label">应付金额：</span>
          <span class="value">¥{{ ((orderInfo.expense && orderInfo.expense.finallyPrice) || 0).toFixed(2) }}</span>
        </div>
      </div>

      <!-- 支付方式选择 -->
      <div class="payment-method">
        <h4>支付方式</h4>
        <el-radio-group v-model="selectedPaymentMethod" class="payment-options">
          <el-radio label="alipay" class="payment-option">
            <div class="payment-item">
              <i class="payment-icon alipay-icon"></i>
              <span>支付宝</span>
            </div>
          </el-radio>
          <el-radio label="wechat" class="payment-option">
            <div class="payment-item">
              <i class="payment-icon wechat-icon"></i>
              <span>微信支付</span>
            </div>
          </el-radio>
          <el-radio label="bank" class="payment-option">
            <div class="payment-item">
              <i class="payment-icon bank-icon"></i>
              <span>银行卡</span>
            </div>
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 支付倒计时 -->
      <div class="payment-countdown" v-if="countdown > 0">
        <i class="el-icon-time"></i>
        <span>请在 {{ formatCountdown(countdown) }} 内完成支付</span>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" :disabled="paying">取消</el-button>
      <el-button 
        type="primary" 
        @click="handleConfirmPayment" 
        :loading="paying"
        :disabled="!selectedPaymentMethod">
        确认支付 ¥{{ ((orderInfo.expense && orderInfo.expense.finallyPrice) || 0).toFixed(2) }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'PaymentDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      selectedPaymentMethod: 'alipay',
      paying: false,
      countdown: 1800, // 30分钟倒计时
      countdownTimer: null
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.startCountdown()
      } else {
        this.stopCountdown()
      }
    }
  },
  methods: {
    // 开始倒计时
    startCountdown() {
      this.countdown = 1800 // 重置为30分钟
      this.countdownTimer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          this.stopCountdown()
          this.$message.warning('支付超时，订单已取消')
          this.handleCancel()
        }
      }, 1000)
    },

    // 停止倒计时
    stopCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
    },

    // 格式化倒计时显示
    formatCountdown(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    },

    // 确认支付
    async handleConfirmPayment() {
      if (!this.selectedPaymentMethod) {
        this.$message.warning('请选择支付方式')
        return
      }

      this.paying = true
      try {
        // 模拟支付过程
        await this.simulatePayment()
        
        // 调用实际支付接口
        const result = await this.$http.post('/confirmPayment', {
          orderId: this.orderInfo.orderId
        })

        if (result.data.code === 200) {
          this.$message.success('支付成功！')
          this.$emit('payment-success', {
            orderId: this.orderInfo.orderId,
            paymentMethod: this.selectedPaymentMethod
          })
          this.handleCancel()
        } else {
          this.$message.error(result.data.message || '支付失败')
        }
      } catch (error) {
        console.error('支付失败:', error)
        this.$message.error('支付失败，请重试')
      } finally {
        this.paying = false
      }
    },

    // 模拟支付过程
    simulatePayment() {
      return new Promise((resolve) => {
        // 模拟支付延迟
        setTimeout(() => {
          resolve()
        }, 2000)
      })
    },

    // 取消支付
    handleCancel() {
      this.stopCountdown()
      this.$emit('update:visible', false)
      this.$emit('payment-cancel')
    }
  },
  beforeDestroy() {
    this.stopCountdown()
  }
}
</script>

<style scoped>
.payment-dialog {
  border-radius: 8px;
}

.payment-content {
  padding: 0 10px;
}

.order-info,
.expense-detail,
.payment-method {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.order-info h4,
.expense-detail h4,
.payment-method h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.info-item,
.expense-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item:last-child,
.expense-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

.discount {
  color: #f56c6c;
}

.expense-item.total {
  border-top: 1px solid #ddd;
  padding-top: 8px;
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
}

.expense-item.total .value {
  color: #f56c6c;
  font-size: 18px;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-option {
  margin: 0;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: all 0.3s;
}

.payment-option:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.payment-option.is-checked {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.payment-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.alipay-icon {
  background-color: #1677ff;
  border-radius: 4px;
}

.wechat-icon {
  background-color: #07c160;
  border-radius: 4px;
}

.bank-icon {
  background-color: #ff6b35;
  border-radius: 4px;
}

.payment-countdown {
  text-align: center;
  padding: 10px;
  background-color: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  color: #fa8c16;
  margin-top: 15px;
}

.payment-countdown i {
  margin-right: 5px;
}

.dialog-footer {
  text-align: right;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
</style>
