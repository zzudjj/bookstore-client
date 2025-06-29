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

      <!-- 主导航菜单 - 保持原有功能并美化 -->
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

          <el-submenu index="/auth" class="menu-submenu">
            <template slot="title">
              <i class="el-icon-user menu-icon"></i>
              <span>登录|注册</span>
            </template>
            <el-menu-item index="/login">
              <i class="el-icon-key"></i>
              <span>登录</span>
            </el-menu-item>
            <el-menu-item index="/register">
              <i class="el-icon-user-solid"></i>
              <span>注册</span>
            </el-menu-item>
          </el-submenu>

          <el-menu-item index="/cart" class="menu-item">
            <el-badge :value="cartCount" :hidden="cartCount === 0" class="cart-badge">
              <i class="el-icon-shopping-cart-2 menu-icon"></i>
            </el-badge>
            <span>购物车</span>
          </el-menu-item>

          <el-menu-item index="/user/userInfo" class="menu-item">
            <i class="el-icon-message menu-icon"></i>
            <span>消息</span>
          </el-menu-item>

          <el-menu-item index="/user/userOrder" class="menu-item">
            <i class="el-icon-document menu-icon"></i>
            <span>我的订单</span>
          </el-menu-item>

          <el-menu-item index="/user/userCenter" class="menu-item">
            <i class="el-icon-user menu-icon"></i>
            <span>个人中心</span>
          </el-menu-item>

          <el-menu-item index="/user/applyService" class="menu-item">
            <i class="el-icon-service menu-icon"></i>
            <span>服务</span>
          </el-menu-item>

        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseNavigation",
  data() {
    return {
      cartCount: 3 // 模拟购物车数量
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      // 处理菜单选择
      console.log('Selected:', key, keyPath);
    }
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
  z-index: 1000;
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
  padding: 0 20px !important;
  margin: 0 5px;
  border-radius: 8px;
  transition: all 0.3s ease !important;
  position: relative;
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

/* 📱 响应式设计 */
@media (max-width: 1200px) {
  .nav-container {
    padding: 0 15px;
  }

  .modern-menu .el-menu-item,
  .modern-menu .el-submenu > .el-submenu__title {
    padding: 0 15px !important;
    margin: 0 2px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 10px;
  }

  .modern-menu .el-menu-item,
  .modern-menu .el-submenu > .el-submenu__title {
    padding: 0 10px !important;
    margin: 0 1px;
    font-size: 14px;
  }

  .nav-brand .brand-text {
    font-size: 18px;
  }

  .nav-brand .logo-icon {
    font-size: 24px;
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
