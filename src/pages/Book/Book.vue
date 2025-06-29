<!-- 📖 现代化图书详情页面 -->
<template>
  <div class="modern-book-detail">
    <!-- 🧭 导航栏 -->
    <Nav></Nav>

    <!-- 📖 图书详情主体 -->
    <main class="book-detail-main">
      <div class="container">

        <!-- 🍞 面包屑导航 -->
        <div class="breadcrumb-nav">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
              <i class="el-icon-house"></i>
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/search' }">
              <i class="el-icon-search"></i>
              图书搜索
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <i class="el-icon-reading"></i>
              {{ book.bookName || '图书详情' }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 📚 图书主要信息区域 -->
        <div class="book-main-section">
          <div class="book-content-wrapper">

            <!-- 📷 图书封面和图片 -->
            <div class="book-images">
              <div class="main-image">
                <CarouselBtn :imgList="book.imgSrc" class="book-carousel"></CarouselBtn>
              </div>
            </div>

            <!-- 📝 图书信息和购买区域 -->
            <div class="book-info-section">

              <!-- 📖 基本信息 -->
              <div class="book-header">
                <h1 class="book-title">{{ book.bookName }}</h1>
                <div class="book-subtitle">{{ book.subTitle }}</div>

                <!-- ⭐ 评分和标签 -->
                <div class="book-rating">
                  <el-rate
                    v-model="book.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}分"
                    class="rating-stars">
                  </el-rate>
                  <span class="rating-count">({{ book.reviewCount || 0 }}人评价)</span>
                </div>

                <!-- 🏷️ 图书标签 -->
                <div class="book-tags">
                  <el-tag type="success" size="small">热门</el-tag>
                  <el-tag type="warning" size="small">推荐</el-tag>
                  <el-tag type="info" size="small">新书</el-tag>
                </div>
              </div>

              <!-- 📋 详细信息 -->
              <div class="book-details">
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">
                      <i class="el-icon-user"></i>
                      作者
                    </span>
                    <span class="detail-value">{{ book.author }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">
                      <i class="el-icon-postcard"></i>
                      ISBN
                    </span>
                    <span class="detail-value">{{ book.isbn }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">
                      <i class="el-icon-office-building"></i>
                      出版社
                    </span>
                    <span class="detail-value">{{ book.publish }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">
                      <i class="el-icon-date"></i>
                      出版时间
                    </span>
                    <span class="detail-value">{{ book.birthday }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">
                      <i class="el-icon-box"></i>
                      库存
                    </span>
                    <span class="detail-value stock-info" :class="{ 'low-stock': book.stock < 10 }">
                      {{ book.stock }}件
                    </span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">
                      <i class="el-icon-truck"></i>
                      运费
                    </span>
                    <span class="detail-value">免运费</span>
                  </div>
                </div>
              </div>

              <!-- 💰 价格信息 -->
              <div class="price-section">
                <div class="price-main">
                  <div class="current-price">
                    <span class="currency">¥</span>
                    <span class="price-value">{{ book.price }}</span>
                  </div>
                  <div class="price-savings" v-if="book.marketPrice && book.marketPrice > book.price">
                    <span class="original-price">¥{{ book.marketPrice }}</span>
                    <span class="discount-badge">
                      省¥{{ (book.marketPrice - book.price).toFixed(2) }}
                    </span>
                  </div>
                </div>
                <div class="price-benefits">
                  <div class="benefit-item">
                    <i class="el-icon-circle-check"></i>
                    <span>正版保证</span>
                  </div>
                  <div class="benefit-item">
                    <i class="el-icon-circle-check"></i>
                    <span>快速发货</span>
                  </div>
                  <div class="benefit-item">
                    <i class="el-icon-circle-check"></i>
                    <span>售后保障</span>
                  </div>
                </div>
              </div>

              <!-- 🛒 购买操作区域 -->
              <div class="purchase-section">
                <div class="quantity-selector">
                  <span class="quantity-label">数量：</span>
                  <el-input-number
                    v-model="purchaseQuantity"
                    :min="1"
                    :max="Math.min(book.stock, 99)"
                    size="medium"
                    class="quantity-input">
                  </el-input-number>
                </div>

                <div class="action-buttons">
                  <el-button
                    type="danger"
                    size="large"
                    @click="buyNow"
                    :disabled="book.stock <= 0"
                    class="buy-now-btn">
                    <i class="el-icon-shopping-bag-2"></i>
                    立即购买
                  </el-button>
                  <el-button
                    type="primary"
                    size="large"
                    @click="addToCart"
                    :disabled="book.stock <= 0"
                    class="add-cart-btn">
                    <i class="el-icon-shopping-cart-2"></i>
                    加入购物车
                  </el-button>
                </div>

                <div class="secondary-actions">
                  <el-button type="text" class="action-link">
                    <i class="el-icon-star-off"></i>
                    收藏
                  </el-button>
                  <el-button type="text" class="action-link">
                    <i class="el-icon-share"></i>
                    分享
                  </el-button>
                  <el-button type="text" class="action-link">
                    <i class="el-icon-chat-dot-round"></i>
                    咨询
                  </el-button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- 📋 详细信息和评价区域 -->
        <div class="book-details-section">
          <div class="details-container">

            <!-- 📂 侧边分类导航 -->
            <aside class="category-sidebar">
              <div class="sidebar-header">
                <i class="el-icon-collection"></i>
                <span>相关分类</span>
              </div>
              <div class="category-list">
                <router-link
                  v-for="sort in sortList"
                  :key="sort.upperSort.id"
                  :to="{path: '/search', query: {id: sort.upperSort.id, name: sort.upperSort.sortName}}"
                  class="category-item">
                  <i class="el-icon-folder"></i>
                  <span>{{ sort.upperSort.sortName }}</span>
                  <i class="el-icon-arrow-right"></i>
                </router-link>
              </div>
            </aside>

            <!-- 📖 详情内容区域 -->
            <div class="details-content">
              <el-tabs v-model="activeName" type="card" class="details-tabs">

                <!-- 📝 商品详情 -->
                <el-tab-pane label="商品详情" name="description">
                  <div class="product-description">
                    <div class="description-header">
                      <h3>
                        <i class="el-icon-document"></i>
                        商品详情
                      </h3>
                    </div>
                    <div class="markdown-content">
                      <div class="markdown-body" v-html="book.description"></div>
                    </div>
                  </div>
                </el-tab-pane>

                <!-- ⭐ 用户评价 -->
                <el-tab-pane label="用户评价" name="reviews">
                  <div class="reviews-section">
                    <div class="reviews-header">
                      <h3>
                        <i class="el-icon-star-on"></i>
                        用户评价
                      </h3>
                      <div class="reviews-summary">
                        <div class="rating-overview">
                          <div class="overall-rating">
                            <span class="rating-score">4.8</span>
                            <el-rate v-model="overallRating" disabled show-score text-color="#ff9900"></el-rate>
                          </div>
                          <div class="rating-stats">
                            <div class="stat-item">
                              <span>5星</span>
                              <div class="progress-bar">
                                <div class="progress-fill" style="width: 80%"></div>
                              </div>
                              <span>80%</span>
                            </div>
                            <div class="stat-item">
                              <span>4星</span>
                              <div class="progress-bar">
                                <div class="progress-fill" style="width: 15%"></div>
                              </div>
                              <span>15%</span>
                            </div>
                            <div class="stat-item">
                              <span>3星</span>
                              <div class="progress-bar">
                                <div class="progress-fill" style="width: 3%"></div>
                              </div>
                              <span>3%</span>
                            </div>
                            <div class="stat-item">
                              <span>2星</span>
                              <div class="progress-bar">
                                <div class="progress-fill" style="width: 1%"></div>
                              </div>
                              <span>1%</span>
                            </div>
                            <div class="stat-item">
                              <span>1星</span>
                              <div class="progress-bar">
                                <div class="progress-fill" style="width: 1%"></div>
                              </div>
                              <span>1%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="reviews-list">
                      <div class="review-item" v-for="review in mockReviews" :key="review.id">
                        <div class="review-header">
                          <div class="reviewer-info">
                            <el-avatar :size="40" :src="review.avatar">
                              <i class="el-icon-user-solid"></i>
                            </el-avatar>
                            <div class="reviewer-details">
                              <div class="reviewer-name">{{ review.username }}</div>
                              <div class="review-date">{{ review.date }}</div>
                            </div>
                          </div>
                          <el-rate v-model="review.rating" disabled size="small"></el-rate>
                        </div>
                        <div class="review-content">
                          {{ review.content }}
                        </div>
                        <div class="review-actions">
                          <el-button type="text" size="small">
                            <i class="el-icon-thumb"></i>
                            有用 ({{ review.helpful }})
                          </el-button>
                          <el-button type="text" size="small">
                            <i class="el-icon-chat-dot-round"></i>
                            回复
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>

                <!-- 📦 商品参数 -->
                <el-tab-pane label="商品参数" name="specifications">
                  <div class="specifications-section">
                    <div class="spec-header">
                      <h3>
                        <i class="el-icon-menu"></i>
                        商品参数
                      </h3>
                    </div>
                    <div class="spec-table">
                      <div class="spec-row">
                        <div class="spec-label">商品名称</div>
                        <div class="spec-value">{{ book.bookName }}</div>
                      </div>
                      <div class="spec-row">
                        <div class="spec-label">作者</div>
                        <div class="spec-value">{{ book.author }}</div>
                      </div>
                      <div class="spec-row">
                        <div class="spec-label">ISBN</div>
                        <div class="spec-value">{{ book.isbn }}</div>
                      </div>
                      <div class="spec-row">
                        <div class="spec-label">出版社</div>
                        <div class="spec-value">{{ book.publish }}</div>
                      </div>
                      <div class="spec-row">
                        <div class="spec-label">出版时间</div>
                        <div class="spec-value">{{ book.birthday }}</div>
                      </div>
                      <div class="spec-row">
                        <div class="spec-label">页数</div>
                        <div class="spec-value">{{ book.pages || '暂无' }}</div>
                      </div>
                      <div class="spec-row">
                        <div class="spec-label">开本</div>
                        <div class="spec-value">{{ book.format || '16开' }}</div>
                      </div>
                      <div class="spec-row">
                        <div class="spec-label">包装</div>
                        <div class="spec-value">平装</div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>

              </el-tabs>
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
    import CarouselBtn from "../../components/Index/CarouselBtn";
    import {reqGetBook} from "../../api/book";
    import {reqGetSortList} from "../../api/sort";
    import {reqAddCart} from "../../api/cart";
    import 'github-markdown-css'
    export default {
        name: "Book",
        components: { CarouselBtn, Nav, Footer },

        data() {
            return {
                book: {
                    id: null,
                    bookName: '',
                    subTitle: '',
                    author: '',
                    isbn: '',
                    publish: '',
                    birthday: '',
                    marketPrice: '',
                    price: '',
                    stock: '',
                    description: '',
                    imgSrc: [],
                    coverImg: '',
                    rating: 4.8,
                    reviewCount: 128,
                    pages: '',
                    format: ''
                },
                bookId: null,
                sortList: [],
                activeName: 'description',
                purchaseQuantity: 1,
                overallRating: 4.8,

                // 模拟评价数据
                mockReviews: [
                    {
                        id: 1,
                        username: '读书爱好者',
                        avatar: '',
                        rating: 5,
                        date: '2024-06-20',
                        content: '这本书写得非常好，内容丰富，值得推荐！包装也很精美，物流很快。',
                        helpful: 12
                    },
                    {
                        id: 2,
                        username: '书虫小王',
                        avatar: '',
                        rating: 4,
                        date: '2024-06-18',
                        content: '整体不错，内容很有深度，就是纸张质量一般。',
                        helpful: 8
                    },
                    {
                        id: 3,
                        username: '文学青年',
                        avatar: '',
                        rating: 5,
                        date: '2024-06-15',
                        content: '非常棒的一本书，作者的文笔很好，故事情节引人入胜。',
                        helpful: 15
                    }
                ]
            };
        },
        methods: {
            // 标签页切换
            handleClick() {
                // 处理标签页切换逻辑
            },

            // 获取分类列表
            getSortList() {
                reqGetSortList().then(response => {
                    if (response.code == 200) {
                        this.sortList = response.sortResponseList || [];
                    }
                }).catch(() => {
                    this.$message({
                        message: "获取分类信息失败",
                        type: "warning"
                    });
                });
            },

            // 获取图书详情
            getBook(bookId) {
                reqGetBook(bookId).then(response => {
                    if (response.code == 200) {
                        this.book = response.book;
                        // 处理markdown描述
                        if (this.book.description) {
                            try {
                                const MarkdownIt = require("markdown-it");
                                const md = new MarkdownIt();
                                this.book.description = md.render(this.book.description);
                            } catch (error) {
                                console.warn("Markdown渲染失败:", error);
                            }
                        }
                        // 设置默认评分
                        if (!this.book.rating) {
                            this.book.rating = 4.8;
                        }
                        if (!this.book.reviewCount) {
                            this.book.reviewCount = 128;
                        }
                    } else {
                        this.$message({
                            message: response.message || "获取图书信息失败",
                            type: "warning"
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: "获取图书信息失败",
                        type: "error"
                    });
                });
            },

            // 立即购买
            buyNow() {
                if (this.book.stock <= 0) {
                    this.$message({
                        message: "商品库存不足",
                        type: "warning"
                    });
                    return;
                }

                const arr = [this.book.id, 0];
                const ids = JSON.stringify(arr);
                this.$router.push({
                    path: "/buyPage",
                    query: { ids }
                });
            },

            // 添加到购物车
            addToCart() {
                if (this.book.stock <= 0) {
                    this.$message({
                        message: "商品库存不足",
                        type: "warning"
                    });
                    return;
                }

                const user = this.$store.getters.getUser;
                if (!user || !user.account) {
                    this.$message({
                        message: "请先登录",
                        type: "warning"
                    });
                    this.$router.push('/login');
                    return;
                }

                reqAddCart(user.account, this.book.id, this.purchaseQuantity).then(response => {
                    if (response.code == 200) {
                        this.$message({
                            message: "添加到购物车成功",
                            type: "success",
                            duration: 1500
                        });
                    } else {
                        this.$message({
                            message: response.message || "添加失败",
                            type: "warning",
                            duration: 1500
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: "添加到购物车失败",
                        type: "error"
                    });
                });
            },

            // 兼容旧的方法名
            goBuyPage(id) {
                this.buyNow();
            },

            addBookToCart() {
                this.addToCart();
            }
        },

        created() {
            this.bookId = this.$route.query.id;
            if (this.bookId) {
                this.getBook(this.bookId);
                this.getSortList();
            } else {
                this.$message({
                    message: "缺少图书ID参数",
                    type: "warning"
                });
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>
/* 📖 现代化图书详情页样式 */

.modern-book-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 📦 通用容器 */
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 🎯 图书详情主体 */
.book-detail-main {
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

/* 📚 图书主要信息区域 */
.book-main-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 30px;
}

.book-content-wrapper {
  display: flex;
  gap: 40px;
  padding: 40px;
}

/* 📷 图书封面区域 */
.book-images {
  flex: 0 0 400px;
}

.main-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.book-carousel {
  width: 100%;
  height: 500px;
}

/* 📝 图书信息区域 */
.book-info-section {
  flex: 1;
  min-width: 0;
}

/* 📖 基本信息 */
.book-header {
  margin-bottom: 30px;
}

.book-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.book-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 20px;
  line-height: 1.4;
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.rating-stars {
  font-size: 16px;
}

.rating-count {
  color: #7f8c8d;
  font-size: 14px;
}

.book-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 📋 详细信息 */
.book-details {
  margin-bottom: 30px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #7f8c8d;
  font-size: 14px;
  min-width: 80px;
  flex-shrink: 0;
}

.detail-label i {
  font-size: 16px;
  color: #667eea;
}

.detail-value {
  color: #2c3e50;
  font-weight: 500;
  flex: 1;
}

.stock-info.low-stock {
  color: #e74c3c;
}

/* 💰 价格信息 */
.price-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  color: white;
}

.price-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.current-price {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.currency {
  font-size: 20px;
  font-weight: 600;
}

.price-value {
  font-size: 36px;
  font-weight: 700;
}

.price-savings {
  display: flex;
  align-items: center;
  gap: 10px;
}

.original-price {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: line-through;
  font-size: 16px;
}

.discount-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.price-benefits {
  display: flex;
  gap: 20px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.benefit-item i {
  color: #27ae60;
  font-size: 16px;
}

/* 🛒 购买操作区域 */
.purchase-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.quantity-label {
  font-weight: 500;
  color: #2c3e50;
}

.quantity-input {
  width: 120px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.buy-now-btn,
.add-cart-btn {
  flex: 1;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.buy-now-btn {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border: none;
}

.buy-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.add-cart-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.add-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.secondary-actions {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.action-link {
  color: #667eea;
  font-size: 14px;
  transition: all 0.3s ease;
}

.action-link:hover {
  color: #764ba2;
  transform: scale(1.05);
}

/* 📋 详细信息和评价区域 */
.book-details-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.details-container {
  display: flex;
  gap: 0;
}

/* 📂 侧边分类导航 */
.category-sidebar {
  flex: 0 0 250px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 25px;
  background: #667eea;
  color: white;
  font-weight: 600;
}

.sidebar-header i {
  font-size: 18px;
}

.category-list {
  padding: 20px 0;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 25px;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.category-item:hover {
  background: #e9ecef;
  border-left-color: #667eea;
  color: #667eea;
  text-decoration: none;
}

.category-item i:first-child {
  color: #7f8c8d;
  font-size: 14px;
}

.category-item i:last-child {
  margin-left: auto;
  font-size: 12px;
  color: #bdc3c7;
}

/* 📖 详情内容区域 */
.details-content {
  flex: 1;
  min-width: 0;
}

.details-tabs {
  border: none;
}

.details-tabs .el-tabs__header {
  margin: 0;
  background: #f8f9fa;
  padding: 0 30px;
}

.details-tabs .el-tabs__nav-wrap::after {
  display: none;
}

.details-tabs .el-tabs__item {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  font-weight: 500;
  color: #7f8c8d;
  border: none;
  background: transparent;
}

.details-tabs .el-tabs__item.is-active {
  color: #667eea;
  background: white;
  border-bottom: 3px solid #667eea;
}

.details-tabs .el-tabs__content {
  padding: 0;
}

/* 📝 商品详情 */
.product-description {
  padding: 30px;
}

.description-header {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.description-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.description-header i {
  color: #667eea;
  font-size: 22px;
}

.markdown-content {
  line-height: 1.8;
  color: #2c3e50;
}

.markdown-body {
  font-size: 15px;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  color: #2c3e50;
  margin-top: 30px;
  margin-bottom: 15px;
}

.markdown-body p {
  margin-bottom: 15px;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* ⭐ 用户评价 */
.reviews-section {
  padding: 30px;
}

.reviews-header {
  margin-bottom: 30px;
}

.reviews-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #2c3e50;
}

.reviews-header i {
  color: #f39c12;
  font-size: 22px;
}

.reviews-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
}

.rating-overview {
  display: flex;
  gap: 40px;
  align-items: center;
}

.overall-rating {
  text-align: center;
}

.rating-score {
  display: block;
  font-size: 48px;
  font-weight: 700;
  color: #f39c12;
  margin-bottom: 10px;
}

.rating-stats {
  flex: 1;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
}

.stat-item span:first-child {
  width: 30px;
  font-size: 14px;
  color: #7f8c8d;
}

.stat-item span:last-child {
  width: 40px;
  font-size: 14px;
  color: #7f8c8d;
  text-align: right;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  transition: width 0.3s ease;
}

.reviews-list {
  margin-top: 30px;
}

.review-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.review-item:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reviewer-name {
  font-weight: 500;
  color: #2c3e50;
}

.review-date {
  font-size: 12px;
  color: #7f8c8d;
}

.review-content {
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 15px;
}

.review-actions {
  display: flex;
  gap: 20px;
}

/* 📦 商品参数 */
.specifications-section {
  padding: 30px;
}

.spec-header {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.spec-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.spec-header i {
  color: #667eea;
  font-size: 22px;
}

.spec-table {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
}

.spec-row {
  display: flex;
  border-bottom: 1px solid #e9ecef;
}

.spec-row:last-child {
  border-bottom: none;
}

.spec-label {
  flex: 0 0 150px;
  padding: 15px 20px;
  background: #e9ecef;
  color: #7f8c8d;
  font-weight: 500;
  border-right: 1px solid #dee2e6;
}

.spec-value {
  flex: 1;
  padding: 15px 20px;
  color: #2c3e50;
  background: white;
}

/* 📱 响应式设计 */
@media (max-width: 1200px) {
  .container {
    padding: 0 15px;
  }

  .book-content-wrapper {
    gap: 30px;
    padding: 30px;
  }

  .book-images {
    flex: 0 0 350px;
  }
}

@media (max-width: 768px) {
  .book-detail-main {
    padding: 20px 0 40px;
  }

  .book-content-wrapper {
    flex-direction: column;
    gap: 30px;
    padding: 20px;
  }

  .book-images {
    flex: none;
    max-width: 300px;
    margin: 0 auto;
  }

  .book-carousel {
    height: 400px;
  }

  .book-title {
    font-size: 24px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .price-main {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .price-benefits {
    justify-content: center;
    flex-wrap: wrap;
  }

  .action-buttons {
    flex-direction: column;
  }

  .details-container {
    flex-direction: column;
  }

  .category-sidebar {
    flex: none;
  }

  .rating-overview {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }

  .book-content-wrapper {
    padding: 15px;
  }

  .book-title {
    font-size: 20px;
  }

  .current-price .price-value {
    font-size: 28px;
  }

  .purchase-section {
    padding: 20px;
  }

  .quantity-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .secondary-actions {
    gap: 15px;
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

.book-main-section {
  animation: fadeInUp 0.6s ease-out;
}

.book-details-section {
  animation: fadeInUp 0.6s ease-out 0.2s both;
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

.el-rate__icon {
  font-size: 18px !important;
}

.el-rate__text {
  color: #7f8c8d !important;
  font-size: 14px !important;
}

.el-tag {
  border-radius: 15px !important;
  font-weight: 500 !important;
}

.el-input-number.is-controls-right .el-input__inner {
  padding-left: 15px !important;
  padding-right: 50px !important;
}

.el-tabs__item {
  transition: all 0.3s ease !important;
}

.el-button--text {
  padding: 0 !important;
}
</style>
