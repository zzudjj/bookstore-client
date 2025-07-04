<template>
  <!-- 🏪 现代化管理后台 -->
  <div class="modern-admin-layout">
    <el-container class="admin-container" direction="horizontal">

      <!-- 📂 侧边导航栏 -->
      <el-aside class="admin-sidebar" :width="sidebarWidth + 'px'">

        <!-- 🎯 Logo区域 -->
        <div class="sidebar-header" :class="{ 'collapsed': isCollapsed }">
          <div class="logo-container">
            <div class="logo-icon">
              <i class="el-icon-reading"></i>
            </div>
            <transition name="fade">
              <div v-show="!isCollapsed" class="logo-text">
                <h3 class="logo-title">书店管理</h3>
                <p class="logo-subtitle">Admin Panel</p>
              </div>
            </transition>
          </div>
        </div>

        <!-- 📋 导航菜单 -->
        <el-menu
          :default-active="$route.path"
          :default-openeds="defaultOpeneds"
          :unique-opened="false"
          class="admin-menu"
          @open="handleMenuOpen"
          @close="handleMenuClose"
          background-color="transparent"
          text-color="#8a92b2"
          active-text-color="#667eea"
          :collapse="isCollapsed"
          :collapse-transition="false"
          router>

          <!-- 🏠 仪表盘 -->
          <el-menu-item index="/admin/home" class="menu-item">
            <i class="el-icon-data-analysis menu-icon"></i>
            <span slot="title" class="menu-title">管理仪表盘</span>
          </el-menu-item>

          <!-- 📚 图书管理 -->
          <el-submenu index="books" class="menu-submenu">
            <template slot="title">
              <i class="el-icon-reading menu-icon"></i>
              <span class="menu-title">图书管理</span>
            </template>
            <el-menu-item index="/admin/bookList" class="submenu-item">
              <i class="el-icon-document"></i>
              <span>图书列表</span>
            </el-menu-item>
            <el-menu-item index="/admin/addBook" class="submenu-item">
              <i class="el-icon-plus"></i>
              <span>添加图书</span>
            </el-menu-item>
            <el-menu-item index="/admin/FirstSortList" class="submenu-item">
              <i class="el-icon-collection-tag"></i>
              <span>图书分类</span>
            </el-menu-item>
            <el-menu-item index="/admin/publish" class="submenu-item">
              <i class="el-icon-office-building"></i>
              <span>出版社管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/bookTopicSet" class="submenu-item">
              <i class="el-icon-collection"></i>
              <span>书单专题</span>
            </el-menu-item>
          </el-submenu>

          <!-- 📦 订单管理 -->
          <el-submenu index="orders" class="menu-submenu">
            <template slot="title">
              <i class="el-icon-shopping-bag-2 menu-icon"></i>
              <span class="menu-title">订单管理</span>
            </template>
            <el-menu-item index="/admin/orderList" class="submenu-item">
              <i class="el-icon-tickets"></i>
              <span>订单列表</span>
            </el-menu-item>
            <el-menu-item index="/admin/orderSet" class="submenu-item">
              <i class="el-icon-setting"></i>
              <span>订单设置</span>
            </el-menu-item>
            <el-menu-item index="/admin/returnOrder" class="submenu-item">
              <i class="el-icon-refresh-left"></i>
              <span>退货处理</span>
            </el-menu-item>
            <el-menu-item index="/admin/returnReason" class="submenu-item">
              <i class="el-icon-warning"></i>
              <span>退货原因</span>
            </el-menu-item>
          </el-submenu>

          <!-- 🎯 营销管理 -->
          <el-submenu index="marketing" class="menu-submenu">
            <template slot="title">
              <i class="el-icon-present menu-icon"></i>
              <span class="menu-title">营销管理</span>
            </template>
            <el-menu-item index="/admin/spikeSet" class="submenu-item">
              <i class="el-icon-lightning"></i>
              <span>秒杀活动</span>
            </el-menu-item>
            <el-menu-item index="/admin/bookRecommend" class="submenu-item">
              <i class="el-icon-star-on"></i>
              <span>人气推荐</span>
            </el-menu-item>
            <el-menu-item index="/admin/coupon" class="submenu-item">
              <i class="el-icon-price-tag"></i>
              <span>优惠券</span>
            </el-menu-item>
          </el-submenu>

          <!-- 👥 权限管理 -->
          <el-submenu index="authority" class="menu-submenu">
            <template slot="title">
              <i class="el-icon-user-solid menu-icon"></i>
              <span class="menu-title">权限管理</span>
            </template>
            <el-menu-item index="/admin/userList" class="submenu-item">
              <i class="el-icon-user"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>

          <!-- 💬 评论管理 -->
          <el-submenu index="comment" class="menu-submenu">
            <template slot="title">
              <i class="el-icon-chat-dot-round menu-icon"></i>
              <span class="menu-title">评论管理</span>
            </template>
            <el-menu-item index="/admin/commentList" class="submenu-item">
              <i class="el-icon-chat-dot-round"></i>
              <span>查看评论</span>
            </el-menu-item>
          </el-submenu>

          <!-- 📰 内容管理 -->
          <el-submenu index="content" class="menu-submenu">
            <template slot="title">
              <i class="el-icon-notebook-2 menu-icon"></i>
              <span class="menu-title">内容管理</span>
            </template>
            <el-menu-item index="/admin/announcementManage" class="submenu-item">
              <i class="el-icon-bell"></i>
              <span>公告管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/aboutManage" class="submenu-item">
              <i class="el-icon-info"></i>
              <span>网站介绍</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>

        <!-- 🔧 侧边栏底部 -->
        <div class="sidebar-footer">
          <el-button
            type="text"
            @click="toggleSidebar"
            class="collapse-btn"
            :class="{ 'collapsed': isCollapsed }">
            <i :class="isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
            <span v-show="!isCollapsed">收起菜单</span>
          </el-button>
        </div>

      </el-aside>

      <!-- 📄 主内容区域 -->
      <el-container class="main-container" direction="vertical">

        <!-- 🎯 顶部导航栏 -->
        <el-header class="admin-header">
          <div class="header-left">

            <!-- 🍞 面包屑导航 -->
            <div class="breadcrumb-container">
              <el-breadcrumb separator="/" class="admin-breadcrumb">
                <el-breadcrumb-item :to="{ path: '/admin/home' }">
                  <i class="el-icon-s-home"></i>
                  <span>首页</span>
                </el-breadcrumb-item>
                <el-breadcrumb-item
                  v-for="(item, index) in breadList"
                  :key="index"
                  :to="{ path: item.path }">
                  <span>{{ item.meta.title }}</span>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>

          </div>

          <div class="header-right">

            <!-- 🔔 通知中心 -->
            <div class="header-action">
              <el-badge :value="3" class="notification-badge">
                <el-button type="text" class="action-btn">
                  <i class="el-icon-bell"></i>
                </el-button>
              </el-badge>
            </div>

            <!-- 📧 消息中心 -->
            <div class="header-action">
              <el-badge :value="12" class="message-badge">
                <el-button type="text" class="action-btn">
                  <i class="el-icon-message"></i>
                </el-button>
              </el-badge>
            </div>

            <!-- 🌓 主题切换 -->
            <div class="header-action">
              <el-button type="text" class="action-btn" @click="toggleTheme">
                <i class="el-icon-moon"></i>
              </el-button>
            </div>

            <!-- 👤 用户菜单 -->
            <div class="user-menu">
              <el-dropdown @command="handleUserCommand" trigger="click">
                <div class="user-info">
                  <el-avatar
                    :size="36"
                    :src="userAvatar"
                    class="user-avatar">
                    <i class="el-icon-user-solid"></i>
                  </el-avatar>
                  <div class="user-details">
                    <div class="user-name">{{ userName }}</div>
                    <div class="user-role">管理员</div>
                  </div>
                  <i class="el-icon-arrow-down user-arrow"></i>
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                  <el-dropdown-item command="profile">
                    <i class="el-icon-user"></i>
                    个人资料
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <i class="el-icon-setting"></i>
                    系统设置
                  </el-dropdown-item>
                  <el-dropdown-item divided command="home">
                    <i class="el-icon-house"></i>
                    返回首页
                  </el-dropdown-item>
                  <el-dropdown-item command="logout">
                    <i class="el-icon-switch-button"></i>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

          </div>
        </el-header>

        <!-- 📄 主内容区域 -->
        <el-main class="admin-main">
          <div class="main-content">
            <transition name="fade-transform" mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: "Admin",

  data() {
    return {
      isCollapsed: false,
      defaultOpeneds: [],
      breadList: [],
      isDarkTheme: false,
      userAvatar: '',
      userName: '管理员'
    };
  },

  computed: {
    sidebarWidth() {
      return this.isCollapsed ? 64 : 240;
    },

    ...mapGetters(['getUser'])
  },

  watch: {
    $route: {
      handler() {
        this.getBreadcrumb();
      },
      immediate: true
    }
  },
  methods: {
    // 获取面包屑导航
    getBreadcrumb() {
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title);
      this.breadList = matched;
    },

    // 切换侧边栏
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },

    // 菜单展开
    handleMenuOpen() {
      // 处理菜单展开
    },

    // 菜单收起
    handleMenuClose() {
      // 处理菜单收起
    },

    // 切换主题
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      // 这里可以添加主题切换逻辑
      this.$message({
        type: 'info',
        message: '主题切换功能开发中...'
      });
    },

    // 处理用户菜单命令
    handleUserCommand(command) {
      switch (command) {
        case 'profile':
          this.$message({
            type: 'info',
            message: '个人资料功能开发中...'
          });
          break;
        case 'settings':
          this.$message({
            type: 'info',
            message: '系统设置功能开发中...'
          });
          break;
        case 'home':
          this.$router.push('/');
          break;
        case 'logout':
          this.logout();
          break;
      }
    },

    // 退出登录
    logout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.REMOVE_INFO();
        this.$message({
          type: 'success',
          message: '退出成功！',
          duration: 1500
        });
        setTimeout(() => {
          this.$router.push('/');
        }, 1000);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });
      });
    },

    // 处理窗口大小变化
    handleResize() {
      // 可以在这里添加响应式布局逻辑
      // 例如：根据窗口大小调整侧边栏状态
      const width = window.innerWidth;
      if (width < 768) {
        // 小屏幕时可能需要收起侧边栏
        this.isCollapse = true;
      }
    },

    ...mapMutations(['REMOVE_INFO'])
  },

  mounted() {
    // 获取用户信息
    const user = this.getUser;
    if (user && user.account) {
      this.userName = user.account;
    }

    // 响应式处理
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style scoped>
/* 🏪 现代化管理后台样式 */

.modern-admin-layout {
  height: 100vh;
  background: #f0f2f5;
  overflow: hidden;
}

.admin-container {
  height: 100vh;
}

/* 📂 侧边导航栏 */
.admin-sidebar {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.admin-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  pointer-events: none;
}

/* 🎯 Logo区域 */
.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.sidebar-header.collapsed {
  padding: 20px 10px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
}

.logo-icon i {
  font-size: 20px;
  color: white;
}

.logo-text {
  flex: 1;
  min-width: 0;
}

.logo-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1;
}

/* 📋 导航菜单 */
.admin-menu {
  border: none;
  background: transparent;
  padding: 10px 0;
  position: relative;
  z-index: 1;
}

.admin-menu:not(.el-menu--collapse) {
  width: 240px;
}

.menu-item,
.menu-submenu {
  margin: 2px 15px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.menu-item:hover,
.menu-submenu:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-item.is-active {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
}

.menu-title {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.3s ease;
}

.menu-item.is-active .menu-icon,
.menu-item.is-active .menu-title {
  color: white;
}

.submenu-item {
  margin: 1px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.submenu-item.is-active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.submenu-item i {
  font-size: 14px;
  margin-right: 8px;
  color: rgba(255, 255, 255, 0.6);
}

.submenu-item span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.submenu-item.is-active i,
.submenu-item.is-active span {
  color: white;
}

/* 🔧 侧边栏底部 */
.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.collapse-btn {
  width: 100%;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.collapse-btn.collapsed {
  padding: 8px;
}

.collapse-btn i {
  font-size: 16px;
  margin-right: 8px;
}

.collapse-btn.collapsed i {
  margin-right: 0;
}

/* 📄 主内容区域 */
.main-container {
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
}

/* 🎯 顶部导航栏 */
.admin-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  border-bottom: 1px solid #e8e8e8;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.breadcrumb-container {
  display: flex;
  align-items: center;
}

.admin-breadcrumb {
  font-size: 14px;
}

.admin-breadcrumb .el-breadcrumb__item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.admin-breadcrumb i {
  font-size: 16px;
  color: #667eea;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-action {
  position: relative;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
  transition: all 0.3s ease;
  background: #f5f5f5;
}

.action-btn:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.notification-badge,
.message-badge {
  line-height: 1;
}

.user-menu {
  margin-left: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f5f5f5;
}

.user-info:hover {
  background: #e6f7ff;
  transform: translateY(-1px);
}

.user-avatar {
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1;
}

.user-role {
  font-size: 12px;
  color: #999;
  line-height: 1;
}

.user-arrow {
  font-size: 12px;
  color: #999;
  transition: transform 0.3s ease;
}

.user-info:hover .user-arrow {
  transform: rotate(180deg);
}

/* 📄 主内容区域 */
.admin-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f0f2f5;
}

.main-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-height: calc(100vh - 152px);
  padding: 24px;
  overflow-x: auto;
}

/* 📊 表格响应式处理 */
.main-content .el-table {
  width: 100%;
  min-width: 800px;
}

.main-content .el-table__body-wrapper {
  overflow-x: auto;
}

/* 📱 响应式设计 */
@media (max-width: 1200px) {
  .admin-header {
    padding: 0 16px;
  }

  .admin-main {
    padding: 16px;
  }

  .main-content {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
  }

  .admin-sidebar.show {
    transform: translateX(0);
  }

  .header-left {
    gap: 10px;
  }

  .user-details {
    display: none;
  }

  .user-arrow {
    display: none;
  }

  .header-right {
    gap: 10px;
  }

  .admin-main {
    padding: 12px;
  }

  .main-content {
    padding: 12px;
    border-radius: 6px;
  }

  /* 📱 移动端表格优化 */
  .main-content .el-table {
    min-width: 600px;
    font-size: 12px;
  }

  .main-content .el-table th,
  .main-content .el-table td {
    padding: 8px 4px;
  }
}

@media (max-width: 480px) {
  .admin-header {
    padding: 0 12px;
    height: 56px;
  }

  .breadcrumb-container {
    display: none;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .user-info {
    padding: 6px 8px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }
}

/* 🎬 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Element UI 组件样式覆盖 */
.el-menu--collapse .el-submenu__title span,
.el-menu--collapse .el-submenu__title .el-submenu__icon-arrow,
.el-menu--collapse .el-menu-item span {
  display: none;
}

.el-menu--collapse .el-submenu__title {
  padding: 0 20px !important;
}

.el-menu--collapse .el-menu-item {
  padding: 0 20px !important;
}

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

.el-dropdown-menu {
  border-radius: 8px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
  border: none !important;
  padding: 8px 0 !important;
}

.el-dropdown-menu__item {
  padding: 10px 20px !important;
  font-size: 14px !important;
  transition: all 0.3s ease !important;
}

.el-dropdown-menu__item:hover {
  background: #f5f7fa !important;
  color: #667eea !important;
}

.el-dropdown-menu__item i {
  margin-right: 8px !important;
  font-size: 16px !important;
}

.el-badge__content {
  border: 2px solid white !important;
  font-size: 10px !important;
  height: 18px !important;
  line-height: 14px !important;
  min-width: 18px !important;
  padding: 0 4px !important;
}

.notification-badge .el-badge__content {
  background-color: #f56c6c !important;
}

.message-badge .el-badge__content {
  background-color: #409eff !important;
}

/* 🌙 暗色主题支持 */
.dark-theme .modern-admin-layout {
  background: #1a1a1a;
}

.dark-theme .admin-header {
  background: #2d2d2d;
  border-bottom-color: #404040;
}

.dark-theme .main-content {
  background: #2d2d2d;
  color: #e6e6e6;
}

.dark-theme .action-btn {
  background: #404040;
  color: #e6e6e6;
}

.dark-theme .user-info {
  background: #404040;
}

.dark-theme .user-name {
  color: #e6e6e6;
}

/* 🎯 加载动画 */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.admin-sidebar {
  animation: slideInLeft 0.6s ease-out;
}

.main-container {
  animation: slideInRight 0.6s ease-out 0.2s both;
}

/* 🔄 滚动条样式 */
.admin-main::-webkit-scrollbar {
  width: 6px;
}

.admin-main::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.admin-main::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.admin-main::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.admin-sidebar::-webkit-scrollbar {
  width: 4px;
}

.admin-sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.admin-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.admin-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>

