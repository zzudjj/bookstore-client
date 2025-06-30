<template>
  <!-- 🔐 现代化注册页面 -->
  <div class="modern-login-page">
    <!-- 🧭 导航栏 -->
    <Nav></Nav>

    <!-- 🎨 注册主体区域 -->
    <main class="login-main">
      <div class="login-container">

        <!-- 🌟 背景装饰 -->
        <div class="background-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>

        <!-- 📱 注册卡片 -->
        <div class="login-card">

          <!-- 🎯 注册头部 -->
          <div class="login-header">
            <div class="logo-section">
              <div class="logo-icon">
                <i class="el-icon-user-solid"></i>
              </div>
              <h1 class="login-title">创建账户</h1>
              <p class="login-subtitle">加入我们，开启阅读之旅</p>
            </div>
          </div>

          <!-- 📝 注册表单 -->
          <div class="login-form-section">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              class="login-form"
              @submit.native.prevent="submitForm('ruleForm')">

              <!-- 👤 账号输入 -->
              <el-form-item prop="account" class="form-item">
                <div class="input-wrapper">
                  <div class="input-icon">
                    <i class="el-icon-user"></i>
                  </div>
                  <el-input
                    v-model="ruleForm.account"
                    type="text"
                    placeholder="请输入手机号或邮箱"
                    autocomplete="username"
                    size="large"
                    class="login-input"
                    @blur="checkAccountAvailability">
                  </el-input>
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
                    class="login-input">
                    <i
                      slot="suffix"
                      :class="showPassword ? 'el-icon-view' : 'el-icon-view-off'"
                      @click="togglePassword"
                      class="password-toggle">
                    </i>
                  </el-input>
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
                    class="login-input">
                    <i
                      slot="suffix"
                      :class="showConfirmPassword ? 'el-icon-view' : 'el-icon-view-off'"
                      @click="toggleConfirmPassword"
                      class="password-toggle">
                    </i>
                  </el-input>
                </div>
              </el-form-item>

              <!-- ✅ 用户协议 -->
              <div class="form-options">
                <el-checkbox v-model="agreeTerms" class="remember-checkbox">
                  我已阅读并同意《用户协议》和《隐私政策》
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
                  class="login-button">
                  <span v-if="!registerLoading">
                    <i class="el-icon-user-solid"></i>
                    立即注册
                  </span>
                  <span v-else>注册中...</span>
                </el-button>
              </el-form-item>

              <!-- 🔗 登录链接 -->
              <div class="register-section">
                <span class="register-text">已有账号？</span>
                <router-link to="/login" class="register-link">
                  立即登录
                </router-link>
              </div>

            </el-form>
          </div>

        </div>

        <!-- 📚 侧边信息 -->
        <div class="info-section">
          <div class="info-content">
            <h2 class="info-title">加入我们</h2>
            <p class="info-description">
              注册成为我们的会员，享受更多专属服务：
              个性化推荐、会员专享折扣、积分奖励、优先客服等。
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
          callback();
        } else {
          callback(new Error(response.message || '该账号已被注册'));
        }
      }).catch(() => {
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
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      ruleForm: {
        account: '',
        password: '',
        rePassword: ''
      },
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
      showPassword: false,
      showConfirmPassword: false,
      registerLoading: false,
      agreeTerms: false
    };
  },
  
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    
    checkAccountAvailability() {
      if (this.ruleForm.account) {
        this.$refs.ruleForm.validateField('account');
      }
    },
    
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
          
          reqRegister(this.ruleForm.account, this.ruleForm.password)
            .then((response) => {
              this.registerLoading = false;
              
              if (response.code === 200) {
                this.$message({
                  type: 'success',
                  message: response.message || '注册成功！',
                  duration: 2000
                });
                
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
  overflow-x: hidden;
}

/* 🎨 登录主体区域 */
.login-main {
  padding: 80px 0;
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
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
  position: relative;
  z-index: 10;
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
  z-index: 5;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  color: #7f8c8d;
  font-size: 18px;
  pointer-events: none;
}

.login-input {
  width: 100%;
  position: relative;
  z-index: 5;
}

.login-input .el-input__inner {
  height: 50px;
  padding-left: 50px;
  padding-right: 50px;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 5;
}

.login-input .el-input__inner:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.password-toggle {
  position: absolute;
  right: 15px;
  z-index: 3;
  color: #7f8c8d;
  cursor: pointer;
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
  margin: 25px 0;
  font-size: 14px;
}

.remember-checkbox {
  color: #7f8c8d;
}

.forgot-password {
  color: #667eea;
  font-size: 14px;
  padding: 0;
  text-decoration: none;
}

.forgot-password:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 🚀 登录按钮 */
.login-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  background: #bdc3c7;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

/* 🔗 注册链接 */
.register-section {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.register-text {
  color: #7f8c8d;
  font-size: 14px;
  margin-right: 8px;
}

.register-link {
  color: #667eea;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 📚 侧边信息 */
.info-section {
  display: flex;
  align-items: center;
  justify-content: center;
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
  .login-container {
    gap: 40px;
  }

  .login-card {
    padding: 30px;
  }
}

@media (max-width: 992px) {
  .login-container {
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
  .login-main {
    padding: 40px 0;
  }

  .login-container {
    padding: 0 15px;
  }

  .login-card {
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

  .login-title {
    font-size: 24px;
  }

  .login-subtitle {
    font-size: 14px;
  }

  .login-input .el-input__inner {
    height: 45px;
    font-size: 14px;
  }

  .login-button {
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
  .login-main {
    padding: 20px 0;
  }

  .login-container {
    padding: 0 10px;
  }

  .login-card {
    padding: 20px 15px;
  }

  .login-title {
    font-size: 20px;
  }

  .login-input .el-input__inner {
    height: 40px;
    padding-left: 40px;
    padding-right: 40px;
  }

  .input-icon {
    left: 12px;
    font-size: 16px;
  }

  .password-toggle {
    right: 12px;
    font-size: 16px;
  }

  .login-button {
    height: 40px;
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
</style>
