<template>
  <div class="coupon-management">
    <div class="header">
      <h2>优惠券管理</h2>
      <el-button type="primary" @click="showCreateDialog = true">
        <i class="el-icon-plus"></i> 创建优惠券
      </el-button>
    </div>

    <!-- 优惠券列表 -->
    <el-table :data="couponTemplates" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" align="center" header-align="center"></el-table-column>
      <el-table-column prop="name" label="优惠券名称" width="200" align="center" header-align="center"></el-table-column>
      <el-table-column prop="typeDesc" label="类型" width="100" align="center" header-align="center"></el-table-column>
      <el-table-column label="优惠信息" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <div>{{ formatCouponValue(scope.row) }}</div>
          <div style="color: #666; font-size: 12px;">{{ formatCouponCondition(scope.row) }}</div>
        </template>
      </el-table-column>

      <el-table-column label="库存信息" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <div>总量: {{ scope.row.totalQuantity }}</div>
          <div>已领: {{ scope.row.receivedQuantity }}</div>
          <div>剩余: {{ scope.row.remainingQuantity }}</div>
        </template>
      </el-table-column>
      <el-table-column label="使用率" width="100" align="center" header-align="center">
        <template slot-scope="scope">
          {{ scope.row.usageRate }}%
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center" header-align="center">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.statusDesc }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" align="center" header-align="center"></el-table-column>
      <el-table-column label="操作" width="240" align="center" header-align="center">
        <template slot-scope="scope">
          <div class="action-buttons">
            <el-button size="mini" @click="editTemplate(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              :type="scope.row.status === 1 ? 'warning' : 'success'"
              @click="toggleStatus(scope.row)">
              {{ scope.row.status === 1 ? '停用' : '启用' }}
            </el-button>
            <el-button size="mini" type="danger" @click="deleteTemplate(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑优惠券对话框 -->
    <el-dialog 
      :title="isEdit ? '编辑优惠券' : '创建优惠券'" 
      :visible.sync="showCreateDialog"
      width="600px">
      <el-form :model="couponForm" :rules="formRules" ref="couponForm" label-width="120px">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="couponForm.name" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        

        <el-form-item label="优惠券类型" prop="type">
          <el-radio-group v-model="couponForm.type">
            <el-radio :label="1">满减券</el-radio>
            <el-radio :label="2">折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item 
          :label="couponForm.type === 1 ? '减免金额' : '折扣百分比'" 
          prop="discountValue">
          <el-input-number 
            v-model="couponForm.discountValue" 
            :min="0.01" 
            :max="couponForm.type === 1 ? 9999 : 99"
            :precision="2"
            :placeholder="couponForm.type === 1 ? '减免金额（元）' : '折扣百分比（如85表示8.5折）'">
          </el-input-number>
          <span v-if="couponForm.type === 2" style="margin-left: 10px; color: #999;">
            （如85表示8.5折）
          </span>
        </el-form-item>
        
        <el-form-item label="最低消费" prop="minOrderAmount">
          <el-input-number 
            v-model="couponForm.minOrderAmount" 
            :min="0" 
            :precision="2"
            placeholder="最低消费金额（元）">
          </el-input-number>
        </el-form-item>
        
        <el-form-item 
          v-if="couponForm.type === 2" 
          label="最大折扣" 
          prop="maxDiscountAmount">
          <el-input-number 
            v-model="couponForm.maxDiscountAmount" 
            :min="0" 
            :precision="2"
            placeholder="最大折扣金额（元）">
          </el-input-number>
        </el-form-item>
        
        <el-form-item label="发放数量" prop="totalQuantity">
          <el-input-number 
            v-model="couponForm.totalQuantity" 
            :min="1" 
            placeholder="发放总数量">
          </el-input-number>
        </el-form-item>
        
        <el-form-item label="每人限领" prop="perUserLimit">
          <el-input-number 
            v-model="couponForm.perUserLimit" 
            :min="1" 
            placeholder="每用户限领数量">
          </el-input-number>
        </el-form-item>
        
        <el-form-item label="有效天数" prop="validDays">
          <el-input-number 
            v-model="couponForm.validDays" 
            :min="1" 
            placeholder="从领取日开始的有效天数">
          </el-input-number>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  getAllCouponTemplates, 
  createCouponTemplate, 
  updateCouponTemplate,
  updateCouponTemplateStatus,
  deleteCouponTemplate 
} from '@/api/coupon'

export default {
  name: 'CouponManagement',
  data() {
    return {
      couponTemplates: [],
      loading: false,
      showCreateDialog: false,
      isEdit: false,
      submitting: false,
      couponForm: {
        name: '',
        type: 1,
        discountValue: null,
        minOrderAmount: null,
        maxDiscountAmount: null,
        totalQuantity: null,
        perUserLimit: 1,
        validDays: 30
      },
      formRules: {
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],

        type: [
          { required: true, message: '请选择优惠券类型', trigger: 'change' }
        ],
        discountValue: [
          { required: true, message: '请输入折扣值', trigger: 'blur' }
        ],
        minOrderAmount: [
          { required: true, message: '请输入最低消费金额', trigger: 'blur' }
        ],
        totalQuantity: [
          { required: true, message: '请输入发放数量', trigger: 'blur' }
        ],
        perUserLimit: [
          { required: true, message: '请输入每人限领数量', trigger: 'blur' }
        ],
        validDays: [
          { required: true, message: '请输入有效天数', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.loadCouponTemplates()
  },
  methods: {
    async loadCouponTemplates() {
      this.loading = true
      try {
        const response = await getAllCouponTemplates()
        if (response.data.code === 200) {
          this.couponTemplates = response.data.data
        } else {
          this.$message.error('加载优惠券列表失败')
        }
      } catch (error) {
        console.error('加载优惠券列表失败:', error)
        this.$message.error('加载优惠券列表失败')
      } finally {
        this.loading = false
      }
    },
    
    getStatusType(status) {
      return status === 1 ? 'success' : 'danger'
    },
    
    editTemplate(template) {
      this.isEdit = true
      this.couponForm = {
        id: template.id,
        name: template.name,
        type: template.type,
        discountValue: template.discountValue,
        minOrderAmount: template.minOrderAmount,
        maxDiscountAmount: template.maxDiscountAmount,
        totalQuantity: template.totalQuantity,
        perUserLimit: template.perUserLimit,
        validDays: template.validDays
      }
      this.showCreateDialog = true
    },
    
    async submitForm() {
      this.$refs.couponForm.validate(async (valid) => {
        if (valid) {
          this.submitting = true
          try {
            let response
            if (this.isEdit) {
              response = await updateCouponTemplate(this.couponForm.id, this.couponForm)
            } else {
              response = await createCouponTemplate(this.couponForm)
            }
            
            if (response.data.code === 200) {
              this.$message.success(this.isEdit ? '更新成功' : '创建成功')
              this.showCreateDialog = false
              this.resetForm()
              this.loadCouponTemplates()
            } else {
              this.$message.error(response.data.message || '操作失败')
            }
          } catch (error) {
            console.error('提交失败:', error)
            this.$message.error('操作失败')
          } finally {
            this.submitting = false
          }
        }
      })
    },
    
    async toggleStatus(template) {
      const newStatus = template.status === 1 ? 0 : 1
      const action = newStatus === 1 ? '启用' : '停用'
      
      try {
        const response = await updateCouponTemplateStatus(template.id, newStatus)
        if (response.data.code === 200) {
          this.$message.success(`${action}成功`)
          this.loadCouponTemplates()
        } else {
          this.$message.error(`${action}失败`)
        }
      } catch (error) {
        console.error(`${action}失败:`, error)
        this.$message.error(`${action}失败`)
      }
    },
    
    deleteTemplate(template) {
      this.$confirm(
        `确定要删除优惠券"${template.name}"吗？`,
        '确认删除',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          const response = await deleteCouponTemplate(template.id)
          if (response.data.code === 200) {
            this.$message.success('删除成功')
            this.loadCouponTemplates()
          } else {
            this.$message.error(response.data.message || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          // 显示后端返回的具体错误信息
          const errorMessage = (error.response && error.response.data && error.response.data.message) || '删除失败'
          this.$message.error(errorMessage)
        }
      })
    },
    
    resetForm() {
      this.isEdit = false
      this.couponForm = {
        name: '',
        type: 1,
        discountValue: null,
        minOrderAmount: null,
        maxDiscountAmount: null,
        totalQuantity: null,
        perUserLimit: 1,
        validDays: 30
      }
      this.$refs.couponForm && this.$refs.couponForm.resetFields()
    },

    formatCouponValue(template) {
      if (template.type === 1) {
        // 满减券：显示减免金额
        return `减${template.discountValue}元`
      } else {
        // 折扣券：显示折扣
        return `${template.discountValue / 10}折`
      }
    },

    formatCouponCondition(template) {
      if (template.type === 1) {
        // 满减券：显示"满X元可用"
        return `满${template.minOrderAmount || 0}元可用`
      } else {
        // 折扣券：根据是否有门槛显示不同描述
        if (template.minOrderAmount && template.minOrderAmount > 0) {
          return `满${template.minOrderAmount}元可用`
        } else {
          return '无门槛'
        }
      }
    }
  },
  
  watch: {
    showCreateDialog(val) {
      if (!val) {
        this.resetForm()
      }
    }
  }
}
</script>

<style scoped>
.coupon-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #303133;
}

.dialog-footer {
  text-align: right;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.action-buttons .el-button {
  margin: 0;
}
</style>
