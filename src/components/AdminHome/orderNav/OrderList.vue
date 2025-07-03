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
          @click="resetSearch">
          重置
        </el-button>
      </div>
      <div style="margin-top: 25px">
        <el-form :inline="true" :model="search" size="small" label-width="140px">
          <el-form-item label="订单编号">
            <el-input v-model="search.orderId" placeholder="请输入订单编号"></el-input>
          </el-form-item>
          <el-form-item label="用户账号">
            <el-input v-model="search.account" placeholder="请输入用户账号"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="search.orderStatus" placeholder="请选择订单状态">
              <el-option label="全部订单" value=""></el-option>
              <el-option label="待付款" value="待付款"></el-option>
              <el-option label="已付款" value="已付款"></el-option>
              <el-option label="已发货" value="已发货"></el-option>
              <el-option label="已收货" value="已收货"></el-option>
              <el-option label="已完成" value="已完成"></el-option>
              <el-option label="已取消" value="已取消"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
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
          label="订单号"
          align="center">
          <template slot-scope="scope">{{ scope.row.orderId }}</template>
        </el-table-column>
        <el-table-column
          label="提交时间"
          width="170"
          align="center">
          <template slot-scope="scope">{{ scope.row.orderTime }}</template>
        </el-table-column>
<!--        h.format("yyyy-MM-dd hh:mm:ss")-->
        <el-table-column
          prop="account"
          label="用户账号"
          width="190"
          align="center">
        </el-table-column>
        <el-table-column
          label="订单金额"
          width="90"
          align="center">
          <template slot-scope="scope">{{ scope.row.expense.finallyPrice }}元</template>
        </el-table-column>
        <el-table-column
          prop="orderStatus"
          label="订单状态"
          width="90"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          width="240"
          align="center">
          <template slot-scope="scope">
            <div class="action-buttons">
              <div class="button-row">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-view"
                  @click="goToOrderDetail(scope.$index,scope.row)"
                >详情
                </el-button>
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-truck"
                  @click="goToDeliver(scope.$index,scope.row)"
                  :disabled="!canDeliver(scope.row.orderStatus)"
                >发货
                </el-button>
              </div>
              <div class="button-row">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-edit"
                  @click="modifyOrderStatus(scope.row)"
                >状态
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px;width: 100%;">
<!--      <div style="float: left;padding: 0px 0px 10px">-->
<!--        <el-select v-model="operator" placeholder="批量操作">-->
<!--          <el-option-->
<!--            v-for="item in operates"-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--        <el-button-->
<!--          style="margin-left: 10px"-->
<!--          @click="operatorBook"-->
<!--          type="primary"-->
<!--          size="medium">-->
<!--          确定-->
<!--        </el-button>-->
<!--      </div>-->
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

  </div>
</template>

<script>
    import {reqGetPublishNames} from "../../../api/publish";
    import {reqAdminGetOrderList,reqAdminGetOrderListWithParams,reqDelOrder} from "../../../api/order";
    import axios from 'axios';
    export default {
        name: "OrderList",
        data(){
            return{
                loading: true,
                currentPage: 1,
                page_size: 5,

                // 搜索条件
                search: {
                    orderId: '',
                    account: '',
                    orderStatus: ''
                },

                orderList:{
                    id:null,
                    orderId:null,
                    account:null,
                    orderTime:null,
                    shipTime:null,
                    getTime:null,
                    evaluateTime:null,
                    closeTime:null,
                    confirmTime:null,
                    orderStatus:null,
                    logisticsNum:null,
                    OrderDetailDtoList:[],
                    expense:{
                        orderId:null,//订单编号
                        productTotalMoney:null,//商品总价
                        freight:null,//运费 默认为0元
                        coupon:null,//优惠券 默认为0元
                        activityDiscount:null,//活动优惠 默认为0元
                        allPrice:null,//订单总金额
                        finallyPrice:null,//最终实付总额
                    },
                    address:null
                },

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
                    bookName: '',
                    author: '',
                    isbn: '',
                    publish: '',
                    put: '',
                    bookSort: '',
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
                        label: "批量上架",
                        value: "put"
                    },
                    {
                        label: "批量下架",
                        value: "putOff"
                    },
                    {
                        label: "设为推荐",
                        value: "recommend"
                    },
                    {
                        label: "取消推荐",
                        value: "recommendOff"
                    },
                    {
                        label: "设为新品",
                        value: "newProduct"
                    },
                    {
                        label: "取消新品",
                        value: "newProductOff"
                    }
                ],
                multipleSelection: []
            }
        },
        created:function () {
            this.getPublishName();
            this.getOrderList(this.currentPage, this.page_size);
            console.log("订单列表组件初始化完成！")
        },
        methods: {
            //处理选项框的操作，获取表格中哪些选项被选中
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            operatorBook(){
                if(this.multipleSelection.length<1){
                    this.$message({
                        type: 'warning',
                        message: "请至少选择一项进行操作"
                    })
                }else{
                    let dataList = [];
                    for(let i=0;i<this.multipleSelection.length;i++){
                        dataList.push(this.multipleSelection[i].id);
                    }
                    console.log(this.operator);
                    let formData = new FormData();
                    formData.append("ids", dataList);
                    formData.append("operator",this.operator);
                    axios({
                        method: 'POST',
                        url: 'http://localhost:8082/batchDel',
                        data: formData
                    }).then((response) => {
                        if(response.data.code==200){
                            this.$message({
                                message: response.data.message,
                                type: "success"
                            })
                        }else{
                            this.$message({
                                message: response.data.message,
                                type: "warning"
                            })
                        }
                        this.GetSort(this.currentPage,this.page_size);
                    }).catch(err=>{
                        console.log("出错了！")
                    })
                    switch (this.operator) {
                        case "del":
                            console.log(this.operator);
                            break;
                        case "put":
                            console.log(this.operator);
                            break;
                        case "putOff":
                            console.log(this.operator);
                            break;
                        case "recommend":
                            console.log(this.operator);
                            break;
                        case "recommendOff":
                            console.log(this.operator);
                            break;
                        case "newProduct":
                            console.log(this.operator);
                            break;
                        case "newProductOff":
                            console.log(this.operator);
                            break;
                        default:
                            console.log("至少需要选择一项");
                    }
                }
            },


            //获取图书的分类值
            handleChange(bookSort) {
                console.log("图书的分类是:"+bookSort[0],bookSort[1]);
            },


            //分页函数
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.page_size = val;
                this.getOrderList(1,this.page_size);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                console.log(this.currentPage+":"+this.page_size);
                this.getOrderList(this.currentPage,this.page_size);
            },
            //得到订单列表
            getOrderList(page,pageSize){
                this.loading=true;
                // 构建查询参数
                const params = {
                    page: page,
                    pageSize: pageSize,
                    orderStatus: this.search.orderStatus || '',
                    orderId: this.search.orderId || '',
                    account: this.search.account || ''
                };

                reqAdminGetOrderListWithParams(params).then(response=>{
                    this.loading=false;
                    if(response.code==200){
                        this.total = response.total;
                        console.log('获取订单列表成功，总数:', this.total);
                        this.tableData = response.orderDtoList;
                    }else {
                        this.$message({
                            message: response.message,
                            type: "warning"
                        })
                    }
                }).catch(err=>{
                    this.loading=false;
                    console.log('获取订单列表失败:', err);
                    this.$message({
                        message: "获取订单列表失败",
                        type: "error"
                    })
                })
            },


            //操作表格
            updateBook(index,row){
                console.log("row.id:"+row.isbn);
                this.$router.push({
                    path: "/admin/updateBook",
                    query: {
                        id: row.id
                    }
                })
            },

            //跳转到订单明细页面
            goToOrderDetail(index,row) {
                this.$router.push({
                    path:'/admin/orderDetail',
                    query: {
                        id: row.id
                    }
                });
            },
            //跳转到发货页面
            goToDeliver(index,row) {
                this.$router.push({
                    path:'/admin/deliver',
                    query: {
                        id: row.id
                    }
                });
            },

            //处理删除函数
            handleDelete(index, row){
                this.$confirm('是否要进行删除操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    reqDelOrder(row.id).then(response=>{
                        console.log(response);
                        if(response.code==200){
                            this.$message({
                                message: response.message,
                                type: "success"
                            })
                        }else{
                            this.$message({
                                message: response.message,
                                type: "warning"
                            })
                        }
                        this.getOrderList(this.currentPage,this.page_size);
                    }).catch(err=>{
                        console.log(err);
                    })
                }).catch(()=>{
                    this.$message({
                        message: "删除订单失败",
                        type: "warning"
                    })
                });
            },

            // 搜索功能
            handleSearch() {
                console.log('执行搜索，搜索条件:', this.search);
                this.currentPage = 1;
                this.getOrderList(this.currentPage, this.page_size);
            },

            // 重置搜索
            resetSearch() {
                console.log('重置搜索条件');
                this.search = {
                    orderId: '',
                    account: '',
                    orderStatus: ''
                };
                this.currentPage = 1;
                this.getOrderList(this.currentPage, this.page_size);
            },

            // 判断是否可以发货
            canDeliver(orderStatus) {
                return orderStatus === '已付款';
            },

            // 修改订单状态
            modifyOrderStatus(row) {
                this.$prompt('请输入新的订单状态', '修改订单状态', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: row.orderStatus,
                    inputValidator: (value) => {
                        const validStatuses = ['待付款', '已付款', '已发货', '已收货', '已完成', '已取消'];
                        return validStatuses.includes(value) || '请输入有效的订单状态';
                    }
                }).then(({ value }) => {
                    // 调用修改订单状态的API
                    this.updateOrderStatus(row.id, value);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });
                });
            },

            // 更新订单状态API调用
            updateOrderStatus(orderId, newStatus) {
                // 这里需要导入相应的API方法
                this.$http.get('/api/modifyOrderStatus', {
                    params: {
                        id: orderId,
                        orderStatus: newStatus
                    }
                }).then(response => {
                    if (response.data.code === 200) {
                        this.$message.success('订单状态修改成功');
                        this.getOrderList(this.currentPage, this.page_size);
                    } else {
                        this.$message.error(response.data.message || '修改失败');
                    }
                }).catch(error => {
                    console.error('修改订单状态失败:', error);
                    this.$message.error('修改失败，请重试');
                });
            },


            //得到并设置出版的下拉选择器
            getPublishName(){
                reqGetPublishNames().then(response=>{
                    console.log(response);
                    this.publishList=response.publishList;
                }).then(err=>{
                    console.log(err);
                })
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
  p{
    line-height: 40px;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .button-row {
    display: flex;
    gap: 4px;
    justify-content: center;
  }

  .action-buttons .el-button {
    margin: 0;
    padding: 5px 8px;
    font-size: 12px;
    min-width: 50px;
    flex: 1;
  }

  .action-buttons .el-button--mini {
    padding: 4px 6px;
  }

  /* 禁用状态的按钮样式 */
  .action-buttons .el-button:disabled {
    opacity: 0.5;
  }

  /* 表格行高度优化 */
  ::v-deep .el-table .el-table__row {
    height: 60px;
  }

  ::v-deep .el-input__inner {
    padding-right: 0px;
  }

</style>
