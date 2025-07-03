<template>
  <div class="content">
    <div class="tab_content">
      <div class="first_tab">
        <el-form :model="orderSettings" :rules="rules" ref="orderSettings" label-width="150px">
          <el-form-item label="秒杀订单超过" prop="spikePaymentTimeout">
            <el-input v-model.number="orderSettings.spikePaymentTimeout" class="input-width" type="number">
              <template slot="append">分钟</template>
            </el-input>
            <span class="note-margin">未付款，订单自动关闭</span>
          </el-form-item>

          <el-form-item label="正常订单超过" prop="normalPaymentTimeout">
            <el-input v-model.number="orderSettings.normalPaymentTimeout" class="input-width" type="number">
              <template slot="append">分钟</template>
            </el-input>
            <span class="note-margin">未付款，订单自动关闭</span>
          </el-form-item>

          <el-form-item label="发货超过" prop="deliveryTimeout">
            <el-input v-model.number="orderSettings.deliveryTimeout" class="input-width" type="number">
              <template slot="append">天</template>
            </el-input>
            <span class="note-margin">未收货，订单自动确认收货</span>
          </el-form-item>

          <el-form-item label="收货超过" prop="receiveTimeout">
            <el-input v-model.number="orderSettings.receiveTimeout" class="input-width" type="number">
              <template slot="append">天</template>
            </el-input>
            <span class="note-margin">自动结束交易</span>
          </el-form-item>



          <el-form-item>
            <el-button type="primary" @click="onSubmit('orderSettings')" :loading="loading">确认</el-button>
            <el-button @click="resetForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "OrderSet",
        data() {
            // 验证时间设置的函数
            let checkTimeout = (rule, value, callback) => {
                if (value === null || value === undefined || value === '') {
                    return callback(new Error('时间设置不能为空'));
                }
                if (!Number.isInteger(value) || value <= 0) {
                    return callback(new Error('请输入大于0的整数'));
                }
                callback();
            };

            return {
                loading: false,
                orderSettings: {
                    spikePaymentTimeout: 30,      // 秒杀订单付款超时（分钟）
                    normalPaymentTimeout: 60,     // 正常订单付款超时（分钟）
                    deliveryTimeout: 7,           // 发货超时（天）
                    receiveTimeout: 7             // 收货超时（天）
                },
                rules: {
                    spikePaymentTimeout: [
                        { validator: checkTimeout, trigger: 'blur' }
                    ],
                    normalPaymentTimeout: [
                        { validator: checkTimeout, trigger: 'blur' }
                    ],
                    deliveryTimeout: [
                        { validator: checkTimeout, trigger: 'blur' }
                    ],
                    receiveTimeout: [
                        { validator: checkTimeout, trigger: 'blur' }
                    ]
                }
            };
        },


        methods: {
            // 加载订单设置
            loadOrderSettings() {
                this.loading = true;
                // 调用后端API获取配置
                this.$http.get('/order/config/map').then(response => {
                    if (response.data.code === 200) {
                        const configMap = response.data.data;
                        this.orderSettings = {
                            spikePaymentTimeout: parseInt(configMap.spike_payment_timeout) || 30,
                            normalPaymentTimeout: parseInt(configMap.normal_payment_timeout) || 60,
                            deliveryTimeout: parseInt(configMap.delivery_timeout) || 7,
                            receiveTimeout: parseInt(configMap.receive_timeout) || 7
                        };
                        console.log('加载订单设置成功:', this.orderSettings);
                    } else {
                        this.$message.error('加载订单设置失败：' + response.data.message);
                    }
                }).catch(error => {
                    console.error('加载订单设置失败:', error);
                    this.$message.error('加载订单设置失败');
                }).finally(() => {
                    this.loading = false;
                });
            },

            // 提交表单
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.saveOrderSettings();
                    } else {
                        this.$message.error("请检查输入的设置值");
                        return false;
                    }
                });
            },

            // 保存订单设置
            saveOrderSettings() {
                this.loading = true;

                // 构建配置映射
                const configMap = {
                    spike_payment_timeout: this.orderSettings.spikePaymentTimeout.toString(),
                    normal_payment_timeout: this.orderSettings.normalPaymentTimeout.toString(),
                    delivery_timeout: this.orderSettings.deliveryTimeout.toString(),
                    receive_timeout: this.orderSettings.receiveTimeout.toString()
                };

                // 调用后端API保存配置
                this.$http.put('/order/config/batch', configMap).then(response => {
                    if (response.data.code === 200) {
                        this.$message.success("订单设置保存成功");
                        console.log("订单设置已保存:", this.orderSettings);
                    } else {
                        this.$message.error("保存失败：" + response.data.message);
                    }
                }).catch(error => {
                    console.error("保存订单设置失败:", error);
                    this.$message.error("保存失败，请重试");
                }).finally(() => {
                    this.loading = false;
                });
            },

            // 重置表单
            resetForm() {
                this.$confirm('确定要重置所有设置吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 重置为默认值
                    this.orderSettings = {
                        spikePaymentTimeout: 30,
                        normalPaymentTimeout: 60,
                        deliveryTimeout: 7,
                        receiveTimeout: 7
                    };
                    this.$message.info('已重置为默认设置');
                }).catch(() => {
                    this.$message.info('已取消重置');
                });
            }
        },
        created() {
            // 页面加载时获取订单设置
            this.loadOrderSettings();
        },
    }
</script>

<style scoped>
  .content{
    margin: 0px auto;
    width: 100%;
  }
  .tab_content{
    margin: 10px auto;
    width:800px;
    border: 1px #e8e8e8 solid;
    padding: 50px 15px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .first_tab{
    margin: 10px auto 0px;
    width: 600px;
    padding-top: 20px;
  }

  .input-width {
    width: 50%;
  }

  .note-margin {
    margin-left: 10px;
    color: #909399;
    font-size: 12px;
  }

  .el-form-item {
    margin-bottom: 25px;
  }

  .el-button {
    margin-right: 10px;
  }
</style>
