<template>
  <div class="modern-search-page">
    <!-- 🧭 导航栏 -->
    <Nav></Nav>

    <!-- 🔍 搜索主体 -->
    <main class="search-main">
      <div class="container">

        <!-- 📊 搜索结果头部 -->
        <div class="search-header">
          <div class="search-info">
            <h1 class="search-title">
              <i class="el-icon-search"></i>
              搜索结果
            </h1>
            <div class="search-meta">
              <span class="result-count">找到 <strong>{{ total }}</strong> 个结果</span>
              <span v-if="sortName" class="current-category">
                当前分类：<span class="category-name">{{ sortName }}</span>
              </span>
            </div>
          </div>

          <!-- 🎛️ 排序和筛选 -->
          <div class="search-controls">
            <div class="sort-options">
              <span class="sort-label">排序：</span>
              <el-radio-group v-model="sortType" @change="handleSortChange" size="small">
                <el-radio-button label="default">默认</el-radio-button>
                <el-radio-button label="price_asc">价格↑</el-radio-button>
                <el-radio-button label="price_desc">价格↓</el-radio-button>
                <el-radio-button label="time_desc">最新</el-radio-button>
              </el-radio-group>
            </div>

            <div class="view-options">
              <span class="view-label">视图：</span>
              <el-radio-group v-model="viewMode" size="small">
                <el-radio-button label="list">
                  <i class="el-icon-menu"></i>
                </el-radio-button>
                <el-radio-button label="grid">
                  <i class="el-icon-s-grid"></i>
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>

        <!-- 📚 搜索内容区域 -->
        <div class="search-content">

          <!-- 📋 分类侧边栏 -->
          <aside class="category-sidebar">
            <div class="sidebar-header">
              <i class="el-icon-collection"></i>
              <span>图书分类</span>
            </div>

            <div class="category-list">
              <router-link
                v-for="sort in sortList"
                :key="sort.upperSort.id"
                :to="{path: '/search', query: {id: sort.upperSort.id, name: sort.upperSort.sortName}}"
                class="category-item"
                :class="{ 'active': sortId == sort.upperSort.id }">
                <i class="el-icon-folder"></i>
                <span>{{ sort.upperSort.sortName }}</span>
                <i class="el-icon-arrow-right"></i>
              </router-link>
            </div>
          </aside>

          <!-- 📖 图书列表区域 -->
          <div class="books-area">

            <!-- 📚 图书列表 -->
            <div v-if="bookList.length > 0" :class="['books-container', `view-${viewMode}`]">

              <!-- 📖 列表视图 -->
              <div v-if="viewMode === 'list'" class="books-list">
                <div
                  v-for="book in bookList"
                  :key="book.id"
                  class="book-item-list">

                  <!-- 📷 图书封面 -->
                  <div class="book-cover-container">
                    <router-link :to="{path: '/book', query: {id: book.id}}" class="book-cover-link">
                      <el-image
                        :src="book.coverImg"
                        fit="cover"
                        class="book-cover-image"
                        :alt="book.bookName">
                        <div slot="error" class="image-error">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                    </router-link>
                  </div>

                  <!-- 📝 图书信息 -->
                  <div class="book-info-container">
                    <div class="book-main-info">
                      <h3 class="book-title">
                        <router-link :to="{path: '/book', query: {id: book.id}}">
                          {{ book.bookName }}
                        </router-link>
                      </h3>

                      <div class="book-meta">
                        <div class="meta-item">
                          <i class="el-icon-user"></i>
                          <span>{{ book.author }}</span>
                        </div>
                        <div class="meta-item">
                          <i class="el-icon-office-building"></i>
                          <span>{{ book.publish }}</span>
                        </div>
                        <div class="meta-item">
                          <i class="el-icon-date"></i>
                          <span>{{ book.birthday }}</span>
                        </div>
                        <div class="meta-item">
                          <i class="el-icon-postcard"></i>
                          <span>ISBN: {{ book.isbn }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- 💰 价格和操作 -->
                    <div class="book-actions">
                      <div class="price-section">
                        <div class="current-price">¥{{ book.price }}</div>
                        <div v-if="book.marketPrice && book.marketPrice !== book.price" class="original-price">
                          ¥{{ book.marketPrice }}
                        </div>
                      </div>

                      <div class="action-buttons">
                        <el-button
                          type="primary"
                          icon="el-icon-shopping-cart-2"
                          @click="addToCart(book)"
                          class="cart-btn">
                          加入购物车
                        </el-button>
                        <el-button
                          type="danger"
                          @click="buyNow(book)"
                          class="buy-btn">
                          立即购买
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 🎯 网格视图 -->
              <div v-else class="books-grid">
                <div
                  v-for="book in bookList"
                  :key="book.id"
                  class="book-item-grid">

                  <div class="book-card">
                    <!-- 📷 图书封面 -->
                    <div class="book-cover">
                      <router-link :to="{path: '/book', query: {id: book.id}}">
                        <el-image
                          :src="book.coverImg"
                          fit="cover"
                          class="cover-image"
                          :alt="book.bookName">
                          <div slot="error" class="image-error">
                            <i class="el-icon-picture-outline"></i>
                          </div>
                        </el-image>
                      </router-link>

                      <!-- 💰 价格标签 -->
                      <div class="price-tag">
                        <span class="currency">¥</span>
                        <span class="price">{{ book.price }}</span>
                      </div>
                    </div>

                    <!-- 📝 图书信息 -->
                    <div class="book-info">
                      <h4 class="book-title" :title="book.bookName">
                        <router-link :to="{path: '/book', query: {id: book.id}}">
                          {{ book.bookName }}
                        </router-link>
                      </h4>
                      <p class="book-author">{{ book.author }}</p>

                      <!-- 🛒 操作按钮 -->
                      <div class="card-actions">
                        <el-button
                          type="primary"
                          icon="el-icon-shopping-cart-2"
                          size="small"
                          @click="addToCart(book)"
                          class="card-cart-btn">
                          加购物车
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 📭 空状态 -->
            <div v-else class="empty-state">
              <div class="empty-icon">
                <i class="el-icon-box"></i>
              </div>
              <h3 class="empty-title">暂无相关图书</h3>
              <p class="empty-description">
                不好意思，此分类暂时还没有图书，请尝试其他分类或稍后再来看看
              </p>
              <el-button type="primary" @click="goToHome">
                <i class="el-icon-house"></i>
                返回首页
              </el-button>
            </div>

            <!-- 📄 分页器 -->
            <div v-if="total > 0" class="pagination-container">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page_size"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="modern-pagination">
              </el-pagination>
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
import {reqGetSortList} from "../../api/sort";
import {reqGetBookListBySort} from "../../api/book";

export default {
  name: "Search",
  components: { Nav, Footer },

  data() {
    return {
      // 分页相关
      currentPage: 1,
      page_size: 10,
      total: 0,

      // 搜索相关
      sortName: "",
      sortId: null,
      sortType: "default", // 排序类型
      viewMode: "list", // 视图模式：list | grid

      // 数据
      sortList: [],
      bookList: []
    };
  },

  methods: {
    // 获取分类列表
    getSortList() {
      reqGetSortList().then(response => {
        this.sortList = response.sortResponseList;
      }).catch(err => {
        console.error('获取分类列表失败:', err);
      });
    },

    // 获取图书列表
    getBookList(sortId, page, pageSize) {
      reqGetBookListBySort(sortId, page, pageSize).then(response => {
        if (response.code == 200) {
          this.total = response.total;
          this.bookList = response.bookList;
        }
      }).catch(err => {
        console.error('获取图书列表失败:', err);
        this.$message.error('获取图书列表失败');
      });
    },

    // 排序变化处理
    handleSortChange(sortType) {
      this.sortType = sortType;
      this.currentPage = 1;
      // 这里可以根据sortType调用不同的API或排序逻辑
      this.getBookList(this.sortId, 1, this.page_size);
    },

    // 分页大小变化
    handleSizeChange(val) {
      this.page_size = val;
      this.currentPage = 1;
      this.getBookList(this.sortId, 1, this.page_size);
    },

    // 当前页变化
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBookList(this.sortId, this.currentPage, this.page_size);
    },

    // 添加到购物车
    addToCart(book) {
      this.$message({
        type: 'success',
        message: `《${book.bookName}》已添加到购物车`
      });
    },

    // 立即购买
    buyNow(book) {
      this.$router.push({
        path: '/buy',
        query: { bookId: book.id }
      });
    },

    // 返回首页
    goToHome() {
      this.$router.push('/');
    }
  },

  created() {
    this.sortId = this.$route.query.id;
    this.sortName = this.$route.query.name || '';
    this.getSortList();
    this.getBookList(this.sortId, 1, 10);
  },

  watch: {
    $route() {
      this.sortId = this.$route.query.id;
      this.sortName = this.$route.query.name || '';
      this.currentPage = 1;
      this.getBookList(this.sortId, 1, this.page_size);
    }
  },
    }
</script>

<style scoped>
/* 🔍 现代化搜索页面样式 */

.modern-search-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 📦 通用容器 */
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 🎯 搜索主体 */
.search-main {
  padding: 30px 0 60px;
}

/* 📊 搜索结果头部 */
.search-header {
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

.search-info {
  flex: 1;
}

.search-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.search-title i {
  color: #667eea;
  font-size: 28px;
}

.search-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.result-count {
  color: #7f8c8d;
  font-size: 14px;
}

.result-count strong {
  color: #2c3e50;
  font-weight: 600;
}

.current-category {
  color: #7f8c8d;
  font-size: 14px;
}

.category-name {
  color: #667eea;
  font-weight: 500;
}

/* 🎛️ 搜索控制区域 */
.search-controls {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.sort-options,
.view-options {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-label,
.view-label {
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 500;
}

/* 📚 搜索内容区域 */
.search-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* 📋 分类侧边栏 */
.category-sidebar {
  width: 250px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
}

.category-list {
  padding: 10px 0;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.category-item:last-child {
  border-bottom: none;
}

.category-item:hover {
  background: #f8f9fa;
  color: #667eea;
  transform: translateX(5px);
}

.category-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  border-left: 3px solid #667eea;
}

.category-item i:first-child {
  margin-right: 10px;
  font-size: 14px;
}

.category-item i:last-child {
  font-size: 12px;
  opacity: 0.6;
  transition: transform 0.3s ease;
}

.category-item:hover i:last-child {
  transform: translateX(3px);
}

/* 📖 图书列表区域 */
.books-area {
  flex: 1;
  min-width: 0;
}

.books-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 📖 列表视图 */
.books-list {
  padding: 20px;
}

.book-item-list {
  display: flex;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.book-item-list:last-child {
  border-bottom: none;
}

.book-item-list:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* 📷 图书封面容器 */
.book-cover-container {
  width: 120px;
  flex-shrink: 0;
}

.book-cover-link {
  display: block;
  width: 100%;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.book-cover-link:hover {
  transform: scale(1.05);
}

.book-cover-image {
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

/* 📝 图书信息容器 */
.book-info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-main-info {
  flex: 1;
}

.book-title {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.book-title a {
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.book-title a:hover {
  color: #667eea;
}

.book-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7f8c8d;
  font-size: 14px;
}

.meta-item i {
  color: #667eea;
  font-size: 12px;
  width: 14px;
}

/* 💰 价格和操作区域 */
.book-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-price {
  font-size: 20px;
  font-weight: 600;
  color: #e74c3c;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.cart-btn,
.buy-btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* 🎯 网格视图 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.book-item-grid {
  transition: transform 0.3s ease;
}

.book-item-grid:hover {
  transform: translateY(-5px);
}

.book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.book-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 📷 网格视图封面 */
.book-cover {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .cover-image {
  transform: scale(1.05);
}

/* 💰 价格标签 */
.price-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 6px 10px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.currency {
  font-size: 10px;
  opacity: 0.9;
}

.price {
  margin-left: 2px;
}

/* 📝 网格视图信息 */
.book-info {
  padding: 15px;
}

.book-info .book-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 36px;
}

.book-author {
  color: #7f8c8d;
  font-size: 12px;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-actions {
  margin-top: 10px;
}

.card-cart-btn {
  width: 100%;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.card-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* 📭 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

/* 📄 分页器 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 30px 20px;
  background: white;
  border-radius: 0 0 12px 12px;
}

.modern-pagination {
  background: transparent;
}

/* 📱 响应式设计 */
@media (max-width: 1200px) {
  .container {
    padding: 0 15px;
  }

  .search-content {
    flex-direction: column;
  }

  .category-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .category-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    padding: 20px;
  }

  .category-item {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    text-align: center;
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .search-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .search-controls {
    justify-content: center;
    flex-wrap: wrap;
  }

  .book-item-list {
    flex-direction: column;
    text-align: center;
  }

  .book-cover-container {
    width: 100px;
    margin: 0 auto;
  }

  .book-actions {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .action-buttons {
    width: 100%;
    justify-content: center;
  }

  .books-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .books-grid {
    grid-template-columns: 1fr;
  }

  .search-main {
    padding: 20px 0 40px;
  }

  .search-header {
    padding: 20px;
  }

  .search-title {
    font-size: 20px;
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

.books-container {
  animation: fadeInUp 0.6s ease-out;
}

.book-item-list,
.book-item-grid {
  animation: fadeInUp 0.6s ease-out;
}

/* Element UI 组件样式覆盖 */
.el-radio-button__inner {
  border-radius: 6px !important;
  border: 1px solid #dcdfe6 !important;
  margin-right: 8px !important;
}

.el-radio-button:first-child .el-radio-button__inner {
  border-radius: 6px !important;
}

.el-radio-button:last-child .el-radio-button__inner {
  border-radius: 6px !important;
}

.el-pagination {
  text-align: center;
}

.el-pagination .el-pager li {
  border-radius: 6px;
  margin: 0 2px;
}

.el-pagination .btn-prev,
.el-pagination .btn-next {
  border-radius: 6px;
}
</style>
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #f3f0e9;
    margin: 1px 0px;
  }
  .tab_list{
    padding-left: 5px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #ffffff;
    margin: 1px 0px;
  }
  .tab_list:hover{
    background-color: #a0a9b1;
  }

  .book_content{
    border: 1px #f3f0e9 solid;
    padding: 5px;
    margin: 10px auto;
    width: 940px;
    height: 190px;
    max-height: 240px;
    line-height: 35px;
    border: 1px solid #cacaca;
    padding: 15px;
  }
  .book_content:hover{
    background-color: white;
  }

  .book_content_img{
    float: left;
    width: 150px;
    height: 160px;
    /*border: 1px solid black;*/
  }
  .book_content_info{
    float: right;
    width: 740px;
    height: 160px;
    color: black;
    /*border: 1px solid black;*/
  }


  .book_name{
    margin: 5px auto;
    width: 740px;
    line-height: 30px;
    font-size: 18px;
    color: #9d232c;
    overflow: hidden;
  }

  .book_list_content{
    width: 32%;
    display: inline-block;
    height: 20px;
    overflow: hidden;
    line-height: 18px;
    font-size: 14px;
  }

  .plainBtn{
    width: 100px;
    color: #9d232c;
    background-color: #f3f0e9;
    border: 1px #f3f0e9 solid;
    float: right;
    margin: 0px 5px;
    font-size: 14px;
  }
  .plainBtn:hover{
    background-color: white;
    color: #9d232c;
    border: 1px #b2bac2 solid;
  }
  .cartBtn{
    width: 140px;
    background-color: #9d232c;
    border: 1px #9d232c solid;
    float: right;
    margin: 0px 5px;
    font-size: 14px;
  }
  .cartBtn:hover{
    background-color: #f52b21;
  }
</style>

