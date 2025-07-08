<template>
  <div class="modern-nav">
    <div class="nav-container">
      <!-- Logo区域 -->
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <i class="el-icon-reading logo-icon"></i>
          <span class="brand-text">智慧书店</span>
        </router-link>
      </div>

      <!-- 主导航菜单 -->
      <div class="nav-menu">
        <el-menu
          :default-active="$route.path"
          class="modern-menu"
          mode="horizontal"
          @select="handleSelect"
          background-color="transparent"
          text-color="#7f8c8d"
          active-text-color="#2c3e50"
          router>

          <el-menu-item index="/" class="menu-item">
            <i class="el-icon-house menu-icon"></i>
            <span>首页</span>
          </el-menu-item>

          <el-menu-item index="/cart" class="menu-item">
            <el-badge :value="cartCount" :hidden="cartCount === 0" class="cart-badge">
              <i class="el-icon-shopping-cart-2 menu-icon"></i>
            </el-badge>
            <span>购物车</span>
          </el-menu-item>

          <el-menu-item index="/user/userOrder" class="menu-item">
            <i class="el-icon-document menu-icon"></i>
            <span>我的订单</span>
          </el-menu-item>

          <el-menu-item index="/user/mesNotice" class="menu-item">
            <i class="el-icon-message menu-icon"></i>
            <span>消息</span>
          </el-menu-item>

          <el-menu-item index="/user/userCenter" class="menu-item">
            <i class="el-icon-user menu-icon"></i>
            <span>个人中心</span>
          </el-menu-item>

          <!-- 公告 -->
          <el-menu-item index="/announcement" class="menu-item">
            <i class="el-icon-bell menu-icon"></i>
            <span>公告</span>
          </el-menu-item>

          <!-- 关于我们 -->
          <el-menu-item index="/about" class="menu-item">
            <i class="el-icon-info menu-icon"></i>
            <span>关于我们</span>
          </el-menu-item>

        </el-menu>
      </div>

      <!-- 右侧登录注册区域 -->
      <div class="nav-auth">
        <!-- 未登录状态 -->
        <el-dropdown v-if="!isLoggedIn" trigger="hover" placement="bottom-end">
          <span class="auth-trigger">
            <i class="el-icon-user-solid auth-icon"></i>
            <span>登录</span>
            <i class="el-icon-arrow-down auth-arrow"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="auth-dropdown">
            <el-dropdown-item>
              <router-link to="/login" class="dropdown-link">
                <i class="el-icon-key"></i>
                <span>登录</span>
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/register" class="dropdown-link">
                <i class="el-icon-user-solid"></i>
                <span>注册</span>
              </router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 已登录状态 -->
        <el-dropdown v-else trigger="hover" placement="bottom-end" @command="handleUserCommand">
          <span class="auth-trigger user-logged">
            <i class="el-icon-user-solid auth-icon"></i>
            <span>{{ userName }}</span>
            <i class="el-icon-arrow-down auth-arrow"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="auth-dropdown">
            <el-dropdown-item command="profile">
              <i class="el-icon-user"></i>
              <span>个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item command="orders">
              <i class="el-icon-document"></i>
              <span>我的订单</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="isAdmin" command="admin">
              <i class="el-icon-setting"></i>
              <span>管理后台</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <i class="el-icon-switch-button"></i>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: "BaseNavigation",
  data() {
    return {
      cartCount: 0 // 隐藏购物车数量提示
    };
  },
  computed: {
    ...mapGetters(['getUser']),

    // 是否已登录
    isLoggedIn() {
      return this.getUser && this.getUser.account;
    },

    // 用户名
    userName() {
      if (this.isLoggedIn) {
        return this.getUser.name || this.getUser.account || '用户';
      }
      return '';
    },

    // 是否是管理员
    isAdmin() {
      return this.isLoggedIn && this.getUser.manage;
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // 处理菜单选择
      console.log('Selected:', key, keyPath);
    },

    // 处理用户菜单命令
    handleUserCommand(command) {
      switch (command) {
        case 'profile':
          this.$router.push('/user/userCenter');
          break;
        case 'orders':
          this.$router.push('/user/userOrder');
          break;
        case 'admin':
          this.$router.push('/admin/home');
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
        // 如果当前在需要登录的页面，跳转到首页
        if (this.$route.meta.requiresAuth || this.$route.path.includes('/user/') || this.$route.path.includes('/admin/')) {
          this.$router.push('/');
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });
      });
    },

    ...mapMutations(['REMOVE_INFO'])
  }
}
</script>

<style scoped>
/* 🎨 现代化导航栏 - 保持功能，提升美观 */

.modern-nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1001;
  transition: all 0.3s ease;
}

.modern-nav:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.nav-container {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 20px;
}

/* 🏷️ Logo区域美化 */
.nav-brand {
  flex-shrink: 0;
}

.nav-brand .brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
}

.nav-brand .brand-link:hover {
  transform: scale(1.05);
  color: white;
}

.nav-brand .logo-icon {
  font-size: 28px;
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-brand .brand-text {
  font-size: 20px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

/* 📋 菜单美化 */
.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 10px;
  min-width: 0; /* 允许收缩 */
}

/* Element UI 菜单样式覆盖 */
.modern-menu {
  background: transparent !important;
  border: none !important;
  height: 70px;
}

.modern-menu .el-menu-item,
.modern-menu .el-submenu > .el-submenu__title {
  height: 70px !important;
  line-height: 70px !important;
  border: none !important;
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  padding: 0 12px !important;
  margin: 0 2px;
  border-radius: 8px;
  transition: all 0.3s ease !important;
  position: relative;
  font-size: 14px;
  white-space: nowrap;
}

.modern-menu .el-menu-item:hover,
.modern-menu .el-submenu:hover > .el-submenu__title {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.modern-menu .el-menu-item.is-active {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.modern-menu .el-menu-item.is-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background: #ffd700;
  border-radius: 2px;
}

/* 🎯 图标美化 */
.menu-icon {
  margin-right: 8px !important;
  font-size: 16px;
  color: inherit;
}

/* 🛒 购物车徽章美化 */
.cart-badge {
  margin-right: 8px;
}

.cart-badge .el-badge__content {
  background: #ff4757 !important;
  border: 2px solid white !important;
  font-size: 12px !important;
  font-weight: bold !important;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4) !important;
}

/* 🔐 右侧登录注册区域 */
.nav-auth {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: 140px; /* 固定宽度 */
  justify-content: flex-end;
}

.auth-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
}

.auth-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.auth-icon {
  font-size: 16px;
}

.auth-arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.auth-trigger:hover .auth-arrow {
  transform: rotate(180deg);
}

/* 已登录用户样式 */
.user-logged {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.user-logged:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 下拉菜单链接样式 */
.dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  width: 100%;
}

.dropdown-link:hover {
  color: inherit;
  text-decoration: none;
}

/* 📱 响应式设计 */
@media (max-width: 1400px) {
  .modern-menu .el-menu-item,
  .modern-menu .el-submenu > .el-submenu__title {
    padding: 0 8px !important;
    margin: 0 1px;
    font-size: 13px;
  }

  .nav-auth {
    width: 120px;
  }

  .auth-trigger {
    padding: 8px 10px;
    font-size: 13px;
  }
}

@media (max-width: 1200px) {
  .nav-container {
    padding: 0 15px;
  }

  .nav-menu {
    margin: 0 5px;
  }

  .modern-menu .el-menu-item,
  .modern-menu .el-submenu > .el-submenu__title {
    padding: 0 6px !important;
    margin: 0 1px;
    font-size: 12px;
  }

  .nav-auth {
    width: 100px;
  }

  .auth-trigger {
    padding: 8px 8px;
    font-size: 12px;
  }

  .auth-trigger span {
    display: none;
  }

  .auth-icon {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 10px;
    flex-wrap: wrap;
    height: auto;
    min-height: 70px;
  }

  .nav-menu {
    margin: 0 10px;
    order: 2;
    width: 100%;
    justify-content: flex-start;
  }

  .nav-auth {
    order: 1;
    margin-left: auto;
  }

  .modern-menu .el-menu-item,
  .modern-menu .el-submenu > .el-submenu__title {
    padding: 0 8px !important;
    margin: 0 1px;
    font-size: 14px;
    height: 50px !important;
    line-height: 50px !important;
  }

  .nav-brand .brand-text {
    font-size: 18px;
  }

  .nav-brand .logo-icon {
    font-size: 24px;
  }

  .auth-trigger {
    padding: 8px 12px;
    font-size: 14px;
  }

  .auth-trigger span {
    display: none;
  }

  .auth-icon {
    font-size: 18px;
  }
}

/* 🎨 下拉菜单美化 */
.el-dropdown-menu {
  background: white !important;
  border: none !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  border-radius: 12px !important;
  padding: 8px 0 !important;
  margin-top: 8px !important;
}

.el-dropdown-menu .el-dropdown-menu__item {
  padding: 12px 20px !important;
  color: #2c3e50 !important;
  font-weight: 500;
  transition: all 0.3s ease !important;
}

.el-dropdown-menu .el-dropdown-menu__item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
}

.el-dropdown-menu .el-dropdown-menu__item i {
  margin-right: 8px;
  width: 16px;
  text-align: center;
}

/* ✨ 动画效果 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-nav {
  animation: fadeInDown 0.6s ease-out;
}

/* 🌟 悬浮效果 */
.modern-menu .el-menu-item:hover .menu-icon,
.modern-menu .el-submenu:hover .menu-icon {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  80% {
    transform: translateY(-1px);
  }
}
</style>
