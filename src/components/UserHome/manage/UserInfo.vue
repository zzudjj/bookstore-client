<template>
  <div class="content">
    <div class="info">
      <div class="user_card">
        <el-image style="width: 160px; height: 160px;vertical-align: middle;border-radius: 50%;float: left;margin: 20px 10px"
                  :src="getAvatarUrl(user.imgUrl)"
                  fit="fill"></el-image>
        <div class="user_card_info">
          <p style="font-size: 22px;color: #616161">{{user.name}}</p>
          <p style="color: #757575;cursor:pointer" @click="showAvatarDialog = true">修改头像</p>
        </div>
      </div>
      <div class="user_action">
        <p> <span>注册邮箱:</span><span>{{user.account}}</span></p>
        <p> <span>注册时间:</span><span>{{formatDate(user.registerTime)}}</span></p>
        <p> <span>用户状态:</span><span :class="user.enable ? 'status-active' : 'status-disabled'">{{user.enable ? '正常' : '已禁用'}}</span></p>
      </div>
    </div>

    <div class="box_info">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <div class="tab_box">
            <div class="info_display">
              <div class="info_item">
                <label>用户昵称：</label>
                <span>{{user.name}}</span>
              </div>
              <div class="info_item">
                <label>注册邮箱：</label>
                <span>{{user.account}}</span>
              </div>
              <div class="info_item">
                <label>性别：</label>
                <span>{{user.gender || '未设置'}}</span>
              </div>
              <div class="info_item">
                <label>注册时间：</label>
                <span>{{formatDate(user.registerTime)}}</span>
              </div>
              <div class="info_item">
                <label>账户状态：</label>
                <span :class="user.enable ? 'status-active' : 'status-disabled'">
                  {{user.enable ? '正常' : '已禁用'}}
                </span>
              </div>
              <div class="info_item">
                <label>个人简介：</label>
                <span class="info-text">{{user.info || '暂无个人简介'}}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="修改信息" name="second">
          <div class="tab_box">
            <div class="modify_box">
              <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px">
                <el-form-item prop="name" label="用户昵称">
                  <el-input type="text" v-model="userForm.name" autocomplete="off" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item prop="gender" label="性别">
                  <el-radio-group v-model="userForm.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                    <el-radio label="">不设置</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item prop="info" label="个人简介">
                  <el-input
                    type="textarea"
                    v-model="userForm.info"
                    autocomplete="off"
                    placeholder="请输入个人简介"
                    :rows="4"
                    maxlength="200"
                    show-word-limit>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updateUserInfo" :loading="updating">确认修改</el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="third">
          <div class="tab_box">
            <div class="modify_box">
              <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" label-width="100px">
                <el-form-item prop="oldPassword" label="当前密码">
                  <el-input type="password" v-model="passwordForm.oldPassword" autocomplete="off" placeholder="请输入当前密码"></el-input>
                </el-form-item>
                <el-form-item prop="newPassword" label="新密码">
                  <el-input type="password" v-model="passwordForm.newPassword" autocomplete="off" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword" label="确认密码">
                  <el-input type="password" v-model="passwordForm.confirmPassword" autocomplete="off" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updatePassword" :loading="updatingPassword">修改密码</el-button>
                  <el-button @click="resetPasswordForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="修改头像" :visible.sync="showAvatarDialog" width="400px">
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :http-request="uploadAvatar"
        :before-upload="beforeAvatarUpload"
        accept="image/*">
        <img v-if="avatarPreview" :src="avatarPreview" class="avatar-preview" style="width:100px;height:100px;border-radius:50%"/>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAvatarDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAvatarUrl } from "../../../utils/imageUtils";
import { reqGetUserInfo, reqUpdateUserInfo, reqUpdatePassword } from "../../../api/user";
import axios from 'axios';

export default {
    name: "UserInfo",
    data () {
        var validateName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('昵称不能为空'));
            }
            if(value.length > 20){
                callback(new Error('昵称不能超过20个字符'));
            } else {
                callback();
            }
        };

        var validatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (value.length < 6) {
                callback(new Error('密码长度不能少于6位'));
            } else {
                callback();
            }
        };

        var validateConfirmPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.passwordForm.newPassword) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };

        return {
            activeName: 'first',
            userForm: {
                name: '',
                gender: '',
                info: '',
            },
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                info: [
                    { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
                ]
            },
            passwordRules: {
                oldPassword: [
                    { required: true, message: '请输入当前密码', trigger: 'blur' }
                ],
                newPassword: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                confirmPassword: [
                    { validator: validateConfirmPassword, trigger: 'blur' }
                ]
            },
            showAvatarDialog: false,
            avatarPreview: '',
            updating: false,
            updatingPassword: false
        }
    },
    computed: {
        user() {
            return this.$store.getters.getUser || {};
        }
    },
    mounted(){
        this.initUserForm();
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        getAvatarUrl,

        // 初始化用户表单
        initUserForm() {
            this.userForm = {
                name: this.user.name || '',
                gender: this.user.gender || '',
                info: this.user.info || ''
            };
        },

        // 格式化日期
        formatDate(dateStr) {
            if (!dateStr) return '未知';
            const date = new Date(dateStr);
            return date.toLocaleDateString('zh-CN');
        },

        // 更新用户信息
        updateUserInfo() {
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    this.updating = true;
                    const token = localStorage.getItem('token');

                    reqUpdateUserInfo(this.userForm, token).then(response => {
                        if (response.code === 200) {
                            this.$message.success('信息更新成功！');
                            // 更新store中的用户信息
                            this.$store.commit('SET_USERINFO', {
                                ...this.user,
                                ...this.userForm
                            });
                        } else {
                            this.$message.error(response.message || '更新失败');
                        }
                    }).catch(() => {
                        this.$message.error('更新失败，请检查网络连接');
                    }).finally(() => {
                        this.updating = false;
                    });
                }
            });
        },

        // 重置表单
        resetForm() {
            this.initUserForm();
            this.$refs.userForm.clearValidate();
        },

        // 修改密码
        updatePassword() {
            this.$refs.passwordForm.validate((valid) => {
                if (valid) {
                    this.updatingPassword = true;
                    const token = localStorage.getItem('token');

                    reqUpdatePassword(this.passwordForm, token).then(response => {
                        if (response.code === 200) {
                            this.$message.success('密码修改成功！');
                            this.resetPasswordForm();
                        } else {
                            this.$message.error(response.message || '密码修改失败');
                        }
                    }).catch(() => {
                        this.$message.error('密码修改失败，请检查网络连接');
                    }).finally(() => {
                        this.updatingPassword = false;
                    });
                }
            });
        },

        // 重置密码表单
        resetPasswordForm() {
            this.passwordForm = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
            this.$refs.passwordForm && this.$refs.passwordForm.clearValidate();
        },

        beforeAvatarUpload(file) {
            this.avatarPreview = URL.createObjectURL(file);
            return true;
        },

        uploadAvatar(option) {
            const formData = new FormData();
            formData.append('file', option.file);
            this.avatarPreview = URL.createObjectURL(option.file);

            axios.post('/user/uploadAvatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token') || ''
                }
            }).then(res => {
                if(res.data && res.data.code === 200) {
                    this.$message.success('头像上传成功！');
                    this.showAvatarDialog = false;
                    this.avatarPreview = '';
                    // 刷新用户信息
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    this.$message.error(res.data.message || '上传失败');
                }
            }).catch(() => {
                this.$message.error('上传失败');
            });
        },
    }
}
</script>

<style scoped>

  .content{
    width: 1000px;
    margin: 40px auto;
    background-color: white;
  }

  .info{
    width: 940px;
    height: 200px;
    margin: 0px auto;
    background-color: #ffffff;
    /*border-bottom: 1px solid #d9d9d9;*/
  }

  .user_card{
    width: 540px;
    height: 200px;
    float: left;
  }

  .user_card_info{
    margin: 75px 0px;
    width: 200px;
    height: 100px;
    display: inline-block;
    line-height: 30px;
  }
  .user_action{
    float: left;
    width: 400px;
    height: 200px;
    padding-top: 65px;
  }
  span{
    color: #757575;
    font-size: 15px;
    margin: 0px 5px;
    line-height: 30px;
  }


  h1{
    color: #757575;
    font-family: 新宋体;
  }
  .box_info{
    width: 960px;
    margin: 10px auto;
  }
  ::v-deep .el-tabs__item {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #757575;
  }
  .tab_box{
    width:960px;
  }

  .noMesInfo{
    text-align: center;
    font-size: 18px;
    color: #757575;
    line-height: 60px
  }

  .secure_box{
    margin: 12px auto 0px;
    width: 960px;
    height: 100px;
    border-top: 1px solid #e5e5e5;
    /*border-bottom: 1px solid #e5e5e5;*/
  }

  .secure_logo{
    display: inline-block;
    width: 60px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 30px;
    color: #ff7f52;
    vertical-align: top;
  }

  .secure_title{
    display: inline-block;
    width: 700px;
    height: 100px;
    vertical-align: top;
    padding-top: 25px;
  }

  .secure_action{
    display: inline-block;
    width: 190px;
    height: 100px;
    text-align: right;
    line-height: 100px;
    vertical-align: top;
  }

  .text_msg{
    color: #757575;
    font-size: 14px;
    line-height: 23px;
  }

  .bind_list{
    width: 230px;
    height: 150px;
    /*border: 1px solid #cacaca;*/
    display: inline-block;
    margin-right: 30px;
    margin-top: 20px;
    padding: 20px 10px;
    vertical-align: top;
  }
  .bookImg{
    margin-top: 10px;
    float: left;
    width: 90px;
    height: 90px;
    border-radius: 10px;
  }
  .bind_account{
    float: left;
    width: 100px;
    height: 105px;
    padding-top: 15px;
    text-align: center;
  }
  .bind_btn{
    width: 80px;
    height: 30px;
    background-color: white;
    border: 1px solid #e1e1e1
  }
  .modify_box{
    margin-top: 30px;
    width: 500px;
    min-height: 270px;
    padding: 15px;
  }

  /* 信息显示样式 */
  .info_display {
    padding: 20px;
  }

  .info_item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .info_item label {
    width: 100px;
    font-weight: bold;
    color: #333;
    margin-right: 20px;
  }

  .info_item span {
    color: #666;
    flex: 1;
  }

  .info-text {
    line-height: 1.6;
    max-width: 400px;
    word-wrap: break-word;
  }

  .status-active {
    color: #67c23a;
    font-weight: bold;
  }

  .status-disabled {
    color: #f56c6c;
    font-weight: bold;
  }

</style>

