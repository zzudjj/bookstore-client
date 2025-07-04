<template>
  <div class="order-review-page">
    <div class="review-header">
      <h2>
        <i class="el-icon-edit"></i>
        评价订单
      </h2>
      <div class="order-info">
        <span>订单号：{{ orderInfo.orderId }}</span>
        <span>下单时间：{{ formatTime(orderInfo.orderTime) }}</span>
      </div>
    </div>

    <div class="review-content" v-loading="loading">
      <!-- 商品列表 -->
      <div class="books-section">
        <h3>评价商品</h3>
        <div v-for="(book, index) in bookList" :key="book.bookId" class="book-review-item">
          <div class="book-info">
            <img
              :src="getBookCoverUrl(book.book)"
              :alt="book.book.bookName"
              class="book-cover"
              @error="handleImageError">
            <div class="book-details">
              <h4>{{ book.book.bookName || '未知书名' }}</h4>
              <p class="book-author">作者：{{ book.book.author || '未知作者' }}</p>
              <p class="book-price">购买价格：¥{{ book.price }} × {{ book.num }}</p>
            </div>
          </div>
          
          <div class="review-form">
            <div class="rating-section">
              <label>评分：</label>
              <el-rate
                v-model="reviews[index].rating"
                :max="5"
                show-text
                :texts="['极差', '失望', '一般', '满意', '惊喜']">
              </el-rate>
            </div>
            
            <div class="comment-section">
              <label>评价内容：</label>
              <el-input
                type="textarea"
                v-model="reviews[index].content"
                :placeholder="`请对《${book.book.bookName}》进行评价...`"
                :rows="4"
                maxlength="500"
                show-word-limit>
              </el-input>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submitReviews" :loading="submitting">
          <i class="el-icon-check"></i>
          提交评价
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { reqGetOrderDetail } from '../../../api/order'
import { reqAddComment } from '../../../api/comment'
import { getBookCoverUrl } from '../../../utils/imageUtils'

export default {
  name: 'OrderReview',
  data() {
    return {
      loading: false,
      submitting: false,
      orderInfo: {},
      bookList: [],
      reviews: []
    }
  },
  created() {
    this.initReviewData()
  },
  methods: {
    async initReviewData() {
      const orderId = this.$route.query.orderId
      if (!orderId) {
        this.$message.error('订单信息错误')
        this.goBack()
        return
      }

      this.loading = true
      const token = localStorage.getItem('token')

      try {
        // 获取订单详情
        const response = await reqGetOrderDetail(orderId, token)
        if (response.code === 200) {
          this.orderInfo = response.orderDto
          this.bookList = response.orderDetailDtoList || []

          // 调试信息
          console.log('订单信息:', this.orderInfo)
          console.log('图书列表:', this.bookList)

          // 初始化评价数据
          this.reviews = this.bookList.map(book => ({
            bookId: book.book.id,
            rating: 5,
            content: ''
          }))
        } else {
          this.$message.error(response.message || '获取订单信息失败')
          this.goBack()
        }
      } catch (error) {
        this.$message.error('获取订单信息失败')
        this.goBack()
      } finally {
        this.loading = false
      }
    },

    async submitReviews() {
      // 验证评价内容
      for (let i = 0; i < this.reviews.length; i++) {
        const review = this.reviews[i]
        if (!review.content.trim()) {
          this.$message.warning(`请填写《${this.bookList[i].book.bookName}》的评价内容`)
          return
        }
        if (review.content.trim().length < 10) {
          this.$message.warning(`《${this.bookList[i].book.bookName}》的评价内容至少需要10个字符`)
          return
        }
      }

      this.submitting = true
      const token = localStorage.getItem('token')
      
      try {
        // 逐个提交评价
        for (let i = 0; i < this.reviews.length; i++) {
          const review = this.reviews[i]
          const commentData = {
            bookId: review.bookId,
            content: review.content.trim(),
            parentId: null // 一级评论
          }
          
          const response = await reqAddComment(commentData, token)
          if (response.code !== 200) {
            throw new Error(`评价《${this.bookList[i].book.bookName}》失败：${response.message}`)
          }
        }

        // 更新订单评价状态
        await this.updateOrderEvaluateStatus()
        
        this.$message.success('评价提交成功！')
        this.goBack()
        
      } catch (error) {
        this.$message.error(error.message || '提交评价失败')
      } finally {
        this.submitting = false
      }
    },

    async updateOrderEvaluateStatus() {
      // 这里可以调用API更新订单的评价状态
      // 暂时省略，因为需要后端支持
      console.log('更新订单评价状态:', this.orderInfo.orderId)
    },

    formatTime(time) {
      if (!time) return ''
      return new Date(time).toLocaleString('zh-CN')
    },

    getBookCoverUrl(book) {
      // 使用与订单页面相同的逻辑获取图书封面
      if (!book || !book.isbn) {
        return require('@/assets/image/bookdefault.jpg')
      }
      // 这里应该调用与其他页面相同的获取封面的方法
      // 暂时返回默认图片，等待后端提供正确的封面URL
      return require('@/assets/image/bookdefault.jpg')
    },

    handleImageError(event) {
      // 图片加载失败时显示默认图片
      event.target.src = require('@/assets/image/bookdefault.jpg')
    },

    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.order-review-page {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.review-header {
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.review-header h2 {
  margin: 0 0 10px 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.order-info {
  color: #666;
  font-size: 14px;
}

.order-info span {
  margin-right: 20px;
}

.books-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
}

.book-review-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background: #fafafa;
}

.book-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.book-cover {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.book-details h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

.book-details p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}

.book-price {
  color: #e6a23c !important;
  font-weight: 500;
}

.review-form {
  background: white;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.rating-section {
  margin-bottom: 20px;
}

.rating-section label,
.comment-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.comment-section {
  margin-bottom: 0;
}

.submit-section {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.submit-section .el-button {
  margin: 0 10px;
  padding: 12px 30px;
}
</style>
