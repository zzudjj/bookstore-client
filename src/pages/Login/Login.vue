<template>
  <!-- 🔐 现代化登录页面 -->
  <div class="modern-login-page">
    <!-- 🧭 导航栏 -->
    <Nav></Nav>

    <!-- 🎨 登录主体区域 -->
    <main class="login-main">
      <div class="login-container">

        <!-- 🌟 背景装饰 -->
        <div class="background-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>

        <!-- 📱 登录卡片 -->
        <div class="login-card">

          <!-- 🎯 登录头部 -->
          <div class="login-header">
            <div class="logo-section">
              <div class="logo-icon">
                <i class="el-icon-reading"></i>
              </div>
              <h1 class="login-title">欢迎回来</h1>
              <p class="login-subtitle">登录您的书店账户</p>
            </div>
          </div>

          <!-- 📝 登录表单 -->
          <div class="login-form-section">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              class="login-form"
              @submit.native.prevent="login('ruleForm')">

              <!-- 👤 账号输入 -->
              <el-form-item prop="account" class="form-item">
                <el-input
                  v-model="ruleForm.account"
                  type="text"
                  placeholder="请输入手机号或邮箱"
                  autocomplete="username"
                  size="large"
                  class="login-input"
                  @keyup.enter.native="login('ruleForm')">
                </el-input>
              </el-form-item>

              <!-- 🔒 密码输入 -->
              <el-form-item prop="password" class="form-item">
                <el-input
                  v-model="ruleForm.password"
                  type="password"
                  placeholder="请输入密码"
                  autocomplete="current-password"
                  size="large"
                  class="login-input"
                  @keyup.enter.native="login('ruleForm')">
                </el-input>
              </el-form-item>

              <!-- 🔄 记住我和忘记密码 -->
              <div class="form-options">
                <el-checkbox v-model="rememberMe" class="remember-checkbox">
                  记住我
                </el-checkbox>
                <el-button type="text" class="forgot-password">
                  忘记密码？
                </el-button>
              </div>

              <!-- 🚀 登录按钮 -->
              <el-form-item class="form-item">
                <el-button
                  type="primary"
                  size="large"
                  :loading="loginLoading"
                  @click="login('ruleForm')"
                  class="login-button">
                  <span v-if="!loginLoading">
                    <i class="el-icon-right"></i>
                    立即登录
                  </span>
                  <span v-else>登录中...</span>
                </el-button>
              </el-form-item>

              <!-- 🔗 注册链接 -->
              <div class="register-section">
                <span class="register-text">还没有账号？</span>
                <router-link to="/register" class="register-link">
                  立即注册
                </router-link>
              </div>

            </el-form>
          </div>

          <!-- 🌐 第三方登录 -->
          <div class="social-login-section">
            <div class="divider">
              <span class="divider-text">或者使用以下方式登录</span>
            </div>
            <div class="social-buttons">
              <el-button class="social-btn wechat-btn" circle>
                <i class="el-icon-chat-dot-round"></i>
              </el-button>
              <el-button class="social-btn qq-btn" circle>
                <i class="el-icon-user-solid"></i>
              </el-button>
              <el-button class="social-btn weibo-btn" circle>
                <i class="el-icon-star-on"></i>
              </el-button>
            </div>
          </div>

        </div>

        <!-- 📚 侧边信息 -->
        <div class="info-section">
          <div class="info-content">
            <h2 class="info-title">发现好书</h2>
            <p class="info-description">
              在这里，您可以找到各种类型的优质图书，
              从经典文学到现代科技，从儿童读物到专业教材，
              我们为您精心挑选每一本书。
            </p>
            <div class="info-features">
              <div class="feature-item">
                <i class="el-icon-circle-check"></i>
                <span>正版保证</span>
              </div>
              <div class="feature-item">
                <i class="el-icon-circle-check"></i>
                <span>快速配送</span>
              </div>
              <div class="feature-item">
                <i class="el-icon-circle-check"></i>
                <span>优质服务</span>
              </div>
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
import {reqLogin} from "../../api/user";
import Nav from "../../components/Common/BaseNavigation";
import Footer from "../../components/Common/BaseFooter";

export default {
  name: "Login",
  components: { Nav, Footer },

  data() {
    // 账号验证
    const validateAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入账号'));
      }
      if (value.length < 3) {
        return callback(new Error('账号长度不能少于3位'));
      }
      callback();
    };

    // 密码验证
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'));
      }
      if (value.length < 6) {
        return callback(new Error('密码长度不能少于6位'));
      }
      callback();
    };

    return {
      ruleForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ]
      },
      showPassword: false,
      rememberMe: false,
      loginLoading: false
    };
  },

  methods: {
    // 切换密码显示状态
    togglePassword() {
      console.log('切换密码显示状态:', !this.showPassword);
      this.showPassword = !this.showPassword;
    },

    // 登录方法
    login(formName) {
      console.group('登录流程开始');
      console.log('表单验证开始:', formName);
      
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('表单验证通过，准备发送登录请求');
          this.loginLoading = true;
          console.log('登录请求参数:', {
            account: this.ruleForm.account,
            password: this.ruleForm.password
          });

          reqLogin({
            account: this.ruleForm.account,
            password: this.ruleForm.password
          }).then((response) => {
            console.log('登录响应:', {
              status: response.status,
              data: response.data,
              headers: response.headers
            });
            this.loginLoading = false;

            if (response.data.code == 200) {
              const jwt = response.headers['authorization'];
              const user = response.data.user;
              console.log('登录成功，用户信息:', user);
              console.log('JWT Token:', jwt ? '已获取' : '未获取');

              // 保存用户信息和token
              this.$store.commit("SET_TOKEN", jwt);
              this.$store.commit("SET_USERINFO", user);

              // 如果选择记住我，保存到本地存储
              if (this.rememberMe) {
                console.log('记住账号:', this.ruleForm.account);
                localStorage.setItem('rememberedAccount', this.ruleForm.account);
              } else {
                console.log('不记住账号，清除本地存储');
                localStorage.removeItem('rememberedAccount');
              }

              this.$message({
                type: 'success',
                message: "登录成功！",
                duration: 1500
              });

              // 根据用户类型跳转
              setTimeout(() => {
                if (user.manage) {
                  this.$router.push({ path: '/admin/home' });
                } else {
                  // 跳转到登录前的页面或首页
                  const redirect = this.$route.query.redirect || '/';
                  this.$router.push({ path: redirect });
                }
              }, 1000);

            } else {
              this.$message({
                type: 'error',
                message: response.data.message || "登录失败",
                duration: 2000
              });
            }

          }).catch(() => {
            this.loginLoading = false;
            this.$message({
              type: 'error',
              message: "网络错误，请稍后重试",
              duration: 2000
            });
          });

        } else {
          this.$message({
            type: 'warning',
            message: "请检查输入信息",
            duration: 1500
          });
        }
      });
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },

  mounted() {
    // 如果有记住的账号，自动填入
    const rememberedAccount = localStorage.getItem('rememberedAccount');
    if (rememberedAccount) {
      this.ruleForm.account = rememberedAccount;
      this.rememberMe = true;
    }
  }
}
</script>

<style scoped>
/* 🔐 现代化登录页面样式 */

.modern-login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* 🎨 登录主体区域 */
.login-main {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
}

.login-container {
  display: flex;
  max-width: 1200px;
  width: 100%;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 2;
}

/* 🌟 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

/* 📱 登录卡片 */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 🎯 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.logo-icon i {
  font-size: 36px;
  color: white;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 400;
}

/* 📝 登录表单 */
.login-form-section {
  margin-bottom: 30px;
}

.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 25px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  z-index: 3;
  color: #7f8c8d;
  font-size: 18px;
}

.login-input {
  width: 100%;
}

.login-input .el-input__inner {
  height: 50px;
  padding-left: 20px;
  padding-right: 20px;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

.login-input .el-input__inner:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.password-toggle {
  cursor: pointer;
  color: #7f8c8d;
  font-size: 18px;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #667eea;
}

/* 🔄 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.remember-checkbox {
  color: #7f8c8d;
  font-size: 14px;
}

.forgot-password {
  color: #667eea;
  font-size: 14px;
  padding: 0;
  transition: all 0.3s ease;
}

.forgot-password:hover {
  color: #764ba2;
  transform: translateX(2px);
}

/* 🚀 登录按钮 */
.login-button {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

/* 🔗 注册链接 */
.register-section {
  text-align: center;
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid #e9ecef;
}

.register-text {
  color: #7f8c8d;
  font-size: 14px;
  margin-right: 8px;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.register-link:hover {
  color: #764ba2;
  text-decoration: none;
  transform: translateX(2px);
}

/* 🌐 第三方登录 */
.social-login-section {
  margin-top: 30px;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 25px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.divider-text {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 20px;
  color: #7f8c8d;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #e9ecef;
  background: white;
  color: #7f8c8d;
  font-size: 20px;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.wechat-btn:hover {
  border-color: #07c160;
  color: #07c160;
}

.qq-btn:hover {
  border-color: #12b7f5;
  color: #12b7f5;
}

.weibo-btn:hover {
  border-color: #e6162d;
  color: #e6162d;
}

/* 📚 侧边信息 */
.info-section {
  flex: 1;
  max-width: 500px;
  color: white;
  padding: 40px;
}

.info-content {
  text-align: center;
}

.info-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 25px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-description {
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 40px 0;
  opacity: 0.9;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.info-features {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  opacity: 0.9;
}

.feature-item i {
  color: #27ae60;
  font-size: 18px;
}

/* 📱 响应式设计 */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
    gap: 40px;
    max-width: 500px;
  }

  .info-section {
    order: -1;
    max-width: none;
    padding: 20px;
  }

  .info-title {
    font-size: 28px;
  }

  .info-description {
    font-size: 16px;
  }

  .info-features {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .login-main {
    padding: 20px 15px;
    min-height: calc(100vh - 80px);
  }

  .login-card {
    padding: 30px 25px;
    margin: 0 auto;
  }

  .logo-icon {
    width: 60px;
    height: 60px;
  }

  .logo-icon i {
    font-size: 28px;
  }

  .login-title {
    font-size: 24px;
  }

  .login-subtitle {
    font-size: 14px;
  }

  .info-section {
    padding: 15px;
  }

  .info-title {
    font-size: 24px;
  }

  .info-description {
    font-size: 14px;
  }

  .info-features {
    flex-direction: column;
    gap: 10px;
  }

  .feature-item {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .login-main {
    padding: 15px 10px;
  }

  .login-card {
    padding: 25px 20px;
    border-radius: 15px;
  }

  .login-header {
    margin-bottom: 30px;
  }

  .logo-icon {
    width: 50px;
    height: 50px;
  }

  .logo-icon i {
    font-size: 24px;
  }

  .login-title {
    font-size: 20px;
  }

  .form-options {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .social-buttons {
    gap: 10px;
  }

  .social-btn {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  .circle-1,
  .circle-2,
  .circle-3 {
    display: none;
  }
}

/* 🎬 动画效果 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

.login-card {
  animation: slideInUp 0.6s ease-out;
}

.info-section {
  animation: slideInLeft 0.6s ease-out 0.2s both;
}

/* Element UI 组件样式覆盖 */
.el-form-item__error {
  color: #e74c3c !important;
  font-size: 12px !important;
  line-height: 1.4 !important;
  padding-top: 5px !important;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #667eea !important;
  border-color: #667eea !important;
}

.el-checkbox__inner:hover {
  border-color: #667eea !important;
}

.el-button--text {
  padding: 0 !important;
}

.el-button--text:hover {
  background: transparent !important;
}

.el-loading-mask {
  background-color: rgba(255, 255, 255, 0.8) !important;
}

/* 🔒 安全提示 */
.security-tips {
  margin-top: 20px;
  padding: 15px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.security-tips h4 {
  margin: 0 0 10px 0;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
}

.security-tips ul {
  margin: 0;
  padding-left: 20px;
  color: #7f8c8d;
  font-size: 12px;
  line-height: 1.5;
}

.security-tips li {
  margin-bottom: 5px;
}
</style>
