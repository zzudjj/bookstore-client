<template>
  <div class="modern-search-page">
    <!-- 🧭 导航栏 -->
    <Nav></Nav>

    <!-- 🎨 搜索头部横幅 -->
    <section class="search-hero">
      <div class="hero-background">
        <div class="hero-particles"></div>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="title-icon">📚</span>
              发现您的下一本好书
            </h1>
            <p class="hero-subtitle">在超过10万本图书中找到您的心仪之选</p>
          </div>

          <!-- 🔍 主搜索框 -->
          <div class="hero-search">
            <div class="search-box-main">
              <div class="search-input-container">
                <i class="search-icon el-icon-search"></i>
                <input
                  v-model="searchKeyword"
                  type="text"
                  placeholder="搜索书名、作者、ISBN或出版社..."
                  class="search-input-main"
                  @keyup.enter="handleSearch"
                  @input="handleRealTimeSearch"
                  @focus="showHistorySuggestions"
                  @blur="hideSuggestionsWithDelay">
                <button
                  class="search-btn-main"
                  @click="handleSearch"
                  :disabled="searching">
                  <i v-if="searching" class="el-icon-loading"></i>
                  <i v-else class="el-icon-search"></i>
                  <span>{{ searching ? '搜索中...' : '搜索' }}</span>
                </button>
              </div>

              <!-- 搜索建议 -->
              <div v-if="searchSuggestions.length > 0 && showSuggestions" class="search-suggestions-hero">
                <div
                  v-for="(suggestion, index) in searchSuggestions"
                  :key="index"
                  class="suggestion-item-hero"
                  @click="selectSuggestion(suggestion)">
                  <i class="el-icon-time"></i>
                  <span>{{ suggestion }}</span>
                </div>
              </div>
            </div>

            <!-- 快速搜索标签 -->
            <div class="quick-search-tags">
              <span class="tags-label">热门搜索：</span>
              <el-tag
                v-for="tag in quickSearchTags"
                :key="tag"
                class="quick-tag"
                @click="quickSearch(tag)">
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 🔍 搜索主体 -->
    <main class="search-main">
      <div class="container">

        <!-- 📊 统一的搜索结果头部 -->
        <div class="unified-search-header" v-if="searchKeyword || sortName || searching">
          <div class="header-content-wrapper">
            <div class="header-main-info">
              <div class="breadcrumb-nav">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-house"></i> 首页</el-breadcrumb-item>
                  <el-breadcrumb-item v-if="searchKeyword">对“{{ searchKeyword }}”的搜索结果</el-breadcrumb-item>
                  <el-breadcrumb-item v-else-if="sortName">{{ sortName }}</el-breadcrumb-item>
                  <el-breadcrumb-item v-else>全部图书</el-breadcrumb-item>
                </el-breadcrumb>
              </div>
              <div class="results-summary">
                <h2 class="results-title">
                  <i class="el-icon-document-checked results-icon"></i>
                  <span v-if="searchKeyword">搜索结果</span>
                  <span v-else-if="sortName">{{ sortName }}</span>
                  <span v-else>全部图书</span>
                </h2>
                <div class="result-stats" v-if="!searching">
                  <span v-if="total > 0" class="result-count">
                    共 <strong class="count-number">{{ total }}</strong> 个结果
                  </span>
                  <span v-else class="no-results-text">
                    未找到匹配的结果
                  </span>
                  <el-button v-if="searchKeyword" type="text" size="mini" @click="clearSearch" class="clear-search-btn">
                    <i class="el-icon-circle-close"></i>
                    <span>清除搜索</span>
                  </el-button>
                </div>
              </div>
            </div>
            <div class="header-actions">
              <el-dropdown v-if="searchHistory.length > 0" trigger="click" class="history-dropdown">
                <el-button type="text" size="small" class="history-btn">
                  <i class="el-icon-time"></i>
                  <span>搜索历史</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" class="history-menu">
                  <div class="history-header">最近搜索</div>
                  <el-dropdown-item
                    v-for="(item, index) in searchHistory.slice(0, 5)"
                    :key="index"
                    @click.native="selectSuggestion(item)"
                    class="history-item">
                    <i class="el-icon-time"></i>
                    <span>{{ item }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click.native="clearSearchHistory" class="clear-history">
                    <i class="el-icon-delete"></i>
                    <span>清除历史</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>

        <!-- 搜索内容区域 -->
        <div class="search-content">
          <!-- 分类侧边栏 -->
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

          <!-- 图书列表区域 -->
          <div class="books-area">
            <!-- 工具栏 -->
            <div class="books-toolbar" v-if="!searching">
              <div class="toolbar-left">
                <div class="sort-section">
                  <span class="toolbar-label">
                    <i class="el-icon-sort"></i>
                    排序
                  </span>
                  <el-select
                    v-model="sortType"
                    @change="handleSortChange"
                    size="small"
                    class="sort-select">
                    <el-option label="默认排序" value="default">
                      <i class="el-icon-sort"></i>
                      <span>默认排序</span>
                    </el-option>
                    <el-option label="价格从低到高" value="price_asc">
                      <i class="el-icon-bottom"></i>
                      <span>价格从低到高</span>
                    </el-option>
                    <el-option label="价格从高到低" value="price_desc">
                      <i class="el-icon-top"></i>
                      <span>价格从高到低</span>
                    </el-option>
                    <el-option label="最新发布" value="time_desc">
                      <i class="el-icon-time"></i>
                      <span>最新发布</span>
                    </el-option>
                    <el-option label="销量最高" value="sales_desc">
                      <i class="el-icon-star-on"></i>
                      <span>销量最高</span>
                    </el-option>
                  </el-select>
                </div>

                <!-- 筛选选项 -->
                <div class="filter-section">
                  <span class="toolbar-label">
                    <i class="el-icon-filter"></i>
                    筛选
                  </span>
                  <el-button-group size="small" class="filter-group">
                    <el-button
                      :type="priceFilter === 'all' ? 'primary' : 'default'"
                      @click="setPriceFilter('all')"
                      class="filter-btn">
                      全部价格
                    </el-button>
                    <el-button
                      :type="priceFilter === 'low' ? 'primary' : 'default'"
                      @click="setPriceFilter('low')"
                      class="filter-btn">
                      ¥0-50
                    </el-button>
                    <el-button
                      :type="priceFilter === 'medium' ? 'primary' : 'default'"
                      @click="setPriceFilter('medium')"
                      class="filter-btn">
                      ¥50-100
                    </el-button>
                    <el-button
                      :type="priceFilter === 'high' ? 'primary' : 'default'"
                      @click="setPriceFilter('high')"
                      class="filter-btn">
                      ¥100+
                    </el-button>
                  </el-button-group>
                  </div>
                </div>

                <div class="toolbar-right">
                  <div class="view-section">
                    <span class="toolbar-label">
                      <i class="el-icon-view"></i>
                      视图
                    </span>
                    <el-radio-group v-model="viewMode" size="small" class="view-toggle">
                      <el-radio-button label="list" class="view-btn">
                        <el-tooltip content="列表视图" placement="top">
                          <div class="btn-content">
                            <i class="el-icon-menu"></i>
                            <span class="view-text">列表</span>
                          </div>
                        </el-tooltip>
                      </el-radio-button>
                      <el-radio-button label="grid" class="view-btn">
                        <el-tooltip content="网格视图" placement="top">
                          <div class="btn-content">
                            <i class="el-icon-s-grid"></i>
                            <span class="view-text">网格</span>
                          </div>
                        </el-tooltip>
                      </el-radio-button>
                    </el-radio-group>
                  </div>

                  <!-- 每页显示数量 -->
                  <div class="pagesize-section">
                    <span class="toolbar-label">每页</span>
                    <el-select
                      v-model="page_size"
                      @change="handleSizeChange"
                      size="small"
                      class="pagesize-select">
                      <el-option label="10" :value="10"></el-option>
                      <el-option label="20" :value="20"></el-option>
                      <el-option label="50" :value="50"></el-option>
                    </el-select>
                  </div>
                </div>
            </div>

            <!-- 🔄 加载状态 -->
            <div v-if="searching" class="loading-container">
              <div class="loading-spinner">
                <i class="el-icon-loading"></i>
              </div>
              <p class="loading-text">正在搜索中...</p>
            </div>

            <!-- 📚 图书列表 -->
            <div v-else-if="bookList.length > 0" class="books-section">

              <!-- 📚 图书容器 -->
              <div :class="['books-container', `view-${viewMode}`]">

              <!-- 📖 列表视图 -->
              <div v-if="viewMode === 'list'" class="books-list-modern">
                <div
                  v-for="book in bookList"
                  :key="book.id"
                  class="book-card-modern">

                  <!-- 📷 图书封面 -->
                  <div class="book-cover-wrapper">
                    <router-link :to="{path: '/book', query: {id: book.id}}" class="cover-link">
                      <div class="cover-container">
                        <el-image
                          :src="book.coverImg"
                          fit="cover"
                          class="book-cover-image"
                          :alt="book.bookName">
                          <div slot="error" class="image-error">
                            <i class="el-icon-picture-outline"></i>
                            <span>暂无封面</span>
                          </div>
                        </el-image>
                        <div class="cover-overlay">
                          <i class="el-icon-view"></i>
                          <span>查看详情</span>
                        </div>
                      </div>
                    </router-link>

                    <!-- 图书标签 -->
                    <div class="book-badges">
                      <span v-if="book.isNew" class="badge badge-new">新书</span>
                      <span v-if="book.isHot" class="badge badge-hot">热销</span>
                      <span v-if="book.discount" class="badge badge-discount">{{ book.discount }}折</span>
                    </div>
                  </div>

                  <!-- 📝 图书信息 -->
                  <div class="book-content">
                    <div class="book-header">
                      <h3 class="book-title-modern">
                        <router-link :to="{path: '/book', query: {id: book.id}}" class="title-link">
                          <span v-html="highlightKeyword(book.bookName)"></span>
                        </router-link>
                      </h3>

                      <!-- 评分 -->
                      <div class="book-rating">
                        <el-rate
                          v-model="book.rating || 4.5"
                          disabled
                          show-score
                          text-color="#ff9900"
                          score-template="{value}"
                          class="rating-stars">
                        </el-rate>
                      </div>
                    </div>

                    <div class="book-meta-modern">
                      <div class="meta-row">
                        <div class="meta-item-modern">
                          <i class="el-icon-user-solid meta-icon"></i>
                          <span class="meta-label">作者：</span>
                          <span class="meta-value" v-html="highlightKeyword(book.author || '未知作者')"></span>
                        </div>
                        <div class="meta-item-modern">
                          <i class="el-icon-office-building meta-icon"></i>
                          <span class="meta-label">出版社：</span>
                          <span class="meta-value" v-html="highlightKeyword(book.publish || '未知出版社')"></span>
                        </div>
                      </div>

                      <div class="meta-row">
                        <div class="meta-item-modern">
                          <i class="el-icon-date meta-icon"></i>
                          <span class="meta-label">出版时间：</span>
                          <span class="meta-value">{{ formatDate(book.birthday) }}</span>
                        </div>
                        <div class="meta-item-modern">
                          <i class="el-icon-postcard meta-icon"></i>
                          <span class="meta-label">ISBN：</span>
                          <span class="meta-value" v-html="highlightKeyword(book.isbn || '无')"></span>
                        </div>
                      </div>
                    </div>

                    <!-- 图书描述 -->
                    <div class="book-description" v-if="book.description">
                      <p class="description-text" v-html="highlightKeyword(book.description.substring(0, 120) + (book.description.length > 120 ? '...' : ''))"></p>
                    </div>

                    <!-- 💰 价格和操作 -->
                    <div class="book-footer">
                      <div class="price-section-modern">
                        <div class="price-main">
                          <span class="currency">¥</span>
                          <span class="current-price-modern">{{ book.price }}</span>
                        </div>
                        <div v-if="book.marketPrice && book.marketPrice !== book.price" class="price-original">
                          <span class="original-price-modern">¥{{ book.marketPrice }}</span>
                          <span class="discount-percent">
                            {{ Math.round((book.price / book.marketPrice) * 10) }}折
                          </span>
                        </div>
                      </div>

                      <div class="action-buttons-modern">
                        <el-button
                          type="primary"
                          icon="el-icon-shopping-cart-2"
                          @click="addToCart(book)"
                          class="btn-cart-modern"
                          size="medium">
                          加入购物车
                        </el-button>
                        <el-button
                          type="danger"
                          @click="buyNow(book)"
                          class="btn-buy-modern"
                          size="medium">
                          立即购买
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 🎯 网格视图 -->
              <div v-else class="books-grid-modern">
                <div
                  v-for="book in bookList"
                  :key="book.id"
                  class="book-card-grid">

                  <div class="grid-card">
                    <!-- 📷 图书封面 -->
                    <div class="grid-cover-wrapper">
                      <router-link :to="{path: '/book', query: {id: book.id}}" class="grid-cover-link">
                        <div class="grid-cover-container">
                          <el-image
                            :src="book.coverImg"
                            fit="cover"
                            class="grid-cover-image"
                            :alt="book.bookName">
                            <div slot="error" class="grid-image-error">
                              <i class="el-icon-picture-outline"></i>
                              <span>暂无封面</span>
                            </div>
                          </el-image>
                          <div class="grid-cover-overlay">
                            <div class="overlay-content">
                              <i class="el-icon-view"></i>
                              <span>查看详情</span>
                            </div>
                          </div>
                        </div>
                      </router-link>

                      <!-- 标签和价格 -->
                      <div class="grid-badges">
                        <span v-if="book.isNew" class="grid-badge badge-new">新书</span>
                        <span v-if="book.isHot" class="grid-badge badge-hot">热销</span>
                      </div>

                      <div class="grid-price-tag">
                        <span class="grid-currency">¥</span>
                        <span class="grid-price">{{ book.price }}</span>
                      </div>
                    </div>

                    <!-- 📝 图书信息 -->
                    <div class="grid-book-info">
                      <h4 class="grid-book-title" :title="book.bookName">
                        <router-link :to="{path: '/book', query: {id: book.id}}" class="grid-title-link">
                          <span v-html="highlightKeyword(book.bookName)"></span>
                        </router-link>
                      </h4>

                      <p class="grid-book-author" v-html="highlightKeyword(book.author || '未知作者')"></p>

                      <!-- 评分 -->
                      <div class="grid-rating">
                        <el-rate
                          v-model="book.rating || 4.5"
                          disabled
                          size="mini"
                          text-color="#ff9900"
                          class="grid-rating-stars">
                        </el-rate>
                      </div>

                      <!-- 🛒 操作按钮 -->
                      <div class="grid-actions">
                        <el-button
                          type="primary"
                          icon="el-icon-shopping-cart-2"
                          size="small"
                          @click="addToCart(book)"
                          class="grid-cart-btn">
                          加入购物车
                        </el-button>
                        <el-button
                          type="danger"
                          size="small"
                          @click="buyNow(book)"
                          class="grid-buy-btn">
                          立即购买
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            <!-- 📭 空状态 -->
            <div v-else-if="!searching" class="empty-state">
              <div class="empty-icon">
                <i class="el-icon-search"></i>
              </div>
              <h3 class="empty-title">
                <span v-if="searchKeyword">未找到相关图书</span>
                <span v-else-if="sortName">{{ sortName }}分类暂无图书</span>
                <span v-else>请输入关键词开始搜索</span>
              </h3>
              <p class="empty-description">
                <span v-if="searchKeyword">
                  没有找到与"{{ searchKeyword }}"相关的图书，请尝试其他关键词
                </span>
                <span v-else-if="sortName">
                  此分类暂时还没有图书，请尝试其他分类或稍后再来看看
                </span>
                <span v-else>
                  您可以搜索书名、作者、ISBN或出版社来查找图书
                </span>
              </p>
              <div class="empty-actions">
                <el-button v-if="searchKeyword" type="primary" @click="clearSearch">
                  <i class="el-icon-refresh"></i>
                  清除搜索
                </el-button>
                <el-button type="default" @click="goToHome">
                  <i class="el-icon-house"></i>
                  返回首页
                </el-button>
              </div>
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
import {reqGetBookListBySort, reqGetBookList, reqSearchBooks, reqSearchBooksGet, reqSearchBookByKeyword} from "../../api/book";
import {reqSearchBook} from "../../api/index";

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
      searchKeyword: "", // 搜索关键词
      searching: false, // 搜索状态
      searchSuggestions: [], // 搜索建议
      showSuggestions: false, // 显示搜索建议
      searchHistory: [], // 搜索历史
      searchTimeout: null, // 搜索延时器
      enableRealTimeSearch: false, // 启用实时搜索
      searchError: "", // 搜索错误信息
      lastSearchTime: 0, // 上次搜索时间
      quickSearchTags: ['红楼梦', '吴承恩', '9787111213826', '机械工业'], // 快速搜索标签
      priceFilter: 'all', // 价格筛选

      // 数据
      sortList: [],
      bookList: [],
      originalBookList: [] // 原始数据，用于排序
    };
  },

  methods: {
    // 显示搜索历史建议
    showHistorySuggestions() {
      if (this.searchKeyword.trim() === '' && this.searchHistory.length > 0) {
        this.searchSuggestions = [...this.searchHistory];
        this.showSuggestions = true;
      }
    },

    // 隐藏建议
    hideSuggestions() {
      this.showSuggestions = false;
    },

    // 延迟隐藏建议（用于blur事件）
    hideSuggestionsWithDelay() {
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200);
    },
    // 获取分类列表
    getSortList() {
      reqGetSortList().then(response => {
        this.sortList = response.sortResponseList;
      }).catch(err => {
        console.error('获取分类列表失败:', err);
      });
    },

    // 获取图书列表（按分类）
    getBookList(sortId, page, pageSize) {
      if (!sortId) return;

      reqGetBookListBySort(sortId, page, pageSize).then(response => {
        if (response.code == 200) {
          this.total = response.total;
          this.bookList = response.bookList;
          this.originalBookList = [...response.bookList];
          this.applySorting();
        }
      }).catch(err => {
        console.error('获取图书列表失败:', err);
        this.$message.error('获取图书列表失败');
      });
    },

    // 搜索图书 - 主要搜索方法
    async searchBooks(keyword, page = 1, pageSize = 10) {
      if (!keyword.trim()) {
        this.$message.warning('请输入搜索关键词');
        return;
      }

      // 防抖处理
      const currentTime = Date.now();
      if (currentTime - this.lastSearchTime < 300) {
        return;
      }
      this.lastSearchTime = currentTime;

      this.searching = true;
      this.searchError = "";

      try {
        // 记录搜索参数
        console.log('搜索参数:', {
          keyword: keyword,
          page: page,
          pageSize: pageSize
        });

        // 优先使用标准搜索API
        const response = await reqSearchBooks(keyword, page, pageSize);
        // console.log('Received API response:', JSON.stringify(response)); // 诊断日志


        if (response && response.code == 200 && response.bookList) {
          const { bookList, total, keyword: responseKeyword } = response;

          this.bookList = bookList || [];
          this.originalBookList = [...(bookList || [])];
          this.total = total || 0;
          this.applySorting();

          // 保存搜索历史
          this.saveSearchHistory(keyword);

          // 显示搜索统计
          this.showSearchStats(responseKeyword || keyword, total || 0);

        } else {
          throw new Error((response && response.message) || '搜索接口返回异常');
        }

      } catch (err) {
        console.error('标准搜索API失败，尝试备用方案:', err);

        try {
          // 尝试使用旧的搜索API
          const response = await reqSearchBookByKeyword(keyword, page, pageSize);

          if (response && response.code == 200) {
            this.bookList = response.bookList || [];
            this.originalBookList = [...(response.bookList || [])];
            this.total = response.total || 0;
            this.applySorting();
            this.saveSearchHistory(keyword);
            this.showSearchStats(keyword, response.total || 0);

          } else {
            throw new Error('备用API也失败');
          }

        } catch (err2) {
          console.error('备用API失败，使用模拟搜索:', err2);
          // 使用模拟搜索作为最后的备选方案
          await this.mockSearch(keyword, page, pageSize);
        }
      } finally {
        this.searching = false;
      }
    },

    // 模拟搜索功能（当API不可用时）
    async mockSearch(keyword, page = 1, pageSize = 10) {
      try {
        // 获取所有图书进行本地搜索
        const response = await reqGetBookList(1, 1000);

        if (response.code == 200 && response.bookList) {
          const filteredBooks = response.bookList.filter(book => {
            const searchText = keyword.toLowerCase();
            return (
              (book.bookName && book.bookName.toLowerCase().includes(searchText)) ||
              (book.author && book.author.toLowerCase().includes(searchText)) ||
              (book.isbn && book.isbn.toLowerCase().includes(searchText)) ||
              (book.description && book.description.toLowerCase().includes(searchText)) ||
              (book.publish && book.publish.toLowerCase().includes(searchText))
            );
          });

          // 分页处理
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          this.bookList = filteredBooks.slice(startIndex, endIndex);
          this.originalBookList = [...filteredBooks];
          this.total = filteredBooks.length;
          this.applySorting();

          // 保存搜索历史
          this.saveSearchHistory(keyword);
          this.showSearchStats(keyword, filteredBooks.length);

          // 提示用户使用的是模拟搜索
          this.$message.info('正在使用本地搜索功能');

        } else {
          this.bookList = [];
          this.originalBookList = [];
          this.total = 0;
          this.showSearchStats(keyword, 0);
        }

      } catch (err) {
        console.error('模拟搜索失败:', err);
        this.searchError = '搜索功能暂时不可用，请稍后重试';
        this.$message.error(this.searchError);

        this.bookList = [];
        this.originalBookList = [];
        this.total = 0;
      }
    },

    // 处理搜索
    handleSearch() {
      const keyword = this.searchKeyword.trim();
      if (!keyword) {
        this.$message.warning('请输入搜索关键词');
        return;
      }

      // 清除分类搜索
      this.sortId = null;
      this.sortName = "";
      this.currentPage = 1;

      // 更新URL
      this.$router.push({
        path: '/search',
        query: { keyword: keyword }
      });

      this.searchBooks(keyword, 1, this.page_size);
      this.hideSuggestions();
    },

    // 实时搜索处理
    handleRealTimeSearch() {
      if (!this.enableRealTimeSearch) return;

      const keyword = this.searchKeyword.trim();
      if (!keyword) {
        this.clearSearchResults();
        return;
      }

      // 清除之前的延时器
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // 设置新的延时器
      this.searchTimeout = setTimeout(() => {
        this.handleSearch();
      }, 500);
    },

    // 显示搜索统计
    showSearchStats(keyword, total) {
      // 这里可以添加搜索统计的显示逻辑
      console.log(`搜索"${keyword}"，找到${total}个结果`);
    },

    // 清除搜索结果
    clearSearchResults() {
      this.bookList = [];
      this.originalBookList = [];
      this.total = 0;
    },

    // 高亮关键词
    highlightKeyword(text) {
      if (!this.searchKeyword || !text) return text;

      const keyword = this.searchKeyword.trim();
      if (!keyword) return text;

      try {
        const regex = new RegExp(`(${this.escapeRegExp(keyword)})`, 'gi');
        return text.replace(regex, '<mark style="background-color: #fff3cd; padding: 1px 2px;">$1</mark>');
      } catch (err) {
        console.error('关键词高亮失败:', err);
        return text;
      }
    },

    // 转义正则表达式特殊字符
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '未知';

      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '未知';

        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (err) {
        return '未知';
      }
    },

    // 添加到购物车
    addToCart(book) {
      // 这里添加购物车逻辑
      this.$message.success(`《${book.bookName}》已添加到购物车`);
      console.log('添加到购物车:', book);
    },

    // 立即购买
    buyNow(book) {
      // 这里添加立即购买逻辑
      this.$router.push({
        path: '/buy',
        query: { bookId: book.id }
      });
    },

    // 切换实时搜索
    toggleRealTimeSearch() {
      this.enableRealTimeSearch = !this.enableRealTimeSearch;
      this.$message.info(
        this.enableRealTimeSearch ? '已启用实时搜索' : '已关闭实时搜索'
      );
    },

    // 清除搜索历史
    clearSearchHistory() {
      this.$confirm('确定要清除所有搜索历史吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.searchHistory = [];
        localStorage.removeItem('bookstore_search_history');
        this.$message.success('搜索历史已清除');
      }).catch(() => {
        // 用户取消
      });
    },

    // 处理图片加载错误
    handleImageError(event) {
      event.target.src = '/static/images/default-book.jpg';
    },

    // 快速搜索
    quickSearch(tag) {
      this.searchKeyword = tag;
      this.handleSearch();
    },

    // 设置价格筛选
    setPriceFilter(filter) {
      this.priceFilter = filter;
      this.applySorting();
    },

    // 快速搜索
    quickSearch(tag) {
      this.searchKeyword = tag;
      this.handleSearch();
    },

    // 从路由初始化数据
    initFromRoute() {
      const query = this.$route.query;

      // 重置状态
      this.currentPage = 1;
      this.bookList = [];
      this.originalBookList = [];
      this.total = 0;

      if (query.keyword) {
        // 关键词搜索
        this.searchKeyword = query.keyword;
        this.sortId = null;
        this.sortName = "";
        this.searchBooks(query.keyword, 1, this.page_size);
      } else if (query.id) {
        // 分类搜索
        this.sortId = query.id;
        this.sortName = query.name || '';
        this.searchKeyword = "";
        this.getBookList(this.sortId, 1, this.page_size);
      } else {
        // 默认状态
        this.sortId = null;
        this.sortName = "";
        this.searchKeyword = "";
      }
    },

    // 清除搜索
    handleClearSearch() {
      this.searchKeyword = "";
      this.hideSuggestions();
    },

    // 清除搜索并重置
    clearSearch() {
      this.searchKeyword = "";
      this.bookList = [];
      this.originalBookList = [];
      this.total = 0;
      this.currentPage = 1;

      // 重置URL
      this.$router.push({ path: '/search' });
    },

    // 选择搜索建议
    selectSuggestion(suggestion) {
      this.searchKeyword = suggestion;
      this.handleSearch();
    },

    // 显示搜索建议
    showSearchSuggestions() {
      if (this.searchKeyword.trim() && this.searchHistory.length > 0) {
        this.searchSuggestions = this.searchHistory
          .filter(item => item.includes(this.searchKeyword.toLowerCase()))
          .slice(0, 5);
        this.showSuggestions = true;
      }
    },

    // 隐藏搜索建议
    hideSuggestions() {
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200);
    },

    // 保存搜索历史
    saveSearchHistory(keyword) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      if (normalizedKeyword && !this.searchHistory.includes(normalizedKeyword)) {
        this.searchHistory.unshift(normalizedKeyword);
        if (this.searchHistory.length > 10) {
          this.searchHistory = this.searchHistory.slice(0, 10);
        }
        // 保存到localStorage
        localStorage.setItem('bookstore_search_history', JSON.stringify(this.searchHistory));
      }
    },

    // 加载搜索历史
    loadSearchHistory() {
      try {
        const history = localStorage.getItem('bookstore_search_history');
        if (history) {
          this.searchHistory = JSON.parse(history);
        }
      } catch (err) {
        console.error('加载搜索历史失败:', err);
      }
    },

    // 应用排序和筛选
    applySorting() {
      if (!this.originalBookList.length) return;

      let filteredList = [...this.originalBookList];

      // 应用价格筛选
      if (this.priceFilter !== 'all') {
        filteredList = filteredList.filter(book => {
          const price = parseFloat(book.price || 0);
          switch (this.priceFilter) {
            case 'low':
              return price >= 0 && price <= 50;
            case 'medium':
              return price > 50 && price <= 100;
            case 'high':
              return price > 100;
            default:
              return true;
          }
        });
      }

      // 应用排序
      switch (this.sortType) {
        case 'price_asc':
          filteredList.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
          break;
        case 'price_desc':
          filteredList.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
          break;
        case 'time_desc':
          filteredList.sort((a, b) => new Date(b.birthday || 0) - new Date(a.birthday || 0));
          break;
        case 'sales_desc':
          filteredList.sort((a, b) => (b.sales || 0) - (a.sales || 0));
          break;
        default:
          // 默认排序保持原有顺序
          break;
      }

      // 更新总数（用于分页）
      const totalFiltered = filteredList.length;

      // 重新分页
      const startIndex = (this.currentPage - 1) * this.page_size;
      const endIndex = startIndex + this.page_size;
      this.bookList = filteredList.slice(startIndex, endIndex);

      // 如果当前页没有数据且不是第一页，回到第一页
      if (this.bookList.length === 0 && this.currentPage > 1) {
        this.currentPage = 1;
        this.bookList = filteredList.slice(0, this.page_size);
      }
    },

    // 排序变化处理
    handleSortChange(sortType) {
      this.sortType = sortType;
      this.applySorting();
    },

    // 分页大小变化
    handleSizeChange(val) {
      this.page_size = val;
      this.currentPage = 1;

      if (this.searchKeyword) {
        this.searchBooks(this.searchKeyword, 1, this.page_size);
      } else if (this.sortId) {
        this.getBookList(this.sortId, 1, this.page_size);
      } else {
        this.applySorting();
      }
    },

    // 当前页变化
    handleCurrentChange(val) {
      this.currentPage = val;

      if (this.searchKeyword) {
        this.searchBooks(this.searchKeyword, this.currentPage, this.page_size);
      } else if (this.sortId) {
        this.getBookList(this.sortId, this.currentPage, this.page_size);
      } else {
        this.applySorting();
      }
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
    },

    // 处理搜索
    handleSearch() {
      const keyword = this.searchKeyword.trim();
      if (!keyword) {
        this.$message.warning('请输入搜索关键词');
        return;
      }

      // 清除分类搜索
      this.sortId = null;
      this.sortName = "";
      this.currentPage = 1;

      // 更新URL，并捕获重复导航的错误
      if (this.$route.query.keyword !== keyword) {
        this.$router.push({
          path: '/search',
          query: { keyword: keyword }
        }).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
        });
      }

      this.searchBooks(keyword, 1, this.page_size);
      this.hideSuggestions();
    },

    // 清除搜索
    handleClearSearch() {
      this.searchKeyword = "";
      this.hideSuggestions();
    },

    // 清除搜索并重置
    clearSearch() {
      this.searchKeyword = "";
      this.bookList = [];
      this.originalBookList = [];
      this.total = 0;
      this.currentPage = 1;

      // 重置URL
      this.$router.push({ path: '/search' });
    },

    // 选择搜索建议
    selectSuggestion(suggestion) {
      this.searchKeyword = suggestion;
      this.handleSearch();
    },

    // 显示搜索建议
    showSearchSuggestions() {
      if (this.searchKeyword.trim() && this.searchHistory.length > 0) {
        this.searchSuggestions = this.searchHistory
          .filter(item => item.includes(this.searchKeyword.toLowerCase()))
          .slice(0, 5);
        this.showSuggestions = true;
      }
    },

    // 隐藏搜索建议
    hideSuggestions() {
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200);
    },

    // 保存搜索历史
    saveSearchHistory(keyword) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      if (normalizedKeyword && !this.searchHistory.includes(normalizedKeyword)) {
        this.searchHistory.unshift(normalizedKeyword);
        if (this.searchHistory.length > 10) {
          this.searchHistory = this.searchHistory.slice(0, 10);
        }
        // 保存到localStorage
        localStorage.setItem('bookstore_search_history', JSON.stringify(this.searchHistory));
      }
    },

    // 加载搜索历史
    loadSearchHistory() {
      try {
        const history = localStorage.getItem('bookstore_search_history');
        if (history) {
          this.searchHistory = JSON.parse(history);
        }
      } catch (err) {
        console.error('加载搜索历史失败:', err);
      }
    },

    // 排序变化处理
    handleSortChange(sortType) {
      this.sortType = sortType;
      this.applySorting();
    }
  },

  created() {
    // 加载搜索历史
    this.loadSearchHistory();

    // 获取分类列表
    this.getSortList();

    // 根据URL参数初始化
    this.initFromRoute();
  },

  watch: {
    $route() {
      this.initFromRoute();
    },

    // 监听搜索关键词变化，显示搜索建议
    searchKeyword(newVal, oldVal) {
      if (newVal.trim()) {
        this.showSearchSuggestions();

        // 实时搜索处理
        if (this.enableRealTimeSearch && newVal !== oldVal) {
          this.handleRealTimeSearch();
        }
      } else {
        this.hideSuggestions();
        if (this.enableRealTimeSearch) {
          this.clearSearchResults();
        }
      }
    }
  },
}
</script>

<style scoped>
/* 🔍 现代化搜索页面样式 */

.modern-search-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
}

.modern-search-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 📦 通用容器 */
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 🎨 搜索头部横幅 */
.search-hero {
  position: relative;
  height: 450px;
  overflow: visible;
  margin-bottom: 0;
}

.hero-background {
  position: relative;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 60px 20px;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.hero-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
}

.hero-content {
  position: relative;
  text-align: center;
  color: white;
  max-width: 800px;
  width: 100%;
}

.hero-text {
  margin-bottom: 40px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.title-icon {
  font-size: 3rem;
  margin-right: 15px;
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.hero-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  font-weight: 300;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin: 0;
}

/* 🔍 主搜索框样式 */
.hero-search {
  width: 100%;
}

.search-box-main {
  position: relative;
  margin-bottom: 30px;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50px;
  padding: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-input-container:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.search-icon {
  position: absolute;
  left: 25px;
  color: #667eea;
  font-size: 20px;
  z-index: 3;
}

.search-input-main {
  flex: 1;
  border: none;
  outline: none;
  padding: 18px 25px 18px 60px;
  font-size: 16px;
  background: transparent;
  color: #333;
  border-radius: 50px;
}

.search-input-main::placeholder {
  color: #999;
  font-weight: 400;
}

.search-btn-main {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 40px;
  padding: 15px 30px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
}

.search-btn-main:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.search-btn-main:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.search-btn-main i {
  font-size: 16px;
}

/* 搜索建议 - Hero版本 */
.search-suggestions-hero {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  margin-top: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  overflow: hidden;
  z-index: 1000;
}

.suggestion-item-hero {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 25px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.suggestion-item-hero:last-child {
  border-bottom: none;
}

.suggestion-item-hero:hover {
  background: rgba(102, 126, 234, 0.1);
}

.suggestion-item-hero i {
  color: #667eea;
  font-size: 14px;
}

.suggestion-item-hero span {
  color: #333;
  font-size: 15px;
}

/* 快速搜索标签 */
.quick-search-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.tags-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  margin-right: 8px;
}

.quick-tag {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.quick-tag:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-title i {
  margin-right: 12px;
  font-size: 2.2rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 🎯 搜索主体 */
.search-main {
  padding: 40px 0 60px;
  background: white;
  position: relative;
  z-index: 2;
  margin-top: -60px;
  border-radius: 30px 30px 0 0;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 400px);
}

/* 🎛️ 搜索控制面板 */
.search-controls-panel {
  margin-bottom: 30px;
}

.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 20px 30px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.controls-left {
  flex: 1;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 面包屑导航 */
.breadcrumb-nav {
  margin-bottom: 12px;
}

.breadcrumb-link {
  color: #667eea;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #5a67d8;
}

.breadcrumb-category,
.breadcrumb-search {
  color: #4a5568;
  font-weight: 500;
}

/* 搜索统计 */
.search-stats {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stats-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-text {
  color: #4a5568;
  font-size: 14px;
}

.stats-number {
  color: #667eea;
  font-weight: 600;
  font-size: 16px;
}

.keyword-em {
  color: #e53e3e;
  font-style: normal;
  font-weight: 500;
  background: rgba(229, 62, 62, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.no-results {
  color: #e53e3e;
}

.no-results-text {
  margin-left: 5px;
}

/* 搜索选项 */
.search-options-compact {
  display: flex;
  align-items: center;
  gap: 15px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  color: #4a5568;
  white-space: nowrap;
}

.history-dropdown {
  position: relative;
}

.history-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #667eea;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.history-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #5a67d8;
}

.history-menu {
  min-width: 200px;
}

.history-header {
  padding: 12px 16px;
  font-size: 12px;
  color: #718096;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: #4a5568;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: #f7fafc;
  color: #667eea;
}

.clear-history {
  color: #e53e3e;
}

.clear-history:hover {
  background: rgba(229, 62, 62, 0.1);
}

/* 🎛️ 图书工具栏样式 */
.books-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
  gap: 20px;
}

.books-section {
  flex: 1;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.sort-section,
.filter-section,
.view-section,
.pagesize-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  white-space: nowrap;
  min-width: 60px;
}

.toolbar-label i {
  color: #667eea;
  font-size: 16px;
}

.sort-select,
.pagesize-select {
  min-width: 140px;
}

.filter-group {
  border-radius: 8px;
  overflow: hidden;
}

.filter-btn {
  border-radius: 0 !important;
  font-size: 13px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.filter-btn:first-child {
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
}

.filter-btn:last-child {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}

.view-toggle {
  border-radius: 8px;
  overflow: hidden;
}

.view-btn {
  border-radius: 0 !important;
  transition: all 0.3s ease;
}

.view-btn:first-child {
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
}

.view-btn:last-child {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
}

.view-text {
  font-size: 13px;
}

/* 📚 图书区域布局 */
.books-area {
  flex: 1;
  min-height: 400px;
}

.search-content {
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 🔍 搜索区域 */
.search-section {
  background: white;
  padding: 40px 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.search-box-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-box-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto 30px;
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.search-input:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.search-input .el-input__inner {
  border: 2px solid #f0f0f0;
  padding: 18px 60px 18px 60px;
  font-size: 16px;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.search-input .el-input__inner:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input .el-input-group__prepend {
  border: none;
  background: transparent;
  padding: 0 20px;
  border-radius: 50px 0 0 50px;
}

.search-icon {
  color: #999;
  font-size: 18px;
}

.search-input .el-input-group__append {
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 50px 50px 0;
  padding: 0;
}

.search-btn {
  border: none;
  background: transparent;
  color: white;
  padding: 18px 30px;
  font-weight: 600;
  font-size: 16px;
  border-radius: 0 50px 50px 0;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(-2px);
}

.search-suggestions-hero {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid #f0f0f0;
  border-top: none;
  z-index: 101;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px 0;
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.suggestions-title {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.suggestions-count {
  font-size: 12px;
  color: #999;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: linear-gradient(90deg, #f8f9ff 0%, #fff 100%);
  transform: translateX(4px);
}

.suggestion-icon {
  color: #667eea;
  font-size: 14px;
  flex-shrink: 0;
}

.suggestion-text {
  color: #333;
  font-size: 14px;
  flex: 1;
}

.suggestion-arrow {
  color: #ccc;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.suggestion-item:hover .suggestion-arrow {
  opacity: 1;
}

/* 搜索建议动画 */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 🔧 搜索控制区域 */
.search-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
}

.search-options {
  display: flex;
  align-items: center;
  gap: 20px;
}

.realtime-checkbox {
  font-size: 14px;
}

.option-text {
  color: #666;
  font-weight: 500;
}

.clear-history-btn {
  color: #999;
  font-size: 13px;
  padding: 4px 8px;
  transition: all 0.3s ease;
}

.clear-history-btn:hover {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

/* 🏷️ 快速搜索标签 */
.quick-search-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tags-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-right: 8px;
}

.quick-tag {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
  background: #f8f9fa;
  color: #666;
}

.quick-tag:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 🔄 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #666;
}

.loading-spinner {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: #999;
  margin: 0;
}

/* 📭 空状态优化 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state .empty-icon {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 24px;
}

.empty-state .empty-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
}

.empty-state .empty-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 🎨 关键词高亮 */
mark {
  background-color: #fff3cd !important;
  color: #856404 !important;
  padding: 1px 3px !important;
  border-radius: 2px !important;
  font-weight: 500 !important;
}

/* 📊 搜索结果头部 */
.unified-search-header {
  background-color: #fff;
  padding: 20px 25px;
  border-radius: 8px;
  margin-bottom: 25px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.08);
  border: 1px solid #EBEEF5;
}

.header-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.header-main-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.results-summary {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.results-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.results-icon {
  color: #409EFF;
}

.result-stats {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  color: #606266;
}

.result-count .count-number {
  color: #409EFF;
  font-weight: bold;
}

.no-results-text {
  color: #909399;
}

.clear-search-btn {
  font-size: 13px;
}

.header-actions {
  flex-shrink: 0;
  padding-left: 20px;
}

.history-btn {
  color: #606266;
}

.history-menu {
  width: 200px;
}

/* 📚 搜索内容区域 */
.search-content {
  display: flex;
  gap: 25px;
  align-items: flex-start;
}

.books-area {
  flex: 1;
  min-width: 0;
}

/* 📋 分类侧边栏 */
.category-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  border: 1px solid #EBEEF5;
  align-self: flex-start;
}

.sidebar-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #EBEEF5;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  color: #606266;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.category-item:hover {
  background-color: #f5f7fa;
  color: #409EFF;
}

.category-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
  font-weight: 500;
}

.category-item span {
  flex-grow: 1;
  margin: 0 8px;
}

.category-item .el-icon-arrow-right {
  transition: transform 0.3s ease;
}

.category-item.active .el-icon-arrow-right {
  transform: translateX(3px);
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
  width: 220px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  height: fit-content;
  position: sticky;
  top: 20px;
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

/* 📖 现代化列表视图 */
.books-list-modern {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
}

.book-card-modern {
  display: flex;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  position: relative;
}

.book-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

/* 📷 封面容器 */
.book-cover-wrapper {
  position: relative;
  width: 180px;
  height: 240px;
  flex-shrink: 0;
}

.cover-container {
  position: relative;
  width: calc(100% - 32px);
  height: calc(100% - 32px);
  margin: 16px;
  overflow: hidden;
  border-radius: 12px;
}

.book-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cover-container:hover .book-cover-image {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 14px;
  gap: 8px;
}

.cover-container:hover .cover-overlay {
  opacity: 1;
}

.cover-overlay i {
  font-size: 24px;
}

/* 📋 图书标签 */
.book-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.badge-new {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.badge-hot {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.badge-discount {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
}

/* 📝 图书内容区域 */
.book-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-header {
  margin-bottom: 16px;
}

.book-title-modern {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.title-link {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.title-link:hover {
  color: #667eea;
}

.book-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-stars {
  font-size: 14px;
}

/* 📊 图书元信息 */
.book-meta-modern {
  margin-bottom: 16px;
}

.meta-row {
  display: flex;
  gap: 24px;
  margin-bottom: 8px;
}

.meta-item-modern {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  flex: 1;
}

.meta-icon {
  color: #667eea;
  font-size: 16px;
  width: 16px;
}

.meta-label {
  color: #666;
  font-weight: 500;
  min-width: 60px;
}

.meta-value {
  color: #333;
  flex: 1;
}

/* 📖 图书描述 */
.book-description {
  margin-bottom: 20px;
}

.description-text {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* 💰 价格和操作区域 */
.book-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.price-section-modern {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency {
  color: #e53e3e;
  font-size: 16px;
  font-weight: 600;
}

.current-price-modern {
  color: #e53e3e;
  font-size: 24px;
  font-weight: 700;
}

.price-original {
  display: flex;
  align-items: center;
  gap: 8px;
}

.original-price-modern {
  color: #999;
  font-size: 14px;
  text-decoration: line-through;
}

.discount-percent {
  background: #ff4757;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.action-buttons-modern {
  display: flex;
  gap: 12px;
}

.btn-cart-modern,
.btn-buy-modern {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cart-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.btn-buy-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 101, 101, 0.4);
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

/* 🎯 现代化网格视图 */
.books-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 20px;
}

.book-card-grid {
  height: 100%;
}

.grid-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.grid-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

/* 📷 网格封面 */
.grid-cover-wrapper {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.grid-cover-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.grid-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.grid-cover-container:hover .grid-cover-image {
  transform: scale(1.1);
}

.grid-cover-overlay {
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

.grid-cover-container:hover .grid-cover-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
}

.overlay-content i {
  font-size: 32px;
}

/* 📋 网格标签 */
.grid-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;
}

.grid-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 💰 网格价格标签 */
.grid-price-tag {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: baseline;
  gap: 2px;
  backdrop-filter: blur(10px);
}

.grid-currency {
  font-size: 14px;
  font-weight: 600;
}

.grid-price {
  font-size: 18px;
  font-weight: 700;
}

/* 📝 网格图书信息 */
.grid-book-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grid-book-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.grid-title-link {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.grid-title-link:hover {
  color: #667eea;
}

.grid-book-author {
  color: #666;
  font-size: 14px;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.grid-rating {
  display: flex;
  align-items: center;
}

.grid-rating-stars {
  font-size: 12px;
}

/* 🛒 网格操作按钮 */
.grid-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.grid-cart-btn,
.grid-buy-btn {
  flex: 1;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.grid-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.grid-buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 101, 101, 0.4);
}

.grid-image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ccc;
  font-size: 14px;
  gap: 8px;
}

.grid-image-error i {
  font-size: 48px;
}

/* 🎯 旧版网格视图（保持兼容性） */
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

