<template>
  <div class="content">
    <div class="header-section">
      <h1>
        <i class="el-icon-location"></i>
        收货地址管理
      </h1>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
        添加新地址
      </el-button>
    </div>

    <div class="address-container" v-loading="loading">
      <!-- 空状态 -->
      <div v-if="addressList.length === 0 && !loading" class="empty-state">
        <i class="el-icon-location-outline"></i>
        <p>暂无收货地址</p>
        <el-button type="primary" @click="handleAdd">添加第一个地址</el-button>
      </div>

      <!-- 地址列表 -->
      <div class="address-grid">
        <div
          v-for="address in addressList"
          :key="address.id"
          class="address-card">
          <div class="card-header">
            <div class="user-info">
              <span class="name">{{ address.name }}</span>
              <span class="phone">{{ address.phone }}</span>
            </div>
            <el-tag
              :type="getTagType(address.label)"
              size="small">
              {{ address.label || '默认' }}
            </el-tag>
          </div>

          <div class="address-detail">
            <i class="el-icon-location-outline"></i>
            <span>{{ address.addr }}</span>
          </div>

          <div class="card-actions">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleMod(address)">
              修改
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="delete-btn"
              @click="delAddress(address.id)">
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 地址编辑弹窗 -->
    <el-dialog
      :title="isEdit ? '修改收货地址' : '添加收货地址'"
      :visible.sync="dialogVisible"
      width="500px"
      center
      @close="resetForm">
      <el-form
        ref="addressForm"
        :model="address"
        :rules="addressRules"
        label-width="80px">
        <el-form-item label="收货人" prop="name">
          <el-input
            v-model="address.name"
            placeholder="请输入收货人姓名"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="address.phone"
            placeholder="请输入手机号码"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input
            type="textarea"
            v-model="address.addr"
            placeholder="请输入详细地址"
            :rows="3"
            maxlength="200"
            show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="地址标签" prop="label">
          <el-select v-model="address.label" placeholder="请选择地址标签" style="width: 100%;">
            <el-option label="家" value="家"></el-option>
            <el-option label="公司" value="公司"></el-option>
            <el-option label="学校" value="学校"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="submitting">
          {{ isEdit ? '保存修改' : '添加地址' }}
        </el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {reqDelAddress,reqAddAddress,reqGetAddressList,reqModAddress} from "../../../api/address";
  // <!--用户地址页面-->
    export default {
        name: "Address",
        data() {
            return {
                dialogVisible: false,
                isEdit: false, // 用来判断是添加地址还是修改地址 false:添加 true:修改
                loading: false,
                submitting: false,
                addressList: [],
                address: {
                    id: null,
                    account: "",
                    name: "",
                    phone: "",
                    addr: "",
                    label: "家",
                },
                addressRules: {
                    name: [
                        { required: true, message: '请输入收货人姓名', trigger: 'blur' },
                        { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
                    ],
                    addr: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' },
                        { min: 5, max: 200, message: '地址长度在 5 到 200 个字符', trigger: 'blur' }
                    ],
                    label: [
                        { required: true, message: '请选择地址标签', trigger: 'change' }
                    ]
                }
            };
        },
        created(){
            this.address.account = this.$store.getters.getUser.account;
            this.getAddressList();
        },
        methods: {
            // 获取标签类型
            getTagType(label) {
                const typeMap = {
                    '家': 'success',
                    '公司': 'primary',
                    '学校': 'warning',
                    '其他': 'info'
                };
                return typeMap[label] || 'info';
            },

            // 处理添加操作
            handleAdd(){
                this.resetForm();
                this.dialogVisible = true;
                this.isEdit = false;
            },

            // 处理修改
            handleMod(addr){
                this.address = {
                    id: addr.id,
                    account: addr.account,
                    name: addr.name,
                    phone: addr.phone,
                    addr: addr.addr,
                    label: addr.label || '家'
                };
                this.dialogVisible = true;
                this.isEdit = true;
            },

            // 重置表单
            resetForm() {
                this.address = {
                    id: null,
                    account: this.$store.getters.getUser.account,
                    name: "",
                    phone: "",
                    addr: "",
                    label: "家"
                };
                this.$nextTick(() => {
                    if (this.$refs.addressForm) {
                        this.$refs.addressForm.clearValidate();
                    }
                });
            },

            // 提交处理
            onSubmit() {
                this.$refs.addressForm.validate((valid) => {
                    if (valid) {
                        this.submitting = true;
                        if(this.isEdit){
                            this.modifyAddress();
                        } else {
                            this.addAddress();
                        }
                    } else {
                        this.$message.error("请填写完整的地址信息");
                    }
                });
            },

            // 获取用户地址列表
            getAddressList(){
                this.loading = true;
                const userAccount = this.$store.getters.getUser.account;

                reqGetAddressList(userAccount).then(response => {
                    if(response.code === 200){
                        this.addressList = response.addressList || [];
                    } else {
                        this.$message.warning(response.message || '获取地址列表失败');
                    }
                }).catch(() => {
                    this.$message.error('网络错误，请稍后重试');
                }).finally(() => {
                    this.loading = false;
                });
            },

            // 添加地址
            addAddress(){
                reqAddAddress(this.address).then(response => {
                    if(response.code === 200){
                        this.$message.success('地址添加成功');
                        this.dialogVisible = false;
                        this.getAddressList();
                    } else {
                        this.$message.warning(response.message || '添加地址失败');
                    }
                }).catch(() => {
                    this.$message.error('网络错误，请稍后重试');
                }).finally(() => {
                    this.submitting = false;
                });
            },

            // 修改地址
            modifyAddress(){
                reqModAddress(this.address).then(response => {
                    if(response.code === 200){
                        this.$message.success('地址修改成功');
                        this.dialogVisible = false;
                        this.getAddressList();
                    } else {
                        this.$message.warning(response.message || '修改地址失败');
                    }
                }).catch(() => {
                    this.$message.error('网络错误，请稍后重试');
                }).finally(() => {
                    this.submitting = false;
                });
            },
            // 处理删除地址
            delAddress(id){
                this.$confirm('确定要删除这个收货地址吗？', '删除确认', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    reqDelAddress(id).then(response => {
                        if(response.code === 200){
                            this.$message.success('地址删除成功');
                            this.getAddressList();
                        } else {
                            this.$message.warning(response.message || '删除地址失败');
                        }
                    }).catch(() => {
                        this.$message.error('网络错误，请稍后重试');
                    });
                }).catch(() => {
                    // 用户取消删除
                });
            },

        }
    }
</script>

<style scoped>
/* 主容器 */
.content {
  margin: 10px auto;
  max-width: 1200px;
  width: 95%;
  background-color: white;
  padding: 30px 20px;
  min-height: 600px;
  box-sizing: border-box;
}

/* 头部区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.header-section h1 {
  color: #333;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 24px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-section h1 i {
  color: #409eff;
}

/* 地址容器 */
.address-container {
  min-height: 400px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty-state i {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 16px;
  margin-bottom: 20px;
}

/* 地址网格布局 */
.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* 地址卡片 */
.address-card {
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.address-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
  transform: translateY(-2px);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.user-info .name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.user-info .phone {
  font-size: 14px;
  color: #666;
}

/* 地址详情 */
.address-detail {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  line-height: 1.5;
}

.address-detail i {
  color: #409eff;
  margin-top: 2px;
  flex-shrink: 0;
}

.address-detail span {
  color: #555;
  font-size: 14px;
  word-break: break-all;
}

/* 卡片操作 */
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.delete-btn {
  color: #f56c6c !important;
}

.delete-btn:hover {
  color: #f78989 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 20px 15px;
  }

  .header-section {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .address-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .card-header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
