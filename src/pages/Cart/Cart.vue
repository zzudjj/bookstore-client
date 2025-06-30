<template>
  <div class="modern-cart-page">
    <!-- 🧭 导航栏 -->
    <Nav></Nav>

    <!-- 🛒 购物车主体 -->
    <main class="cart-main">
      <div class="container">

        <!-- 🍞 面包屑导航 -->
        <div class="breadcrumb-nav">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
              <i class="el-icon-house"></i>
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <i class="el-icon-shopping-cart-2"></i>
              购物车
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 📊 购物车头部信息 -->
        <div class="cart-header">
          <div class="cart-info">
            <h1 class="cart-title">
              <i class="el-icon-shopping-cart-full"></i>
              我的购物车
            </h1>
            <div class="cart-stats">
              <span class="item-count">共 <strong>{{ cartList.length }}</strong> 件商品</span>
              <span class="selected-count">已选择 <strong>{{ multipleSelection.length }}</strong> 件</span>
            </div>
          </div>

          <!-- 🎛️ 购物车操作 -->
          <div class="cart-actions">
            <el-button
              type="info"
              icon="el-icon-refresh"
              @click="refreshCart"
              class="refresh-btn">
              刷新
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="clearCart"
              :disabled="cartList.length === 0"
              class="clear-btn">
              清空购物车
            </el-button>
          </div>
        </div>

        <!-- 🛍️ 购物车内容 -->
        <div class="cart-content">

          <!-- 📦 购物车商品列表 -->
          <div v-if="cartList.length > 0" class="cart-items-container">

            <!-- 📋 表格头部操作栏 -->
            <div class="table-header">
              <div class="select-all-section">
                <el-checkbox
                  v-model="selectAll"
                  @change="handleSelectAll"
                  class="select-all-checkbox">
                  全选
                </el-checkbox>
              </div>
              <div class="header-labels">
                <span class="label-item">商品信息</span>
                <span class="label-price">单价</span>
                <span class="label-quantity">数量</span>
                <span class="label-total">小计</span>
                <span class="label-action">操作</span>
              </div>
            </div>

            <!-- 📚 商品列表 -->
            <div class="cart-items-list">
              <div
                v-for="item in cartList"
                :key="item.id"
                class="cart-item"
                :class="{ 'selected': isSelected(item) }">

                <!-- ✅ 选择框 -->
                <div class="item-select">
                  <el-checkbox
                    :value="isSelected(item)"
                    @change="handleItemSelect(item, $event)"
                    class="item-checkbox">
                  </el-checkbox>
                </div>

                <!-- 📖 商品信息 -->
                <div class="item-info">
                  <div class="item-image">
                    <el-image
                      :src="getBookCoverUrl(item.coverImg)"
                      fit="cover"
                      class="book-cover"
                      :alt="item.bookName">
                      <div slot="error" class="image-error">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>

                  <div class="item-details">
                    <h3 class="book-title">{{ item.bookName }}</h3>
                    <p class="book-author">
                      <i class="el-icon-user"></i>
                      {{ item.author }}
                    </p>
                    <div class="book-meta">
                      <span class="isbn">ISBN: {{ item.isbn }}</span>
                      <span class="publisher">{{ item.publish }}</span>
                    </div>
                  </div>
                </div>

                <!-- 💰 价格信息 -->
                <div class="item-price">
                  <div class="current-price">¥{{ item.price }}</div>
                  <div v-if="item.marketPrice && item.marketPrice !== item.price" class="original-price">
                    ¥{{ item.marketPrice }}
                  </div>
                </div>

                <!-- 🔢 数量控制 -->
                <div class="item-quantity">
                  <div class="quantity-control">
                    <el-button
                      size="mini"
                      icon="el-icon-minus"
                      @click="decreaseQuantity(item)"
                      :disabled="item.num <= 1"
                      class="quantity-btn">
                    </el-button>
                    <el-input-number
                      v-model="item.num"
                      :min="1"
                      :max="99"
                      size="mini"
                      controls-position="right"
                      @change="updateQuantity(item)"
                      class="quantity-input">
                    </el-input-number>
                    <el-button
                      size="mini"
                      icon="el-icon-plus"
                      @click="increaseQuantity(item)"
                      :disabled="item.num >= 99"
                      class="quantity-btn">
                    </el-button>
                  </div>
                </div>

                <!-- 💵 小计 -->
                <div class="item-total">
                  <div class="total-price">¥{{ (item.price * item.num).toFixed(2) }}</div>
                </div>

                <!-- 🗑️ 操作按钮 -->
                <div class="item-actions">
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="removeItem(item)"
                    class="remove-btn">
                    删除
                  </el-button>
                </div>

              </div>
            </div>

          </div>

          <!-- 📭 空购物车状态 -->
          <div v-else class="empty-cart">
            <div class="empty-icon">
              <i class="el-icon-shopping-cart-2"></i>
            </div>
            <h3 class="empty-title">购物车是空的</h3>
            <p class="empty-description">
              还没有添加任何商品，去看看有什么好书吧！
            </p>
            <el-button type="primary" @click="goShopping" class="go-shopping-btn">
              <i class="el-icon-search"></i>
              去逛逛
            </el-button>
          </div>

        </div>

        <!-- 💳 结算区域 -->
        <div v-if="cartList.length > 0" class="checkout-section">
          <div class="checkout-container">

            <!-- 📊 结算信息 -->
            <div class="checkout-info">
              <div class="selected-items">
                已选择 <strong>{{ multipleSelection.length }}</strong> 件商品
              </div>
              <div class="price-details">
                <div class="subtotal">
                  <span>商品总价：</span>
                  <span class="amount">¥{{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="discount" v-if="discount > 0">
                  <span>优惠减免：</span>
                  <span class="amount discount-amount">-¥{{ discount.toFixed(2) }}</span>
                </div>
                <div class="total">
                  <span>应付总额：</span>
                  <span class="total-amount">¥{{ totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- 🛒 结算按钮 -->
            <div class="checkout-actions">
              <el-button
                type="primary"
                size="large"
                @click="checkout"
                :disabled="multipleSelection.length === 0"
                class="checkout-btn">
                <i class="el-icon-shopping-bag-2"></i>
                结算 ({{ multipleSelection.length }})
              </el-button>
            </div>

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
import {reqGetCartList, reqModCart, reqDelCart} from "../../api/cart";
import {getBookCoverUrl} from "../../utils/imageUtils";

export default {
  name: "Cart",
  components: { Nav, Footer },

  data() {
    return {
      cartList: [],
      multipleSelection: [],
      account: null,
      selectAll: false
    };
  },

  computed: {
    // 计算小计
    subtotal() {
      return this.multipleSelection.reduce((total, item) => {
        return total + (item.price * item.num);
      }, 0);
    },

    // 计算优惠
    discount() {
      // 这里可以添加优惠计算逻辑
      return 0;
    },

    // 计算总金额
    totalAmount() {
      return this.subtotal - this.discount;
    }
  },

  methods: {
    // 获取购物车列表
    getCartList() {
      const user = this.$store.getters.getUser;
      this.account = (user && user.account) || sessionStorage.getItem("account");
      reqGetCartList(this.account, 1, 10).then(response => {
        if (response.code == 200) {
          this.cartList = response.cartBookDtoList || [];
        } else {
          this.$message({
            message: response.message,
            type: "warning"
          });
        }
      }).catch(() => {
        this.$message({
          message: "获取购物车信息出错",
          type: "warning"
        });
      });
    },

    // 检查商品是否被选中
    isSelected(item) {
      return this.multipleSelection.some(selected => selected.id === item.id);
    },

    // 处理单个商品选择
    handleItemSelect(item, checked) {
      if (checked) {
        if (!this.isSelected(item)) {
          this.multipleSelection.push(item);
        }
      } else {
        this.multipleSelection = this.multipleSelection.filter(selected => selected.id !== item.id);
      }
      this.updateSelectAllState();
    },

    // 处理全选
    handleSelectAll(checked) {
      if (checked) {
        this.multipleSelection = [...this.cartList];
      } else {
        this.multipleSelection = [];
      }
    },

    // 更新全选状态
    updateSelectAllState() {
      this.selectAll = this.cartList.length > 0 && this.multipleSelection.length === this.cartList.length;
    },

    // 增加数量
    increaseQuantity(item) {
      if (item.num < 99) {
        item.num++;
        this.updateQuantity(item);
      }
    },

    // 减少数量
    decreaseQuantity(item) {
      if (item.num > 1) {
        item.num--;
        this.updateQuantity(item);
      }
    },

    // 更新数量
    updateQuantity(item) {
      reqModCart(this.account, item.id, item.num).then(response => {
        if (response.code == 200) {
          // 更新成功，静默处理
        } else {
          this.$message({
            message: response.message,
            type: "warning"
          });
        }
      }).catch(() => {
        this.$message({
          message: "修改失败",
          type: "warning"
        });
      });
    },

    // 删除商品
    removeItem(item) {
      this.$confirm('确定要删除这件商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reqDelCart(this.account, item.id).then(response => {
          if (response.code == 200) {
            this.getCartList();
            // 从选中列表中移除
            this.multipleSelection = this.multipleSelection.filter(selected => selected.id !== item.id);
            this.updateSelectAllState();
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message({
              message: response.message,
              type: "warning"
            });
          }
        }).catch(() => {
          this.$message({
            message: "删除失败",
            type: "warning"
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 清空购物车
    clearCart() {
      this.$confirm('确定要清空购物车吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里可以调用批量删除API
        this.$message({
          message: "清空购物车功能开发中...",
          type: "info"
        });
      });
    },

    // 刷新购物车
    refreshCart() {
      this.getCartList();
      this.$message({
        message: "购物车已刷新",
        type: "success"
      });
    },

    // 去逛逛
    goShopping() {
      this.$router.push('/');
    },

    // 结算
    checkout() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请选择要购买的商品",
          type: "warning"
        });
      } else {
        let arr = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          arr.push(this.multipleSelection[i].id);
        }
        arr.push(1);
        let ids = JSON.stringify(arr);
        this.$router.push({
          path: "/buyPage",
          query: {
            ids: ids
          }
        });
      }
    },

    // 获取图书封面完整URL
    getBookCoverUrl(coverImg) {
      return getBookCoverUrl(coverImg);
    }
  },

  created() {
    this.getCartList();
  }
}
</script>

<style scoped>
/* 🛒 现代化购物车页面样式 */

.modern-cart-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 📦 通用容器 */
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 🎯 购物车主体 */
.cart-main {
  padding: 30px 0 60px;
}

/* 🍞 面包屑导航 */
.breadcrumb-nav {
  background: white;
  border-radius: 12px;
  padding: 15px 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
  color: #667eea;
}

/* 📊 购物车头部 */
.cart-header {
  background: white;
  border-radius: 12px;
  padding: 25px 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.cart-info {
  flex: 1;
}

.cart-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.cart-title i {
  color: #667eea;
  font-size: 28px;
}

.cart-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.item-count,
.selected-count {
  color: #7f8c8d;
  font-size: 14px;
}

.item-count strong,
.selected-count strong {
  color: #2c3e50;
  font-weight: 600;
}

/* 🎛️ 购物车操作 */
.cart-actions {
  display: flex;
  gap: 10px;
}

.refresh-btn,
.clear-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(144, 147, 153, 0.3);
}

.clear-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

/* 🛍️ 购物车内容 */
.cart-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 30px;
}

/* 📋 表格头部 */
.table-header {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.select-all-section {
  width: 80px;
  flex-shrink: 0;
}

.select-all-checkbox {
  font-weight: 500;
}

.header-labels {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 20px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.label-item {
  text-align: left;
}

.label-price,
.label-quantity,
.label-total,
.label-action {
  text-align: center;
}

/* 📚 商品列表 */
.cart-items-list {
  padding: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 25px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item:hover {
  background: #f8f9fa;
}

.cart-item.selected {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-left: 3px solid #667eea;
}

/* ✅ 选择框 */
.item-select {
  width: 80px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.item-checkbox {
  transform: scale(1.2);
}

/* 📖 商品信息 */
.item-info {
  flex: 2;
  display: flex;
  gap: 15px;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
  font-size: 24px;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.book-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-author {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 0 8px 0;
  color: #7f8c8d;
  font-size: 14px;
}

.book-author i {
  font-size: 12px;
}

.book-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #95a5a6;
}

/* 💰 价格信息 */
.item-price {
  flex: 1;
  text-align: center;
}

.current-price {
  font-size: 18px;
  font-weight: 600;
  color: #e74c3c;
  margin-bottom: 5px;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

/* 🔢 数量控制 */
.item-quantity {
  flex: 1;
  display: flex;
  justify-content: center;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 14px;
  transition: all 0.3s ease;
}

.quantity-btn:hover {
  transform: scale(1.1);
}

.quantity-input {
  width: 80px;
}

.quantity-input .el-input__inner {
  text-align: center;
  border-radius: 6px;
  font-weight: 500;
}

/* 💵 小计 */
.item-total {
  flex: 1;
  text-align: center;
}

.total-price {
  font-size: 18px;
  font-weight: 600;
  color: #e74c3c;
}

/* 🗑️ 操作按钮 */
.item-actions {
  flex: 1;
  display: flex;
  justify-content: center;
}

.remove-btn {
  color: #e74c3c;
  font-size: 14px;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  color: #c0392b;
  transform: scale(1.1);
}

/* 📭 空购物车状态 */
.empty-cart {
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
  margin: 0 0 30px 0;
  color: #7f8c8d;
  line-height: 1.6;
}

.go-shopping-btn {
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.go-shopping-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.3);
}

/* 💳 结算区域 */
.checkout-section {
  position: sticky;
  bottom: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.checkout-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  gap: 30px;
}

/* 📊 结算信息 */
.checkout-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 30px;
}

.selected-items {
  color: #7f8c8d;
  font-size: 14px;
}

.selected-items strong {
  color: #2c3e50;
  font-weight: 600;
}

.price-details {
  display: flex;
  align-items: center;
  gap: 20px;
}

.subtotal,
.discount,
.total {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.subtotal span:first-child,
.discount span:first-child {
  color: #7f8c8d;
}

.total span:first-child {
  color: #2c3e50;
  font-weight: 600;
}

.amount {
  color: #2c3e50;
  font-weight: 600;
}

.discount-amount {
  color: #27ae60;
}

.total-amount {
  color: #e74c3c;
  font-size: 18px;
  font-weight: 700;
}

/* 🛒 结算按钮 */
.checkout-actions {
  flex-shrink: 0;
}

.checkout-btn {
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.checkout-btn:disabled {
  background: #bdc3c7;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

/* 📱 响应式设计 */
@media (max-width: 1200px) {
  .container {
    padding: 0 15px;
  }

  .header-labels {
    grid-template-columns: 2fr 0.8fr 0.8fr 0.8fr 0.8fr;
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .cart-main {
    padding: 20px 0 40px;
  }

  .cart-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .cart-actions {
    justify-content: center;
  }

  .table-header {
    display: none;
  }

  .cart-item {
    flex-direction: column;
    gap: 15px;
    padding: 20px;
  }

  .item-info {
    width: 100%;
    flex-direction: column;
    text-align: center;
  }

  .item-image {
    width: 100px;
    height: 120px;
    margin: 0 auto;
  }

  .item-price,
  .item-quantity,
  .item-total,
  .item-actions {
    width: 100%;
    text-align: center;
  }

  .quantity-control {
    justify-content: center;
  }

  .checkout-container {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .checkout-info {
    flex-direction: column;
    gap: 15px;
  }

  .price-details {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }

  .cart-header {
    padding: 20px;
  }

  .cart-title {
    font-size: 20px;
  }

  .cart-item {
    padding: 15px;
  }

  .checkout-container {
    padding: 20px;
  }

  .checkout-btn {
    width: 100%;
    padding: 12px 20px;
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

.cart-content {
  animation: fadeInUp 0.6s ease-out;
}

.cart-item {
  animation: fadeInUp 0.6s ease-out;
}

.checkout-section {
  animation: fadeInUp 0.6s ease-out;
}

/* Element UI 组件样式覆盖 */
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  color: #667eea !important;
  font-weight: 500;
}

.el-breadcrumb__inner a:hover,
.el-breadcrumb__inner.is-link:hover {
  color: #764ba2 !important;
}

.el-breadcrumb__separator {
  color: #bdc3c7 !important;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #667eea !important;
  border-color: #667eea !important;
}

.el-input-number.is-controls-right .el-input__inner {
  padding-left: 15px !important;
  padding-right: 50px !important;
}

.el-button--mini {
  padding: 7px 15px !important;
  font-size: 12px !important;
}
</style>

