<template>
  <div class="modern-book-section">
    <!-- 📚 分类标题栏 -->
    <div class="section-header">
      <div class="category-tabs">
        <button
          v-for="(item, index) in bookList"
          :key="index"
          @click="switchCategory(index)"
          @mouseenter="enter(index)"
          :class="['category-tab', { 'active': current === index }]">
          <i class="el-icon-collection category-icon"></i>
          <span>{{ item.sortName }}</span>
        </button>
      </div>

      <router-link
        v-if="bookList.length > 0"
        :to="{path: '/search', query: {id: bookList[current].sortId, name: bookList[current].sortName}}"
        class="more-link">
        <span>查看更多</span>
        <i class="el-icon-arrow-right"></i>
      </router-link>
    </div>

    <!-- 📖 图书卡片网格 -->
    <div class="books-container">
      <transition-group name="book-list" tag="div" class="books-grid">
        <div
          v-for="(item, index) in currentBooks"
          :key="`${current}-${item.id}`"
          class="book-card"
          @click="goToBookDetail(item.id)">

          <!-- 图书封面 -->
          <div class="book-cover">
            <el-image
              :src="getBookCoverUrl(item.coverImg) || defaultCover"
              fit="cover"
              class="cover-image"
              :alt="item.bookName">
              <div slot="error" class="image-error">
                <i class="el-icon-picture-outline"></i>
                <p>暂无封面</p>
              </div>
            </el-image>

            <!-- 悬浮操作按钮 -->
            <div class="book-overlay">
              <button class="action-btn preview-btn" @click.stop="previewBook(item)">
                <i class="el-icon-view"></i>
                <span>预览</span>
              </button>
              <button class="action-btn cart-btn" @click.stop="addToCart(item)">
                <i class="el-icon-shopping-cart-2"></i>
                <span>加购物车</span>
              </button>
            </div>

            <!-- 价格标签 -->
            <div class="price-tag">
              <span class="currency">¥</span>
              <span class="price">{{ item.price }}</span>
            </div>
          </div>

          <!-- 图书信息 -->
          <div class="book-info">
            <h3 class="book-title" :title="item.bookName">
              {{ item.bookName }}
            </h3>
            <p class="book-author">
              <i class="el-icon-user"></i>
              {{ item.author }}
            </p>

            <!-- 评分和标签 -->
            <div class="book-meta">
              <div class="rating">
                <el-rate
                  v-model="item.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}分">
                </el-rate>
              </div>
              <div class="tags" v-if="item.tags">
                <span
                  v-for="tag in item.tags.slice(0, 2)"
                  :key="tag"
                  class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- 空状态 -->
      <div v-if="currentBooks.length === 0" class="empty-state">
        <i class="el-icon-box"></i>
        <p>暂无图书数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import GalleryBook from "./BookGallery";
import {reqGetSortBookList} from "../../api/book";
import {getBookCoverUrl} from "../../utils/imageUtils";

export default {
  name: "BookCard",
  components: { GalleryBook },

  data() {
    return {
      current: 0, // 当前显示的分类索引
      bookSortList: [],
      defaultCover: "static/image/bookdefault.jpg",
      bookList: [{
        sortId: 1,
        sortName: "推荐图书",
        bookList: []
      }]
    };
  },

  computed: {
    // 当前显示的图书列表
    currentBooks() {
      if (this.bookList.length > 0 && this.bookList[this.current]) {
        return this.bookList[this.current].bookList.map(book => ({
          ...book,
          rating: book.rating || Math.floor(Math.random() * 2) + 4, // 模拟评分 4-5分
          tags: book.tags || ['热门', '推荐'] // 模拟标签
        }));
      }
      return [];
    }
  },

  methods: {
    // 切换分类
    switchCategory(index) {
      this.current = index;
    },

    // 鼠标悬停切换分类（保持原有功能）
    enter(index) {
      this.current = index;
    },

    // 跳转到图书详情
    goToBookDetail(bookId) {
      this.$router.push({
        path: '/book',
        query: { id: bookId }
      });
    },

    // 预览图书
    previewBook(book) {
      this.$message({
        type: 'info',
        message: `预览《${book.bookName}》功能开发中...`
      });
    },

    // 添加到购物车
    addToCart(book) {
      this.$message({
        type: 'success',
        message: `《${book.bookName}》已添加到购物车`
      });
    },

    // 获取分类图书列表
    getSortBookList() {
      console.log("发送了获取分类图书的请求");
      reqGetSortBookList(117).then(response => {
        if (response.code == 200) {
          console.log(response);
          this.bookList = response.sortBookResList;
          console.log(this.bookList);
        } else {
          this.$message({
            type: 'warning',
            message: response.message
          });
        }
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: "获取图书列表数据失败"
        });
      });
    },

    // 获取图书封面完整URL
    getBookCoverUrl(coverImg) {
      return getBookCoverUrl(coverImg);
    }
  },

  created() {
    this.getSortBookList();
  }
}
</script>

<style scoped>
/* 🎨 现代化图书卡片组件样式 */

.modern-book-section {
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 📚 分类标题栏 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
}

.category-tabs {
  display: flex;
  gap: 8px;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e8e8e8;
  border-radius: 25px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.category-tab:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.category-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.category-icon {
  font-size: 16px;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.more-link:hover {
  color: #764ba2;
  transform: translateX(3px);
}

/* 📖 图书网格 */
.books-container {
  min-height: 400px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  padding: 20px 0;
}

/* 📘 图书卡片 */
.book-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 📷 图书封面 */
.book-cover {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.book-card:hover .cover-image {
  transform: scale(1.05);
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f5f5f5;
  color: #999;
}

.image-error i {
  font-size: 48px;
  margin-bottom: 10px;
}

/* 🎯 悬浮操作按钮 */
.book-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 12px;
  color: #333;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: white;
  transform: scale(1.1);
}

.action-btn i {
  font-size: 18px;
}

.preview-btn:hover {
  color: #667eea;
}

.cart-btn:hover {
  color: #27ae60;
}

/* 💰 价格标签 */
.price-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.currency {
  font-size: 12px;
  opacity: 0.9;
}

.price {
  font-size: 16px;
  margin-left: 2px;
}

/* 📝 图书信息 */
.book-info {
  padding: 20px;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 10px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 44px;
}

.book-author {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 15px;
}

.book-author i {
  font-size: 12px;
}

/* ⭐ 评分和标签 */
.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  flex: 1;
}

.tags {
  display: flex;
  gap: 6px;
}

.tag {
  padding: 4px 8px;
  background: #ecf0f1;
  color: #7f8c8d;
  font-size: 11px;
  border-radius: 12px;
  font-weight: 500;
}

/* 📭 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #bdc3c7;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 15px;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* 🎬 过渡动画 */
.book-list-enter-active,
.book-list-leave-active {
  transition: all 0.5s ease;
}

.book-list-enter {
  opacity: 0;
  transform: translateY(30px);
}

.book-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.book-list-move {
  transition: transform 0.5s ease;
}

/* 📱 响应式设计 */
@media (max-width: 768px) {
  .modern-book-section {
    padding: 20px 15px;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .category-tabs {
    overflow-x: auto;
    padding-bottom: 5px;
  }

  .category-tab {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }

  .book-cover {
    height: 220px;
  }

  .book-info {
    padding: 15px;
  }

  .book-title {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .book-cover {
    height: 180px;
  }
}
</style>
