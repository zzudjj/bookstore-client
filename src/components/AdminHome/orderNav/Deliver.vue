<template>
  <div class="content">
    <el-card class="box-card" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>发货列表</span>
    </el-card>
    <div class="table_content" v-loading="loading" element-loading-text="加载订单信息中...">
      <el-table
        ref="multipleTable"
        border
        :data="[order]"
        tooltip-effect="dark"
        style="width: 100%"
        v-if="order && order.orderId"
      >
        <el-table-column
          label="订单编号"
          width="320"
          align="center">
          <template slot-scope="scope">
            {{scope.row.orderId}}
          </template>
        </el-table-column>
        <el-table-column
          label="收货人"
          width="100"
          align="center">
          <template slot-scope="scope">
            {{scope.row.address.name}}
          </template>
        </el-table-column>
        <el-table-column
          label="手机号"
          width="170"
          align="center">
          <template slot-scope="scope">
            {{scope.row.address.phone}}
          </template>
        </el-table-column>
        <el-table-column
          label="收货地址"
          align="center">
          <template slot-scope="scope">
            {{scope.row.address.addr}}
          </template>
        </el-table-column>
        <el-table-column
          label="配送方式"
          align="center">
          <template>
            <el-select v-model="finalDelivery" placeholder="请选择物流公司">
              <el-option
                v-for="item in deliverySort"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="物流单号"
          align="center">
          <template>
            <div class="logistics-input-group">
              <el-input v-model="logisticsNum" placeholder="自动生成或手动输入"></el-input>
              <el-button
                type="primary"
                size="mini"
                @click="generateLogisticsNum"
                style="margin-left: 8px;">
                生成单号
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态提示 -->
      <div v-else-if="!loading" class="empty-state">
        <el-empty description="未找到订单信息">
          <el-button type="primary" @click="$router.go(-1)">返回</el-button>
        </el-empty>
      </div>
    </div>
    <div class="table_content" style="text-align: center">
      <el-button
        style="margin-left: 10px"
        size="medium"
        @click="cancelDeliver">
        取消
      </el-button>
      <el-button
        style="margin-left: 10px"
        type="primary"
        @click="deliverOrder"
        size="medium">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
    import {reqAdminGetOrderDetail,reqDeliverOrder} from "../../../api/order";
    export default {
        name: "Deliver",
        data(){
            return{
                loading: false,
                order: {
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
                    orderDetailDtoList:[],
                    expense:{
                        orderId:null,//订单编号
                        productTotalMoney:null,//商品总价
                        freight:null,//运费 默认为0元
                        coupon:null,//优惠券 默认为0元
                        activityDiscount:null,//活动优惠 默认为0元
                        allPrice:null,//订单总金额
                        finallyPrice:null,//最终实付总额
                    },
                    address:{
                        id: null,
                        account: "",
                        name: "",
                        phone: "",
                        addr: "",
                        label: "",
                        off: false,
                    }
                },
                finalDelivery:1,
                deliverySort:[
                    {
                        id: 1,
                        name: "圆通快递"
                    },
                    {
                        id: 2,
                        name: "中通快递"
                    },
                    {
                        id: 3,
                        name: "顺丰快递"
                    },
                    {
                        id: 4,
                        name: "韵达快递"
                    },
                ],
                logisticsNum: "",//快递单号
            }
        },

        watch: {
            // 监听物流公司变化，自动重新生成物流单号
            finalDelivery(newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    this.generateLogisticsNum();
                }
            }
        },
        created:function () {
          this.getOrderList();
          // 页面加载时自动生成物流单号
          this.generateLogisticsNum();
        },
        methods: {
            //获取快递到分类的分类值
            handleChange(bookSort) {
                console.log("图书的分类是:"+bookSort[0]);
            },

            // 生成物流单号
            generateLogisticsNum() {
                const companies = {
                    1: 'YT', // 圆通
                    2: 'ZTO', // 中通
                    3: 'SF', // 顺丰
                    4: 'YD'  // 韵达
                };

                const companyCode = companies[this.finalDelivery] || 'YT';
                const timestamp = Date.now().toString().slice(-8); // 取时间戳后8位
                const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4位随机数
                const checkCode = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // 2位校验码

                this.logisticsNum = `${companyCode}${timestamp}${randomNum}${checkCode}`;

                console.log('生成物流单号:', this.logisticsNum);
                this.$message({
                    message: `已生成物流单号: ${this.logisticsNum}`,
                    type: 'success',
                    duration: 2000
                });
            },
            getOrderList(){
                let id = this.$route.query.id;
                console.log("获取订单详情，订单ID:", id);

                if (!id) {
                    this.$message({
                        message: "订单ID不能为空！",
                        type: "error"
                    });
                    return;
                }

                this.loading = true;
                reqAdminGetOrderDetail(id).then(response=>{
                    this.loading = false;
                    console.log("订单详情响应:", response);

                    if(response.code == 200 && response.orderDto){
                        this.order = response.orderDto;
                        console.log("订单数据加载成功:", this.order);
                    }else {
                        this.$message({
                            message: response.message || "获取订单明细出错了！",
                            type: "warning"
                        });
                        console.error("获取订单详情失败:", response);
                    }
                }).catch(err=>{
                    this.loading = false;
                    console.error("获取订单详情异常:", err);
                    this.$message({
                        message: "网络错误，请重试！",
                        type: "error"
                    });
                })
            },
            deliverOrder(){
                let id = this.$route.query.id;

                // 验证必填项
                if (!this.finalDelivery) {
                    this.$message({
                        message: "请选择物流公司！",
                        type: "warning"
                    });
                    return;
                }

                // 如果没有物流单号，自动生成一个
                if (!this.logisticsNum.trim()) {
                    this.generateLogisticsNum();
                }

                console.log("发货参数:", {
                    id: id,
                    logisticsCompany: this.finalDelivery,
                    logisticsNum: this.logisticsNum
                });

                reqDeliverOrder(id, this.finalDelivery, this.logisticsNum).then(response=>{
                    console.log("发货响应:", response);

                    if(response.code == 200){
                        this.$message({
                            message: response.message || "发货成功！",
                            type: "success"
                        });

                        // 发货成功后返回订单列表
                        setTimeout(() => {
                            this.$router.push('/admin/orderList');
                        }, 1500);
                    }else {
                        this.$message({
                            message: response.message || "发货失败！",
                            type: "warning"
                        });
                    }
                }).catch(error=>{
                    console.error("发货异常:", error);
                    this.$message({
                        message: "网络错误，发货失败！",
                        type: "error"
                    });
                })
            },

            // 取消发货，返回订单列表
            cancelDeliver() {
                this.$confirm('确定要取消发货操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '继续发货',
                    type: 'warning'
                }).then(() => {
                    // 用户确认取消，返回订单列表
                    this.$router.push('/admin/orderList');
                }).catch(() => {
                    // 用户选择继续发货，不做任何操作
                    this.$message({
                        type: 'info',
                        message: '继续发货操作'
                    });
                });
            },
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

  .empty-state {
    padding: 40px;
    text-align: center;
  }

  .logistics-input-group {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logistics-input-group .el-input {
    flex: 1;
    max-width: 200px;
  }


</style>
