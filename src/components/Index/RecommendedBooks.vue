<template>
  <div class="book-showcase" :data-type="listSort">
    <!-- 标题区域 -->
    <div class="section-header">
      <div class="title-wrapper">
        <div class="title-icon">
          <i :class="getTitleIcon()"></i>
        </div>
        <h2 class="section-title">{{ this.sortTitle }}</h2>
        <div class="title-decoration"></div>
      </div>
      <router-link :to="{path: '/search', query: {sort: listSort}}" class="view-more-btn">
        <span>查看更多</span>
        <i class="el-icon-arrow-right"></i>
      </router-link>
    </div>

    <!-- 图书列表 -->
    <div
      class="books-grid"
      v-loading="loading"
      element-loading-text="正在加载精美图书..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <div
        class="book-card"
        v-for="(item, index) in bookList"
        :key="item.id"
        :style="{ animationDelay: index * 0.1 + 's' }"
      >
        <router-link :to="{path: '/book', query: {id: item.id}}" class="book-link">
          <!-- 图书封面 -->
          <div class="book-cover">
            <el-image
              :src="getBookCoverUrl(item.coverImg)"
              fit="cover"
              class="cover-image"
              :alt="item.bookName"
            >
              <div slot="placeholder" class="image-placeholder">
                <i class="el-icon-picture-outline"></i>
              </div>
              <div slot="error" class="image-error">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>

            <!-- 悬浮效果遮罩 -->
            <div class="book-overlay">
              <div class="overlay-content">
                <i class="el-icon-view"></i>
                <span>查看详情</span>
              </div>
            </div>

            <!-- 推荐标签 -->
            <div class="book-badge" v-if="listSort === 'recommend'">
              <i class="el-icon-star-on"></i>
              <span>推荐</span>
            </div>
            <div class="book-badge new-badge" v-else-if="listSort === 'newProduct'">
              <i class="el-icon-lightning"></i>
              <span>新品</span>
            </div>
          </div>

          <!-- 图书信息 -->
          <div class="book-info">
            <h3 class="book-title" :title="item.bookName">{{ item.bookName }}</h3>
            <p class="book-author" :title="item.author">{{ item.author }}</p>
            <div class="book-price">
              <span class="currency">¥</span>
              <span class="price">{{ item.price }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && bookList.length === 0" class="empty-state">
      <i class="el-icon-box"></i>
      <p>暂无{{ sortTitle }}图书</p>
    </div>
  </div>
</template>

<script>
    import {reqGetRecBookList} from "../../api/book";
    import {getBookCoverUrl} from "../../utils/imageUtils";
    export default {
        props:{
            listSort: {
                default: "recommend"
            }
        },
        name: "RecBookBox",
        data(){
            return {
                sortTitle:"",
                bookSortList:[],
                bookList: [],
                loading: false
            }
        },
        methods: {
            async getBookList(){
                this.loading = true;
                try {
                    switch (this.listSort) {
                        case "recommend":
                            this.sortTitle = "精品推荐";
                            await this.fetchBooks("recommend");
                            break;
                        case "newProduct":
                            this.sortTitle = "新品推荐";
                            await this.fetchBooks("newProduct");
                            break;
                        default:
                            break;
                    }
                } finally {
                    this.loading = false;
                }
            },

            async fetchBooks(type) {
                try {
                    const response = await reqGetRecBookList(type);
                    if(response.code === 200){
                        this.bookList = response.bookList || [];
                    } else {
                        this.$message({
                            type: 'warning',
                            message: response.message || '获取图书列表失败'
                        });
                        this.bookList = [];
                    }
                } catch (error) {
                    console.error('获取图书列表错误:', error);
                    this.$message({
                        type: 'error',
                        message: "获取图书列表数据失败"
                    });
                    this.bookList = [];
                }
            },

            // 获取图书封面完整URL
            getBookCoverUrl(coverImg) {
                return getBookCoverUrl(coverImg);
            },

            // 获取标题图标
            getTitleIcon() {
                switch (this.listSort) {
                    case "recommend":
                        return "el-icon-star-on";
                    case "newProduct":
                        return "el-icon-lightning";
                    default:
                        return "el-icon-collection";
                }
            }
        },
        created() {
            // console.log("this.listSort:"+this.listSort);
            this.getBookList();
        }
    }
</script>

<style scoped>
/* 主容器 */
.book-showcase {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 推荐图书特殊样式 */
.book-showcase[data-type="recommend"] .section-title {
  color: white;
}

.book-showcase[data-type="recommend"] .title-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.book-showcase[data-type="recommend"] .title-decoration {
  background: white;
}

.book-showcase[data-type="recommend"] .view-more-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.book-showcase[data-type="recommend"] .view-more-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 标题区域 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  position: relative;
}

.title-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.title-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.title-icon i {
  font-size: 24px;
  color: white;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  letter-spacing: -0.5px;
}

.title-decoration {
  position: absolute;
  bottom: -20px;
  left: 66px;
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.view-more-btn {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.view-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  color: white;
}

.view-more-btn span {
  margin-right: 8px;
}

/* 图书网格 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

/* 图书卡片 */
.book-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.book-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

/* 图书封面 */
.book-cover {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: #f8f9fa;
}

.cover-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.book-card:hover .cover-image {
  transform: scale(1.05);
}

.image-placeholder,
.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f8f9fa;
  color: #bbb;
}

.image-placeholder i,
.image-error i {
  font-size: 48px;
}

/* 悬浮遮罩 */
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
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
}

.overlay-content i {
  font-size: 32px;
  margin-bottom: 8px;
  display: block;
}

.overlay-content span {
  font-size: 14px;
  font-weight: 500;
}

/* 推荐标签 */
.book-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.book-badge.new-badge {
  background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%);
  box-shadow: 0 2px 8px rgba(254, 202, 87, 0.3);
}

.book-badge i {
  margin-right: 4px;
  font-size: 10px;
}

/* 图书信息 */
.book-info {
  padding: 20px 16px;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.book-card:hover .book-title {
  color: #667eea;
}

.book-author {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-price {
  display: flex;
  align-items: baseline;
  font-weight: 600;
}

.currency {
  font-size: 14px;
  color: #e74c3c;
  margin-right: 2px;
}

.price {
  font-size: 20px;
  color: #e74c3c;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #95a5a6;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 16px;
  display: block;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* 加载状态样式 */
.books-grid.is-loading {
  min-height: 300px;
}

/* 微交互效果 */
.book-card {
  cursor: pointer;
}

.book-card:active {
  transform: translateY(-4px) scale(0.98);
}

.book-price {
  position: relative;
}

.book-price::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.book-card:hover .book-price::after {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .book-showcase {
    padding: 20px 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }

  .book-cover {
    height: 200px;
  }

  .section-title {
    font-size: 24px;
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
