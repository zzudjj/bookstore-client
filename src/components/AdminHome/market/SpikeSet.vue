<template>
  <div class="content">
    <el-card class="box-card" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          size="small"
          @click="handleSearch">
          查询
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          size="small"
          @click="handleReset">
          重置
        </el-button>
      </div>
      <div style="margin-top: 25px">
        <el-form :inline="true" :model="search" size="small" label-width="140px">
          <el-form-item label="活动名称">
            <el-input v-model="search.activityName" placeholder="请输入活动名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        style="float: right"
        size="mini"
        type="primary"
        @click="showAddActivityDialog">
        添加活动
      </el-button>
    </el-card>

    <div class="table_content">
      <el-table
        ref="multipleTable"
        border
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="编号"
          width="70"
          align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column
          prop="activityName"
          label="活动标题"
          align="center">
        </el-table-column>
        <el-table-column
          label="活动状态"
          align="center">
          <template slot-scope="scope">
            <el-tag :type="getDynamicStatusType(scope.row)">
              {{ getDynamicStatusText(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="开始时间"
          align="center">
          <template slot-scope="scope">
            {{ formatDateTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="结束时间"
          align="center">
          <template slot-scope="scope">
            {{ formatDateTime(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="启用/禁用"
          align="center">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status === 1"
              @change="handleStatusChange($event,scope.row,scope.$index)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="260"
          align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="manageGoods(scope.row)"
              >设置商品
              </el-button>
              <el-button
                size="mini"
                @click="editActivity(scope.row)"
              >编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px;width: 100%;">
      <div style="float: left;padding: 0px 0px 10px">
        <el-select v-model="operator" placeholder="批量操作">
          <el-option
            v-for="item in operates"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button
          style="margin-left: 10px"
          @click="operatorBook"
          type="primary"
          size="medium">
          确定
        </el-button>
      </div>
      <div class="block" style="float: right;padding: 0px 0px 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="page_size"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑活动对话框 -->
    <el-dialog
      title="编辑秒杀活动"
      :visible.sync="editDialogVisible"
      width="600px"
      :modal-append-to-body="false"
      :append-to-body="true"
      :z-index="3000"
      @close="handleEditDialogClose">
      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="120px">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="editForm.activityName" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动描述" prop="activityDesc">
          <el-input
            type="textarea"
            v-model="editForm.activityDesc"
            placeholder="请输入活动描述"
            :rows="3">
          </el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="editForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="editForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 商品管理对话框 -->
    <el-dialog
      :title="`管理秒杀商品 - ${currentActivityName}`"
      :visible.sync="goodsDialogVisible"
      width="900px"
      :append-to-body="true"
      :z-index="3000"
      @close="handleGoodsDialogClose">

      <!-- 添加商品区域 -->
      <div style="margin-bottom: 20px;">
        <el-button type="primary" @click="showAddGoodsDialog">添加商品</el-button>
      </div>

      <!-- 商品列表 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column label="图书名称" width="200">
          <template slot-scope="scope">
            {{ scope.row.book ? scope.row.book.bookName : scope.row.bookName || '未知' }}
          </template>
        </el-table-column>
        <el-table-column label="作者" width="120">
          <template slot-scope="scope">
            {{ scope.row.book ? scope.row.book.author : scope.row.author || '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="originalPrice" label="原价" width="80">
          <template slot-scope="scope">
            ¥{{ scope.row.originalPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="spikePrice" label="秒杀价" width="80">
          <template slot-scope="scope">
            ¥{{ scope.row.spikePrice }}
          </template>
        </el-table-column>
        <el-table-column prop="spikeStock" label="秒杀库存" width="100"></el-table-column>
        <el-table-column prop="soldCount" label="已售" width="80"></el-table-column>
        <el-table-column prop="limitPerUser" label="限购数量" width="100">
          <template slot-scope="scope">
            <el-tag size="mini" type="warning">{{ scope.row.limitPerUser || 1 }}件/人</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="80"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="editGoods(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleGoodsPageSizeChange"
        @current-change="handleGoodsPageChange"
        :current-page="goodsCurrentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="goodsPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsTotal"
        style="margin-top: 20px;">
      </el-pagination>
    </el-dialog>

    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      :title="goodsFormMode === 'add' ? '添加秒杀商品' : '编辑秒杀商品'"
      :visible.sync="goodsFormDialogVisible"
      width="600px"
      :append-to-body="true"
      :z-index="3100"
      @close="handleGoodsFormDialogClose">

      <el-form :model="goodsForm" :rules="goodsFormRules" ref="goodsForm" label-width="120px">
        <el-form-item label="选择图书" prop="bookId" v-if="goodsFormMode === 'add'">
          <el-select v-model="goodsForm.bookId" placeholder="请选择图书" filterable style="width: 100%" @change="handleBookChange">
            <el-option
              v-for="book in availableBooks"
              :key="book.id"
              :label="`${book.bookName} - ${book.author} (库存:${book.stock})`"
              :value="book.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图书库存" v-if="goodsFormMode === 'add' && selectedBook">
          <el-input :value="`${selectedBook.stock} 本`" disabled></el-input>
        </el-form-item>

        <el-form-item label="图书名称" v-if="goodsFormMode === 'edit'">
          <el-input v-model="goodsForm.bookName" disabled></el-input>
        </el-form-item>

        <el-form-item label="图书原价" v-if="goodsFormMode === 'edit'">
          <el-input :value="`¥${goodsForm.originalPrice}`" disabled></el-input>
        </el-form-item>

        <el-form-item label="秒杀价格" prop="spikePrice">
          <el-input-number
            v-model="goodsForm.spikePrice"
            :precision="2"
            :min="0.01"
            :max="goodsFormMode === 'edit' ? goodsForm.originalPrice : (selectedBook ? selectedBook.price : 999999)"
            style="width: 100%">
          </el-input-number>
          <div style="color: #909399; font-size: 12px; margin-top: 4px;" v-if="goodsFormMode === 'add' && selectedBook">
            图书原价：¥{{ selectedBook.price }}，秒杀价格不能高于原价
          </div>
          <div style="color: #909399; font-size: 12px; margin-top: 4px;" v-if="goodsFormMode === 'edit'">
            秒杀价格不能高于图书原价：¥{{ goodsForm.originalPrice }}
          </div>
        </el-form-item>

        <el-form-item label="秒杀库存" prop="spikeStock">
          <el-input-number v-model="goodsForm.spikeStock" :min="1" style="width: 100%"></el-input-number>
        </el-form-item>

        <el-form-item label="每人限购" prop="limitPerUser">
          <el-input-number
            v-model="goodsForm.limitPerUser"
            :min="1"
            :max="goodsForm.spikeStock || 999"
            style="width: 100%">
          </el-input-number>
          <div style="color: #909399; font-size: 12px; margin-top: 4px;">
            设置每个用户最多可购买的数量，建议不超过秒杀库存
          </div>
        </el-form-item>

        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="goodsForm.sortOrder" :min="0" style="width: 100%"></el-input-number>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleGoodsFormSubmit" :loading="goodsFormLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加活动对话框 -->
    <el-dialog
      title="添加秒杀活动"
      :visible.sync="addActivityDialogVisible"
      width="600px"
      :append-to-body="true"
      :z-index="3000"
      @close="handleAddActivityDialogClose">

      <el-form :model="addActivityForm" :rules="addActivityRules" ref="addActivityForm" label-width="120px">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="addActivityForm.activityName" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动描述" prop="activityDesc">
          <el-input
            type="textarea"
            v-model="addActivityForm.activityDesc"
            placeholder="请输入活动描述"
            :rows="3">
          </el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="addActivityForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="addActivityForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addActivityForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addActivityDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddActivitySubmit" :loading="addActivityLoading">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import {reqDeleteActivity, reqUpdateActivityStatus, reqGetActivityDetail, reqUpdateActivity, reqBatchOperateActivities} from "../../../api/spike";
    import {reqGetBookList} from "../../../api/book";
    export default {
        name: "SpikeSet",
        data(){
            return{
                loading: true,
                currentPage: 1,
                page_size: 5,
                tableData: [],
                total:null,
                book: {
                    id: null,
                    bookName: '',
                    author: '',
                    isbn: '',
                    publish: '',
                    birthday: '',
                    marketPrice: '',
                    price: '',
                    stock: '',
                    description: '',
                    ImgSrc: [],
                    put: true,
                    coverImg: '',
                    rank: '',
                    newProduct: true,
                    recommend: true,
                    bookSort: [],//图书分类的绑定值
                },
                search: {
                    activityName: '',
                    status: '',
                    startTime: '',
                    endTime: '',
                },
                publishList: [],//出版社下拉选择器
                options: [],//图书分类的联机选择器

                operator: null,
                //批量操作
                operates: [
                    {
                        label: "批量删除",
                        value: "del"
                    },
                    {
                        label: "批量启用",
                        value: "enable"
                    },
                    {
                        label: "批量禁用",
                        value: "disable"
                    }
                ],
                multipleSelection: [],

                // 编辑对话框相关
                editDialogVisible: false,
                editLoading: false,
                editForm: {
                    id: null,
                    activityName: '',
                    activityDesc: '',
                    startTime: '',
                    endTime: '',
                    status: 1
                },
                editRules: {
                    activityName: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                    ],
                    activityDesc: [
                        { required: true, message: '请输入活动描述', trigger: 'blur' }
                    ],
                    startTime: [
                        { required: true, message: '请选择开始时间', trigger: 'change' }
                    ],
                    endTime: [
                        { required: true, message: '请选择结束时间', trigger: 'change' }
                    ]
                },

                // 商品管理相关
                goodsDialogVisible: false,
                currentActivityId: null,
                currentActivityName: '',
                goodsList: [],
                goodsCurrentPage: 1,
                goodsPageSize: 10,
                goodsTotal: 0,

                // 商品表单相关
                goodsFormDialogVisible: false,
                goodsFormMode: 'add', // 'add' 或 'edit'
                goodsFormLoading: false,
                goodsForm: {
                    id: null,
                    bookId: null,
                    bookName: '',
                    spikePrice: 0,
                    originalPrice: 0,
                    spikeStock: 1,
                    limitPerUser: 1,
                    sortOrder: 0,
                    status: 1,
                    activityId: null,
                    soldCount: 0
                },
                goodsFormRules: {
                    bookId: [
                        { required: true, message: '请选择图书', trigger: 'change' }
                    ],
                    spikePrice: [
                        { required: true, message: '请输入秒杀价格', trigger: 'blur' },
                        { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                // 添加模式下的验证
                                if (this.goodsFormMode === 'add' && this.selectedBook && value > this.selectedBook.price) {
                                    callback(new Error(`秒杀价格不能超过图书原价(¥${this.selectedBook.price})`));
                                }
                                // 编辑模式下的验证
                                else if (this.goodsFormMode === 'edit' && value > this.goodsForm.originalPrice) {
                                    callback(new Error(`秒杀价格不能超过图书原价(¥${this.goodsForm.originalPrice})`));
                                } else {
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    spikeStock: [
                        { required: true, message: '请输入秒杀库存', trigger: 'blur' },
                        { type: 'number', min: 1, message: '库存必须大于0', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                if (this.selectedBook && value > this.selectedBook.stock) {
                                    callback(new Error(`秒杀库存不能超过图书库存(${this.selectedBook.stock})`));
                                } else {
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    limitPerUser: [
                        { required: true, message: '请输入限购数量', trigger: 'blur' },
                        { type: 'number', min: 1, message: '限购数量必须大于0', trigger: 'blur' },
                        {
                            validator: (rule, value, callback) => {
                                if (value > this.goodsForm.spikeStock) {
                                    callback(new Error(`限购数量不能超过秒杀库存(${this.goodsForm.spikeStock})`));
                                } else {
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ]
                },
                availableBooks: [],
                selectedBook: null, // 当前选中的图书

                // 添加活动相关
                addActivityDialogVisible: false,
                addActivityLoading: false,
                addActivityForm: {
                    activityName: '',
                    activityDesc: '',
                    startTime: '',
                    endTime: '',
                    status: 1
                },
                addActivityRules: {
                    activityName: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
                    ],
                    activityDesc: [
                        { required: true, message: '请输入活动描述', trigger: 'blur' }
                    ],
                    startTime: [
                        { required: true, message: '请选择开始时间', trigger: 'change' }
                    ],
                    endTime: [
                        { required: true, message: '请选择结束时间', trigger: 'change' }
                    ]
                }
            }
        },
        created:function () {
            this.getSpikeActivities(1,5);
            console.log("秒杀活动管理页面初始化完成！")
        },
        methods: {
            // 获取状态显示文本
            getStatusText(status) {
                const statusMap = {
                    0: '未开始',
                    1: '进行中',
                    2: '已结束',
                    3: '已取消'
                };
                return statusMap[status] || '未知';
            },

            // 获取状态标签类型
            getStatusType(status) {
                const typeMap = {
                    0: 'info',     // 未开始 - 灰色
                    1: 'success',  // 进行中 - 绿色
                    2: 'warning',  // 已结束 - 橙色
                    3: 'danger'    // 已取消 - 红色
                };
                return typeMap[status] || 'info';
            },

            // 动态计算活动状态文本（基于时间）
            getDynamicStatusText(row) {
                const now = new Date();
                const startTime = new Date(row.startTime);
                const endTime = new Date(row.endTime);

                if (row.status === 0) {
                    return '已禁用';
                } else if (now < startTime) {
                    return '未开始';
                } else if (now >= startTime && now < endTime) {
                    return '进行中';
                } else {
                    return '已结束';
                }
            },

            // 动态计算活动状态标签类型（基于时间）
            getDynamicStatusType(row) {
                const now = new Date();
                const startTime = new Date(row.startTime);
                const endTime = new Date(row.endTime);

                if (row.status === 0) {
                    return 'info';     // 已禁用 - 灰色
                } else if (now < startTime) {
                    return 'warning';  // 未开始 - 橙色
                } else if (now >= startTime && now < endTime) {
                    return 'success';  // 进行中 - 绿色
                } else {
                    return 'danger';   // 已结束 - 红色
                }
            },

            // 格式化日期时间
            formatDateTime(dateTimeStr) {
                if (!dateTimeStr) return '';
                const date = new Date(dateTimeStr);
                return date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            },
            //处理选项框的操作，获取表格中哪些选项被选中
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            operatorBook(){
                if(this.multipleSelection.length < 1){
                    this.$message({
                        type: 'warning',
                        message: "请至少选择一项进行操作"
                    });
                    return;
                }

                // 获取选中的活动ID
                let dataList = [];
                for(let i = 0; i < this.multipleSelection.length; i++){
                    dataList.push(this.multipleSelection[i].id);
                }

                let operation = '';
                let operationText = '';

                switch (this.operator) {
                    case "del":
                        operation = "delete";
                        operationText = "删除";
                        break;
                    case "enable":
                        operation = "enable";
                        operationText = "启用";
                        break;
                    case "disable":
                        operation = "disable";
                        operationText = "禁用";
                        break;
                    default:
                        this.$message.warning("请选择操作类型");
                        return;
                }

                this.$confirm(`确定要批量${operationText}选中的活动吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    reqBatchOperateActivities(dataList, operation).then(response => {
                        if(response.code === 200){
                            this.$message.success(response.message || `批量${operationText}成功`);
                            this.getSpikeActivities(this.currentPage, this.page_size);
                        } else {
                            this.$message.error(response.message || `批量${operationText}失败`);
                        }
                    }).catch(err => {
                        console.error('批量操作失败:', err);
                        this.$message.error(`批量${operationText}失败`);
                    });
                }).catch(() => {
                    console.log('取消批量操作');
                });
            },


            //获取图书的分类值
            handleChange(bookSort) {
                console.log("图书的分类是:"+bookSort[0],bookSort[1]);
            },


            //分页函数
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.page_size = val;
                this.getSpikeActivities(1,this.page_size);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                console.log(this.currentPage+":"+this.page_size);
                this.getSpikeActivities(this.currentPage,this.page_size);
            },
            //获取秒杀活动列表
            getSpikeActivities(page, pageSize, searchParams = null){
                this.loading = false;

                // 构建请求参数
                let params = {
                    page: page,
                    pageSize: pageSize
                };

                // 添加搜索参数
                if (searchParams) {
                    Object.assign(params, searchParams);
                } else if (this.search.activityName || this.search.status !== '') {
                    // 使用当前搜索条件
                    if (this.search.activityName) params.activityName = this.search.activityName;
                    if (this.search.status !== '') params.status = this.search.status;
                    if (this.search.startTime) params.startTime = this.search.startTime;
                    if (this.search.endTime) params.endTime = this.search.endTime;
                }

                // 调用API
                this.$http.get('/api/spike/admin/activities', {params}).then(response => {
                    if(response.data.code === 200){
                        this.total = response.data.data.total;
                        this.tableData = response.data.data.activities || [];
                        console.log('获取活动列表成功:', response.data.data);
                    } else {
                        this.$message.error(response.data.message || '获取活动列表失败');
                    }
                }).catch(err => {
                    console.error('获取活动列表失败:', err);
                    this.$message.error('网络错误，请稍后重试');
                });
            },

            // 搜索功能
            handleSearch() {
                console.log('搜索条件:', this.search);
                this.currentPage = 1; // 重置到第一页
                this.getSpikeActivities(1, this.page_size);
            },

            // 重置搜索
            handleReset() {
                this.search = {
                    activityName: '',
                    status: '',
                    startTime: '',
                    endTime: '',
                };
                this.currentPage = 1;
                this.getSpikeActivities(1, this.page_size);
            },


            //管理秒杀商品
            manageGoods(row){
                console.log("管理活动商品，活动ID:", row.id);
                this.currentActivityId = row.id;
                this.currentActivityName = row.activityName;
                this.goodsDialogVisible = true;
                this.loadActivityGoods();
            },

            //编辑活动
            editActivity(row){
                console.log("编辑活动，活动ID:", row.id);
                this.editDialogVisible = true;
                this.loadActivityDetail(row.id);
            },

            // 加载活动详情
            loadActivityDetail(activityId) {
                console.log('正在获取活动详情，ID:', activityId);
                reqGetActivityDetail(activityId).then(response => {
                    console.log('获取活动详情响应:', response);
                    if (response.code === 200) {
                        const activity = response.data;
                        console.log('活动详情数据:', activity);
                        this.editForm = {
                            id: activity.id,
                            activityName: activity.activityName,
                            activityDesc: activity.activityDesc,
                            startTime: activity.startTime,
                            endTime: activity.endTime,
                            status: activity.status
                        };
                        console.log('编辑表单数据:', this.editForm);
                    } else {
                        console.error('获取活动详情失败，响应码:', response.code, '消息:', response.message);
                        this.$message.error(response.message || '获取活动详情失败');
                    }
                }).catch(err => {
                    console.error('获取活动详情网络错误:', err);
                    this.$message.error('网络错误，请检查服务器连接');
                });
            },

            // 编辑对话框关闭
            handleEditDialogClose() {
                this.$refs.editForm.resetFields();
                this.editForm = {
                    id: null,
                    activityName: '',
                    activityDesc: '',
                    startTime: '',
                    endTime: '',
                    status: 1
                };
            },

            // 提交编辑
            handleEditSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.editLoading = true;

                        // 验证时间
                        if (new Date(this.editForm.startTime) >= new Date(this.editForm.endTime)) {
                            this.$message.error('开始时间必须早于结束时间');
                            this.editLoading = false;
                            return;
                        }

                        reqUpdateActivity(this.editForm.id, this.editForm).then(response => {
                            if (response && response.code === 200) {
                                this.$message.success('更新成功');
                                this.editDialogVisible = false;
                                this.getSpikeActivities(this.currentPage, this.page_size);
                            } else {
                                console.error('更新活动失败，响应:', response);
                                this.$message.error((response && response.message) || '更新失败');
                            }
                        }).catch(err => {
                            console.error('更新活动失败:', err);
                            // 检查是否是网络错误或服务器错误
                            if (err.response) {
                                console.error('服务器响应错误:', err.response.status, err.response.data);
                                this.$message.error(`服务器错误: ${err.response.status}`);
                            } else if (err.request) {
                                console.error('网络请求失败:', err.request);
                                this.$message.error('网络请求失败，请检查网络连接');
                            } else {
                                console.error('请求配置错误:', err.message);
                                this.$message.error('请求失败: ' + err.message);
                            }
                        }).finally(() => {
                            this.editLoading = false;
                        });
                    }
                });
            },

            //处理活动状态切换
            handleStatusChange(enabled, row){
                const newStatus = enabled ? 1 : 0; // 1-启用，0-禁用
                console.log(`活动${row.id}状态变更为: ${newStatus}`);

                reqUpdateActivityStatus(row.id, newStatus).then(response => {
                    console.log(response);
                    if(response.code === 200) {
                        row.status = newStatus;
                        this.$message({
                            message: enabled ? '活动已启用' : '活动已禁用',
                            type: "success"
                        });
                    } else {
                        this.$message({
                            message: response.message || '状态更新失败',
                            type: "warning"
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message({
                        message: '状态更新失败',
                        type: "error"
                    });
                });
            },





            //处理删除函数
            handleDelete(index, row){
                this.$confirm('确定要删除这个秒杀活动吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    reqDeleteActivity(row.id).then(response=>{
                        console.log(response);
                        if(response.code==200){
                            this.$message({
                                message: response.message || '删除成功',
                                type: "success"
                            })
                        }else{
                            this.$message({
                                message: response.message || '删除失败',
                                type: "warning"
                            })
                        }
                        this.getSpikeActivities(this.currentPage,this.page_size);
                    }).catch(err=>{
                        console.log(err);
                        this.$message({
                            message: '删除失败',
                            type: "error"
                        })
                    })
                }).catch(()=>{
                    console.log("取消删除了");
                });
            },

            // ========== 添加活动相关方法 ==========

            // 显示添加活动对话框
            showAddActivityDialog() {
                this.addActivityDialogVisible = true;
            },

            // 添加活动对话框关闭
            handleAddActivityDialogClose() {
                this.$refs.addActivityForm && this.$refs.addActivityForm.resetFields();
                this.addActivityForm = {
                    activityName: '',
                    activityDesc: '',
                    startTime: '',
                    endTime: '',
                    status: 1
                };
            },

            // 提交添加活动
            handleAddActivitySubmit() {
                this.$refs.addActivityForm.validate((valid) => {
                    if (valid) {
                        // 验证时间
                        if (new Date(this.addActivityForm.startTime) >= new Date(this.addActivityForm.endTime)) {
                            this.$message.error('开始时间必须早于结束时间');
                            return;
                        }

                        this.addActivityLoading = true;

                        this.$http.post('/api/spike/admin/activities', this.addActivityForm).then(response => {
                            if (response.data.code === 200) {
                                this.$message.success('添加成功');
                                this.addActivityDialogVisible = false;
                                this.getSpikeActivities(this.currentPage, this.pageSize); // 刷新列表
                            } else {
                                this.$message.error(response.data.message || '添加失败');
                            }
                        }).catch(err => {
                            console.error('添加活动失败:', err);
                            this.$message.error('添加失败');
                        }).finally(() => {
                            this.addActivityLoading = false;
                        });
                    }
                });
            },

            // ========== 商品管理相关方法 ==========

            // 加载活动商品列表
            loadActivityGoods() {
                if (!this.currentActivityId) return;

                this.$http.get(`/api/spike/admin/activities/${this.currentActivityId}/goods`, {
                    params: {
                        page: this.goodsCurrentPage,
                        pageSize: this.goodsPageSize
                    }
                }).then(response => {
                    if (response.data.code === 200) {
                        this.goodsList = response.data.data.goods || [];
                        this.goodsTotal = response.data.data.total || 0;
                        console.log('获取商品列表成功:', response.data.data);
                    } else {
                        this.$message.error(response.data.message || '获取商品列表失败');
                    }
                }).catch(err => {
                    console.error('获取商品列表失败:', err);
                    this.$message.error('网络错误，请稍后重试');
                });
            },

            // 商品对话框关闭
            handleGoodsDialogClose() {
                this.currentActivityId = null;
                this.currentActivityName = '';
                this.goodsList = [];
                this.goodsCurrentPage = 1;
                this.goodsTotal = 0;
            },

            // 商品分页大小改变
            handleGoodsPageSizeChange(val) {
                this.goodsPageSize = val;
                this.goodsCurrentPage = 1;
                this.loadActivityGoods();
            },

            // 商品页码改变
            handleGoodsPageChange(val) {
                this.goodsCurrentPage = val;
                this.loadActivityGoods();
            },

            // 显示添加商品对话框
            showAddGoodsDialog() {
                this.goodsFormMode = 'add';
                this.goodsFormDialogVisible = true;
                this.loadAvailableBooks();
            },

            // 编辑商品
            editGoods(goods) {
                this.goodsFormMode = 'edit';
                // 从后端获取完整的商品详情，确保包含所有必要字段
                this.$http.get(`/api/spike/goods/${goods.id}`).then(response => {
                    if (response.data && response.data.code === 200) {
                        const goodsDetail = response.data.data;
                        this.goodsForm = {
                            id: goodsDetail.id,
                            bookId: goodsDetail.bookId,
                            bookName: goodsDetail.book ? goodsDetail.book.bookName : (goodsDetail.bookName || ''),
                            spikePrice: goodsDetail.spikePrice,
                            originalPrice: goodsDetail.originalPrice,
                            spikeStock: goodsDetail.spikeStock,
                            limitPerUser: goodsDetail.limitPerUser || 1,
                            sortOrder: goodsDetail.sortOrder || 0,
                            status: goodsDetail.status || 1,
                            activityId: goodsDetail.activityId,
                            soldCount: goodsDetail.soldCount || 0
                        };

                        // 设置selectedBook以便价格验证生效
                        if (goodsDetail.book) {
                            this.selectedBook = {
                                id: goodsDetail.book.id,
                                bookName: goodsDetail.book.bookName,
                                price: goodsDetail.originalPrice, // 使用原价作为图书价格
                                stock: goodsDetail.book.stock || 0
                            };
                        }
                        this.goodsFormDialogVisible = true;
                    } else {
                        this.$message.error('获取商品详情失败');
                    }
                }).catch(err => {
                    console.error('获取商品详情失败:', err);
                    this.$message.error('获取商品详情失败');
                });
            },

            // 删除商品
            deleteGoods(goods) {
            this.$confirm(`确定要删除商品"${goods.bookName}"吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`/api/spike/admin/goods/${goods.id}`).then(response => {
                    if (response.data.code === 200) {
                        this.$message.success('删除成功');
                        this.loadActivityGoods();
                    } else {
                        this.$message.error(response.data.message || '删除失败');
                    }
                }).catch(err => {
                    console.error('删除商品失败:', err);
                    this.$message.error('删除失败');
                });
            });
        },

        // 商品表单对话框关闭
        handleGoodsFormDialogClose() {
            this.$refs.goodsForm && this.$refs.goodsForm.resetFields();
            this.goodsForm = {
                id: null,
                bookId: null,
                bookName: '',
                spikePrice: 0,
                originalPrice: 0,
                spikeStock: 1,
                limitPerUser: 1,
                sortOrder: 0,
                status: 1,
                activityId: null,
                soldCount: 0
            };
            this.availableBooks = [];
            this.selectedBook = null;
        },

        // 处理图书选择变化
        handleBookChange(bookId) {
            this.selectedBook = this.availableBooks.find(book => book.id === bookId);
            if (this.selectedBook) {
                // 设置秒杀价格默认为图书原价
                this.goodsForm.spikePrice = this.selectedBook.price;
                // 设置原价字段
                this.goodsForm.originalPrice = this.selectedBook.price;
                // 重置秒杀库存，不能超过图书库存
                this.goodsForm.spikeStock = Math.min(this.goodsForm.spikeStock, this.selectedBook.stock);

                // 触发表单验证，确保价格限制生效
                this.$nextTick(() => {
                    if (this.$refs.goodsForm) {
                        this.$refs.goodsForm.validateField('spikePrice');
                        this.$refs.goodsForm.validateField('spikeStock');
                    }
                });
            }
        },

        // 提交商品表单
        handleGoodsFormSubmit() {
            this.$refs.goodsForm.validate((valid) => {
                if (valid) {
                    this.goodsFormLoading = true;

                    const formData = {
                        ...this.goodsForm,
                        activityId: this.currentActivityId
                    };

                    let request;
                    if (this.goodsFormMode === 'add') {
                        request = this.$http.post('/api/spike/admin/goods', formData);
                    } else {
                        request = this.$http.put(`/api/spike/admin/goods/${this.goodsForm.id}`, formData);
                    }

                    request.then(response => {
                        if (response.data.code === 200) {
                            this.$message.success(this.goodsFormMode === 'add' ? '添加成功' : '更新成功');
                            this.goodsFormDialogVisible = false;
                            this.loadActivityGoods();
                        } else {
                            this.$message.error(response.data.message || '操作失败');
                        }
                    }).catch(err => {
                        console.error('操作失败:', err);
                        this.$message.error('操作失败');
                    }).finally(() => {
                        this.goodsFormLoading = false;
                    });
                }
            });
        },

        // 加载可用图书列表
        loadAvailableBooks() {
            reqGetBookList(1, 100).then(response => {
                if (response.code == 200) {
                    this.availableBooks = response.bookList || [];
                } else {
                    this.$message.error('获取图书列表失败');
                }
            }).catch(err => {
                console.error('获取图书列表失败:', err);
                this.$message.error('获取图书列表失败');
            });
        }
        }
    }
</script>

<style scoped>
  .content{
    margin: 0px auto;
    width: 100%;
  }
  .box-card{
    margin-top: 20px;
    width: 100%;
  }
  .table_content{
    width: 100%;
    margin-top: 20px;
  }

  ::v-deep .el-input__inner {
    padding-right: 0px;
  }

  /* 确保编辑对话框在最上层 */
  ::v-deep .el-dialog__wrapper {
    z-index: 3000 !important;
  }

  ::v-deep .el-dialog {
    z-index: 3001 !important;
  }

  ::v-deep .v-modal {
    z-index: 2999 !important;
  }

</style>


