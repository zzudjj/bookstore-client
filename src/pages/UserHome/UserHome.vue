<template>
  <div class="modern-user-home">
    <!-- 🧭 导航栏 -->
    <Nav></Nav>

    <!-- 👤 用户中心主体 -->
    <main class="user-main">
      <div class="container">

        <!-- 🍞 面包屑导航 -->
        <div class="breadcrumb-nav">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
              <i class="el-icon-house"></i>
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <i class="el-icon-user"></i>
              个人中心
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 📱 用户中心内容 -->
        <div class="user-content">

          <!-- 📋 侧边导航 -->
          <aside class="user-sidebar">
            <div class="user-profile-card">
              <div class="profile-avatar">
                <div class="avatar-cover">
                  <img :src="getAvatarUrl(userInfo.imgUrl)" alt="avatar" />
                </div>
              </div>
              <div class="profile-info">
                <h3 class="username">{{ userInfo.name || '用户' }}</h3>
                <p class="user-level">普通会员</p>
              </div>
            </div>

            <!-- 📂 导航菜单 -->
            <div class="nav-menu">

              <!-- 🏠 个人中心 -->
              <div class="nav-section">
                <div class="section-header">
                  <i class="el-icon-user"></i>
                  <span>个人中心</span>
                </div>
                <div class="nav-items">
                  <router-link
                    to="/user/userCenter"
                    class="nav-item"
                    :class="{ 'active': $route.path === '/user/userCenter' }">
                    <i class="el-icon-s-home"></i>
                    <span>我的主页</span>
                  </router-link>
                  <router-link
                    to="/user/userInfo"
                    class="nav-item"
                    :class="{ 'active': $route.path === '/user/userInfo' }">
                    <i class="el-icon-edit"></i>
                    <span>个人资料</span>
                  </router-link>
                  <router-link
                    to="/user/address"
                    class="nav-item"
                    :class="{ 'active': $route.path === '/user/address' }">
                    <i class="el-icon-location"></i>
                    <span>收货地址</span>
                  </router-link>
                </div>
              </div>

              <!-- 📦 订单中心 -->
              <div class="nav-section">
                <div class="section-header">
                  <i class="el-icon-box"></i>
                  <span>订单中心</span>
                </div>
                <div class="nav-items">
                  <router-link
                    to="/user/userOrder"
                    class="nav-item"
                    :class="{ 'active': $route.path === '/user/userOrder' }">
                    <i class="el-icon-document"></i>
                    <span>我的订单</span>
                  </router-link>
                  <router-link
                    to="/user/coupons"
                    class="nav-item"
                    :class="{ 'active': $route.path === '/user/coupons' }">
                    <i class="el-icon-tickets"></i>
                    <span>优惠券中心</span>
                  </router-link>
                  <router-link
                    to="/user/myComments"
                    class="nav-item"
                    :class="{ 'active': $route.path === '/user/myComments' }">
                    <i class="el-icon-chat-dot-round"></i>
                    <span>我的评价</span>
                  </router-link>
                </div>
              </div>

              <!-- 🎁 会员服务 -->
              <div class="nav-section">
                <div class="section-header">
                  <i class="el-icon-present"></i>
                  <span>会员服务</span>
                </div>
                <div class="nav-items">
                  <router-link
                    to="/user/mesNotice"
                    class="nav-item"
                    :class="{ 'active': $route.path === '/user/mesNotice' }">
                    <i class="el-icon-message"></i>
                    <span>消息通知</span>
                  </router-link>
                </div>
              </div>



            </div>
          </aside>

          <!-- 📄 主要内容区域 -->
          <div class="user-main-content">
            <div class="content-wrapper">
              <router-view></router-view>
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
import { getAvatarUrl } from "../../utils/imageUtils";

export default {
  name: "UserHome",
  components: { Nav, Footer },

  data() {
    return {
      // userInfo: {   // 删除data中的userInfo
      //   name: '',
      //   imgUrl: '',
      //   level: '普通会员'
      // }
    };
  },

  computed: {
    // 获取用户信息，保证响应式
    userInfo() {
      const user = this.$store.getters.getUser || {};
      return {
        name: user.name || user.account || '用户',
        imgUrl: user.imgUrl || user.avatar || '',
        level: user.level || '普通会员'
      };
    }
  },

  methods: {
    getAvatarUrl
    // initUserInfo方法可以删除或保留（已无必要）
  },

  created() {
    // this.initUserInfo(); // 不再需要
  },

  watch: {
    // 不再需要watch
  }
}
</script>

<style scoped>
/* 👤 现代化用户中心样式 */

.modern-user-home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 📦 通用容器 */
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 🎯 用户中心主体 */
.user-main {
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

/* 📱 用户中心内容 */
.user-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* 📋 侧边导航 */
.user-sidebar {
  width: 280px;
  flex-shrink: 0;
}

/* 👤 用户资料卡片 */
.user-profile-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 20px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

.profile-avatar {
  margin-bottom: 15px;
}

.avatar-cover {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  background: #eee;
}

.avatar-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.username {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.user-level {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

/* 📂 导航菜单 */
.nav-menu {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.nav-section {
  border-bottom: 1px solid #f0f0f0;
}

.nav-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 25px 15px;
  font-weight: 600;
  font-size: 16px;
  color: #2c3e50;
  background: #f8f9fa;
}

.section-header i {
  color: #667eea;
  font-size: 18px;
}

.nav-items {
  padding: 10px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 25px;
  color: #7f8c8d;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #667eea;
  transform: translateX(5px);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  border-left-color: #667eea;
  font-weight: 500;
}

.nav-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* 📄 主要内容区域 */
.user-main-content {
  flex: 1;
  min-width: 0;
}

.content-wrapper {
  background: white;
  border-radius: 16px;
  min-height: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 📱 响应式设计 */
@media (max-width: 1200px) {
  .container {
    padding: 0 15px;
  }

  .user-content {
    flex-direction: column;
  }

  .user-sidebar {
    width: 100%;
  }

  .nav-menu {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1px;
    background: #f0f0f0;
  }

  .nav-section {
    background: white;
    border-bottom: none;
  }

  .nav-items {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 15px;
  }

  .nav-item {
    flex: 1;
    min-width: 120px;
    justify-content: center;
    text-align: center;
    padding: 10px;
    border-radius: 8px;
    border-left: none;
  }
}

@media (max-width: 768px) {
  .user-main {
    padding: 20px 0 40px;
  }

  .breadcrumb-nav {
    padding: 12px 20px;
  }

  .user-profile-card {
    padding: 20px;
  }

  .nav-menu {
    grid-template-columns: 1fr;
  }

  .nav-items {
    display: block;
  }

  .nav-item {
    min-width: auto;
    text-align: left;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }

  .user-content {
    gap: 20px;
  }

  .breadcrumb-nav {
    padding: 10px 15px;
  }

  .user-profile-card {
    padding: 15px;
  }

  .username {
    font-size: 16px;
  }

  .section-header {
    padding: 15px 20px 10px;
    font-size: 14px;
  }

  .nav-item {
    padding: 10px 20px;
    font-size: 14px;
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

.user-content {
  animation: fadeInUp 0.6s ease-out;
}

.nav-section {
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
</style>
