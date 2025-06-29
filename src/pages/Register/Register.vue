<template>
  <!-- 📝 现代化注册页面 -->
  <div class="modern-register-page">
    <!-- 🧭 导航栏 -->
    <Nav></Nav>

    <!-- 🎨 注册主体区域 -->
    <main class="register-main">
      <div class="register-container">

        <!-- 🌟 背景装饰 -->
        <div class="background-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
          <div class="decoration-circle circle-4"></div>
        </div>

        <!-- 📱 注册卡片 -->
        <div class="register-card">

          <!-- 🎯 注册头部 -->
          <div class="register-header">
            <div class="logo-section">
              <div class="logo-icon">
                <i class="el-icon-user-solid"></i>
              </div>
              <h1 class="register-title">创建账户</h1>
              <p class="register-subtitle">加入我们，开启阅读之旅</p>
            </div>
          </div>

          <!-- 📝 注册表单 -->
          <div class="register-form-section">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              class="register-form"
              @submit.native.prevent="submitForm('ruleForm')">

              <!-- 👤 账号输入 -->
              <el-form-item prop="account" class="form-item">
                <div class="input-wrapper">
                  <div class="input-icon">
                    <i class="el-icon-message"></i>
                  </div>
                  <el-input
                    v-model="ruleForm.account"
                    type="text"
                    placeholder="请输入手机号或邮箱"
                    autocomplete="username"
                    size="large"
                    class="register-input"
                    @blur="checkAccountAvailability">
                  </el-input>
                  <div class="input-status" v-if="accountStatus">
                    <i :class="accountStatus.icon" :style="{ color: accountStatus.color }"></i>
                  </div>
                </div>
              </el-form-item>

              <!-- 🔒 密码输入 -->
              <el-form-item prop="password" class="form-item">
                <div class="input-wrapper">
                  <div class="input-icon">
                    <i class="el-icon-lock"></i>
                  </div>
                  <el-input
                    v-model="ruleForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="请输入密码"
                    autocomplete="new-password"
                    size="large"
                    class="register-input">
                    <i
                      slot="suffix"
                      :class="showPassword ? 'el-icon-view' : 'el-icon-view-off'"
                      @click="togglePassword"
                      class="password-toggle">
                    </i>
                  </el-input>
                </div>
                <!-- 🔐 密码强度指示器 -->
                <div class="password-strength" v-if="ruleForm.password">
                  <div class="strength-bar">
                    <div
                      class="strength-fill"
                      :class="passwordStrength.class"
                      :style="{ width: passwordStrength.width }">
                    </div>
                  </div>
                  <div class="strength-text" :style="{ color: passwordStrength.color }">
                    {{ passwordStrength.text }}
                  </div>
                </div>
              </el-form-item>

              <!-- 🔒 确认密码输入 -->
              <el-form-item prop="rePassword" class="form-item">
                <div class="input-wrapper">
                  <div class="input-icon">
                    <i class="el-icon-circle-check"></i>
                  </div>
                  <el-input
                    v-model="ruleForm.rePassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="请再次输入密码"
                    autocomplete="new-password"
                    size="large"
                    class="register-input">
                    <i
                      slot="suffix"
                      :class="showConfirmPassword ? 'el-icon-view' : 'el-icon-view-off'"
                      @click="toggleConfirmPassword"
                      class="password-toggle">
                    </i>
                  </el-input>
                  <div class="input-status" v-if="passwordMatchStatus">
                    <i :class="passwordMatchStatus.icon" :style="{ color: passwordMatchStatus.color }"></i>
                  </div>
                </div>
              </el-form-item>

              <!-- ✅ 用户协议 -->
              <div class="agreement-section">
                <el-checkbox v-model="agreeTerms" class="agreement-checkbox">
                  我已阅读并同意
                  <el-button type="text" class="terms-link" @click="showTerms">
                    《用户服务协议》
                  </el-button>
                  和
                  <el-button type="text" class="privacy-link" @click="showPrivacy">
                    《隐私政策》
                  </el-button>
                </el-checkbox>
              </div>

              <!-- 🚀 注册按钮 -->
              <el-form-item class="form-item">
                <el-button
                  type="primary"
                  size="large"
                  :loading="registerLoading"
                  :disabled="!agreeTerms"
                  @click="submitForm('ruleForm')"
                  class="register-button">
                  <span v-if="!registerLoading">
                    <i class="el-icon-user-solid"></i>
                    立即注册
                  </span>
                  <span v-else>注册中...</span>
                </el-button>
              </el-form-item>

              <!-- 🔗 登录链接 -->
              <div class="login-section">
                <span class="login-text">已有账号？</span>
                <router-link to="/login" class="login-link">
                  立即登录
                </router-link>
              </div>

            </el-form>
          </div>

          <!-- 🌐 第三方注册 -->
          <div class="social-register-section">
            <div class="divider">
              <span class="divider-text">或者使用以下方式注册</span>
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
            <h2 class="info-title">加入我们</h2>
            <p class="info-description">
              注册成为我们的会员，享受更多专属服务：
            </p>
            <div class="info-features">
              <div class="feature-item">
                <i class="el-icon-circle-check"></i>
                <span>个性化推荐</span>
              </div>
              <div class="feature-item">
                <i class="el-icon-circle-check"></i>
                <span>会员专享折扣</span>
              </div>
              <div class="feature-item">
                <i class="el-icon-circle-check"></i>
                <span>积分奖励</span>
              </div>
              <div class="feature-item">
                <i class="el-icon-circle-check"></i>
                <span>优先客服</span>
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
import Nav from "../../components/Common/BaseNavigation";
import Footer from "../../components/Common/BaseFooter";
import {reqRegister, reqAccountVerify} from "../../api/user";

export default {
  name: "Register",
  components: { Nav, Footer },

  data() {
    // 账号验证
    const validateAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号'));
        return;
      }
      if (value.length < 3) {
        callback(new Error('账号长度不能少于3位'));
        return;
      }

      // 验证账号是否可用
      reqAccountVerify({account: value}).then((response) => {
        if (response.code === 200) {
          // 200表示账号可以注册，验证通过
          this.accountStatus = {
            icon: 'el-icon-circle-check',
            color: '#67c23a'
          };
          callback();
        } else {
          // 非200表示账号已被注册或其他错误
          this.accountStatus = {
            icon: 'el-icon-circle-close',
            color: '#f56c6c'
          };
          callback(new Error(response.message || '该账号已被注册'));
        }
      }).catch(() => {
        this.accountStatus = {
          icon: 'el-icon-warning',
          color: '#e6a23c'
        };
        callback(new Error('验证账号时出错，请重试'));
      });
    };

    // 密码验证
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'));
      } else {
        // 验证确认密码
        if (this.ruleForm.rePassword) {
          this.$refs.ruleForm.validateField('rePassword');
        }
        callback();
      }
    };

    // 确认密码验证
    const validateRePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        this.passwordMatchStatus = {
          icon: 'el-icon-circle-close',
          color: '#f56c6c'
        };
        callback(new Error('两次输入的密码不一致'));
      } else {
        this.passwordMatchStatus = {
          icon: 'el-icon-circle-check',
          color: '#67c23a'
        };
        callback();
      }
    };

    return {
      // 表单数据
      ruleForm: {
        account: '',
        password: '',
        rePassword: ''
      },

      // 表单验证规则
      rules: {
        account: [
          { validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        rePassword: [
          { validator: validateRePassword, trigger: 'blur' }
        ]
      },

      // UI状态
      showPassword: false,
      showConfirmPassword: false,
      registerLoading: false,
      agreeTerms: false,

      // 状态指示器
      accountStatus: null,
      passwordMatchStatus: null
    };
  },

  computed: {
    // 密码强度计算
    passwordStrength() {
      const password = this.ruleForm.password;
      if (!password) return { width: '0%', class: '', color: '', text: '' };

      let score = 0;
      let text = '';
      let color = '';
      let className = '';

      // 长度检查
      if (password.length >= 6) score += 1;
      if (password.length >= 8) score += 1;

      // 复杂度检查
      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      if (score <= 2) {
        text = '弱';
        color = '#f56c6c';
        className = 'weak';
      } else if (score <= 4) {
        text = '中';
        color = '#e6a23c';
        className = 'medium';
      } else {
        text = '强';
        color = '#67c23a';
        className = 'strong';
      }

      return {
        width: `${Math.min(score * 20, 100)}%`,
        class: className,
        color: color,
        text: text
      };
    }
  },
  methods: {
    // 切换密码显示
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    // 切换确认密码显示
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },

    // 检查账号可用性
    checkAccountAvailability() {
      // 这个方法会在账号输入框失焦时触发验证
      if (this.ruleForm.account) {
        this.$refs.ruleForm.validateField('account');
      }
    },

    // 提交注册表单
    submitForm(formName) {
      if (!this.agreeTerms) {
        this.$message({
          type: 'warning',
          message: '请先同意用户协议和隐私政策'
        });
        return;
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.registerLoading = true;

          // 调用注册API
          reqRegister(this.ruleForm.account, this.ruleForm.password)
            .then((response) => {
              this.registerLoading = false;

              if (response.code === 200) {
                this.$message({
                  type: 'success',
                  message: response.message || '注册成功！',
                  duration: 2000
                });

                // 延迟跳转到登录页面
                setTimeout(() => {
                  this.$router.push({
                    path: '/login',
                    query: { account: this.ruleForm.account }
                  });
                }, 1500);
              } else {
                this.$message({
                  type: 'error',
                  message: response.message || '注册失败，请重试',
                  duration: 3000
                });
              }
            })
            .catch(() => {
              this.registerLoading = false;
              this.$message({
                type: 'error',
                message: '网络错误，请检查网络连接后重试',
                duration: 3000
              });
            });
        } else {
          this.$message({
            type: 'warning',
            message: '请检查输入信息是否正确'
          });
        }
      });
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.accountStatus = null;
      this.passwordMatchStatus = null;
      this.agreeTerms = false;
    },

    // 显示用户协议
    showTerms() {
      this.$alert('这里是用户服务协议的内容...', '用户服务协议', {
        confirmButtonText: '我知道了',
        type: 'info'
      });
    },

    // 显示隐私政策
    showPrivacy() {
      this.$alert('这里是隐私政策的内容...', '隐私政策', {
        confirmButtonText: '我知道了',
        type: 'info'
      });
    }
  }
}
</script>

<style scoped>
/* 📝 现代化注册页面样式 */

.modern-register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

/* 🎨 注册主体区域 */
.register-main {
  padding: 80px 0;
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-container {
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  right: 0;
  bottom: 0;
  overflow: hidden;
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

.circle-4 {
  width: 80px;
  height: 80px;
  top: 30%;
  right: 30%;
  animation-delay: 1s;
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

/* 📱 注册卡片 */
.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideInRight 0.8s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 🎯 注册头部 */
.register-header {
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
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  animation: pulse 2s infinite;
}

.logo-icon i {
  font-size: 36px;
  color: white;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
  }
}

.register-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
}

/* 📝 注册表单 */
.register-form-section {
  margin-bottom: 30px;
}

.register-form {
  width: 100%;
}

.form-item {
  margin-bottom: 25px;
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
  color: #bdc3c7;
  font-size: 18px;
  transition: color 0.3s ease;
}

.register-input {
  width: 100%;
}

.register-input .el-input__inner {
  height: 50px;
  padding-left: 50px;
  padding-right: 50px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.register-input .el-input__inner:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.register-input .el-input__inner:focus + .input-icon {
  color: #667eea;
}

.input-status {
  position: absolute;
  right: 15px;
  z-index: 3;
  font-size: 18px;
}

.password-toggle {
  cursor: pointer;
  color: #bdc3c7;
  font-size: 18px;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #667eea;
}

/* 🔐 密码强度指示器 */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak {
  background: #f56c6c;
}

.strength-fill.medium {
  background: #e6a23c;
}

.strength-fill.strong {
  background: #67c23a;
}

.strength-text {
  font-size: 12px;
  text-align: right;
  font-weight: 500;
}

/* ✅ 用户协议 */
.agreement-section {
  margin: 25px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.agreement-checkbox {
  font-size: 14px;
  line-height: 1.6;
}

.terms-link,
.privacy-link {
  color: #667eea;
  font-weight: 500;
  padding: 0 4px;
  text-decoration: none;
}

.terms-link:hover,
.privacy-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 🚀 注册按钮 */
.register-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.register-button:active {
  transform: translateY(0);
}

.register-button:disabled {
  background: #bdc3c7;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

/* 🔗 登录链接 */
.login-section {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.login-text {
  color: #7f8c8d;
  font-size: 14px;
  margin-right: 8px;
}

.login-link {
  color: #667eea;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 🌐 第三方注册 */
.social-register-section {
  margin-top: 30px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 25px 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.wechat-btn:hover {
  background: #1aad19;
  border-color: #1aad19;
  color: white;
}

.qq-btn:hover {
  background: #12b7f5;
  border-color: #12b7f5;
  color: white;
}

.weibo-btn:hover {
  background: #e6162d;
  border-color: #e6162d;
  color: white;
}

/* 📚 侧边信息 */
.info-section {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: slideInLeft 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.info-content {
  text-align: center;
  color: white;
  max-width: 400px;
}

.info-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.info-description {
  font-size: 18px;
  margin: 0 0 30px 0;
  line-height: 1.6;
  opacity: 0.9;
}

.info-features {
  display: grid;
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(10px);
}

.feature-item i {
  font-size: 20px;
  color: #67c23a;
}

/* 📱 响应式设计 */
@media (max-width: 1200px) {
  .register-container {
    gap: 40px;
  }

  .register-card {
    padding: 30px;
  }
}

@media (max-width: 992px) {
  .register-container {
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: 500px;
  }

  .info-section {
    order: -1;
  }

  .info-content {
    max-width: none;
  }

  .info-title {
    font-size: 36px;
  }

  .info-features {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .register-main {
    padding: 40px 0;
  }

  .register-container {
    padding: 0 15px;
  }

  .register-card {
    padding: 25px 20px;
    border-radius: 16px;
  }

  .logo-icon {
    width: 60px;
    height: 60px;
  }

  .logo-icon i {
    font-size: 28px;
  }

  .register-title {
    font-size: 24px;
  }

  .register-subtitle {
    font-size: 14px;
  }

  .register-input .el-input__inner {
    height: 45px;
    font-size: 14px;
  }

  .register-button {
    height: 45px;
    font-size: 14px;
  }

  .info-title {
    font-size: 28px;
  }

  .info-description {
    font-size: 16px;
  }

  .info-features {
    grid-template-columns: 1fr;
  }

  .feature-item {
    font-size: 14px;
    padding: 10px 15px;
  }
}

@media (max-width: 480px) {
  .register-main {
    padding: 20px 0;
  }

  .register-container {
    padding: 0 10px;
  }

  .register-card {
    padding: 20px 15px;
  }

  .register-title {
    font-size: 20px;
  }

  .register-input .el-input__inner {
    height: 40px;
    padding-left: 40px;
    padding-right: 40px;
  }

  .input-icon {
    left: 12px;
    font-size: 16px;
  }

  .input-status {
    right: 12px;
    font-size: 16px;
  }

  .register-button {
    height: 40px;
  }

  .social-btn {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
}

/* 🎬 动画效果 */
.register-form .form-item {
  animation: fadeInUp 0.6s ease-out;
}

.register-form .form-item:nth-child(1) { animation-delay: 0.1s; }
.register-form .form-item:nth-child(2) { animation-delay: 0.2s; }
.register-form .form-item:nth-child(3) { animation-delay: 0.3s; }
.register-form .form-item:nth-child(4) { animation-delay: 0.4s; }
.register-form .form-item:nth-child(5) { animation-delay: 0.5s; }

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

/* Element UI 组件样式覆盖 */
.el-form-item__error {
  font-size: 12px;
  color: #f56c6c;
  padding-top: 4px;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #667eea;
  border-color: #667eea;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #667eea;
}

.el-loading-mask {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
}

/* 🌙 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .register-card {
    background: rgba(45, 45, 45, 0.95);
    color: #e6e6e6;
  }

  .register-title {
    color: #e6e6e6;
  }

  .register-subtitle {
    color: #bdc3c7;
  }

  .register-input .el-input__inner {
    background: #404040;
    border-color: #555;
    color: #e6e6e6;
  }

  .register-input .el-input__inner:focus {
    background: #4a4a4a;
    border-color: #667eea;
  }

  .agreement-section {
    background: #404040;
  }

  .login-section {
    border-top-color: #555;
  }

  .login-text {
    color: #bdc3c7;
  }

  .divider::before {
    background: #555;
  }

  .divider-text {
    background: rgba(45, 45, 45, 0.95);
    color: #bdc3c7;
  }

  .social-btn {
    background: #404040;
    border-color: #555;
    color: #bdc3c7;
  }
}
</style>

