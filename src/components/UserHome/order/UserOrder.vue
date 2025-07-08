<template>
  <div class="content">
    <h1>我的订单</h1>
    <div class="box_info">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 全部订单 -->
        <el-tab-pane :label="getTabLabel('all')" name="first">
          <div class="tab_box" v-if="orderList.length === 0">
            <el-empty description="暂无订单数据">
              <el-button type="primary" @click="goShopping">去逛逛</el-button>
            </el-empty>
          </div>
          <div class="tab_box" v-else>
            <div class="order_item" v-for="order in orderList" :key="order.id">
              <!-- 订单状态栏 -->
              <div class="order_status_bar">
                <div class="status_info">
                  <el-tag
                    :type="getStatusType(order.orderStatus)"
                    :color="getStatusColor(order.orderStatus)"
                    effect="dark">
                    <i :class="getStatusIcon(order.orderStatus)" style="margin-right: 4px;"></i>
                    {{ getStatusText(order.orderStatus) }}
                  </el-tag>
                  <span class="order_time">{{ order.orderTime }}</span>
                </div>
                <div class="order_amount">
                  实付金额：<span class="amount">¥{{ order.expense.finallyPrice }}</span>
                </div>
              </div>

              <!-- 订单内容 -->
              <div class="order_content">
                <!-- 商品信息 -->
                <div class="book_list">
                  <el-image
                    v-for="(img, index) in order.coverImgList"
                    :key="index"
                    :src="getImageUrl(img)"
                    class="book_cover"
                    fit="cover">
                  </el-image>
                </div>

                <!-- 订单信息 -->
                <div class="order_info">
                  <p class="order_id">订单号：{{ order.orderId }}</p>
                  <p class="receiver_info">收货人：{{ order.address.name }} {{ order.address.phone }}</p>
                  <p class="address_info">收货地址：{{ order.address.addr }}</p>
                </div>

                <!-- 操作按钮 -->
                <div class="order_actions">
                  <el-button
                    v-for="action in getAvailableActions(order.orderStatus)"
                    :key="action.action"
                    :type="action.type"
                    size="small"
                    @click="handleAction(action.action, order)">
                    {{ action.text }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 待付款 -->
        <el-tab-pane :label="getTabLabel('pending')" name="second">
          <div class="tab_box" v-if="orderList.length === 0">
            <el-empty description="暂无待付款订单">
              <el-button type="primary" @click="goShopping">去下单</el-button>
            </el-empty>
          </div>
          <div class="tab_box" v-else>
            <div class="order_item" v-for="order in orderList" :key="order.id">
              <!-- 待付款订单的特殊显示 -->
              <div class="order_status_bar pending">
                <div class="status_info">
                  <el-tag type="warning">
                    <i class="el-icon-time"></i>
                    待付款
                  </el-tag>
                  <span class="countdown" v-if="order.paymentDeadline">
                    剩余支付时间：{{ getCountdown(order.paymentDeadline) }}
                  </span>
                </div>
                <div class="order_amount">
                  应付金额：<span class="amount pending">¥{{ order.expense.finallyPrice }}</span>
                </div>
              </div>

              <div class="order_content">
                <div class="book_list">
                  <el-image
                    v-for="(img, index) in order.coverImgList"
                    :key="index"
                    :src="getImageUrl(img)"
                    class="book_cover"
                    fit="cover">
                  </el-image>
                </div>

                <div class="order_info">
                  <p class="order_id">订单号：{{ order.orderId }}</p>
                  <p class="receiver_info">收货人：{{ order.address.name }}</p>
                </div>

                <div class="order_actions">
                  <el-button type="primary" size="small" @click="showPaymentDialog(order)">
                    立即支付
                  </el-button>
                  <el-button size="small" @click="handleCancel(order)">
                    取消订单
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 待发货 -->
        <el-tab-pane :label="getTabLabel('paid')" name="third">
          <div class="tab_box" v-if="orderList.length === 0">
            <el-empty description="暂无待发货订单">
              <el-button type="primary" @click="goShopping">去下单</el-button>
            </el-empty>
          </div>
          <div class="tab_box" v-else>
            <div class="order_item" v-for="order in orderList" :key="order.id">
              <!-- 订单状态栏 -->
              <div class="order_status_bar">
                <div class="status_info">
                  <el-tag
                    :type="getStatusType(order.orderStatus)"
                    :color="getStatusColor(order.orderStatus)"
                    effect="dark">
                    <i :class="getStatusIcon(order.orderStatus)" style="margin-right: 4px;"></i>
                    {{ getStatusText(order.orderStatus) }}
                  </el-tag>
                  <span class="order_time">{{ order.orderTime }}</span>
                </div>
                <div class="order_amount">
                  实付金额：<span class="amount">¥{{ order.expense.finallyPrice }}</span>
                </div>
              </div>

              <!-- 订单内容 -->
              <div class="order_content">
                <!-- 商品信息 -->
                <div class="book_list">
                  <!-- 待发货页面：优先显示封面列表（与其他页面保持一致） -->
                  <template v-if="order.coverImgList && order.coverImgList.length > 0">
                    <el-image
                      v-for="(img, index) in order.coverImgList"
                      :key="index"
                      :src="getImageUrl(img)"
                      class="book_cover"
                      fit="cover">
                    </el-image>
                  </template>
                  <!-- 备用方案：显示详细图书信息（如果有的话） -->
                  <template v-else-if="order.orderDetailDtoList && order.orderDetailDtoList.length > 0">
                    <div class="book_item" v-for="(book, index) in order.orderDetailDtoList" :key="index">
                      <el-image
                        class="book_cover"
                        :src="getImageUrl(book.book ? book.book.coverImg : book.coverImg)"
                        fit="cover">
                      </el-image>
                      <div class="book_info">
                        <h4 class="book_title">{{ book.book ? book.book.bookName : book.bookName }}</h4>
                        <p class="book_price">¥{{ book.price }} × {{ book.num }}</p>
                      </div>
                    </div>
                  </template>
                  <!-- 无图书信息时的占位符 -->
                  <template v-else>
                    <div class="no_book_info">
                      <el-image class="book_cover" fit="cover">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                      <div class="book_info">
                        <h4 class="book_title">图书信息加载中...</h4>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- 订单信息 -->
                <div class="order_info">
                  <p class="order_id">订单号：{{ order.orderId }}</p>
                  <p class="receiver_info">收货人：{{ order.address.name }} {{ order.address.phone }}</p>
                  <p class="address_info">收货地址：{{ order.address.addr }}</p>
                </div>

                <!-- 操作按钮 -->
                <div class="order_actions">
                  <el-button size="small" @click="goToOrderDetail(order.id)">订单详情</el-button>
                  <el-button size="small" type="warning" @click="cancelOrder(order.id)">取消订单</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 待收货 -->
        <el-tab-pane :label="getTabLabel('shipped')" name="fourth">
          <div class="tab_box" v-if="orderList.length === 0">
            <el-empty description="暂无待收货订单">
              <el-button type="primary" @click="goShopping">去逛逛</el-button>
            </el-empty>
          </div>
          <div class="tab_box" v-else>
            <div class="order_item" v-for="order in orderList" :key="order.id">
              <!-- 订单状态栏 -->
              <div class="order_status_bar">
                <div class="status_info">
                  <el-tag
                    :type="getStatusType(order.orderStatus)"
                    :color="getStatusColor(order.orderStatus)"
                    effect="dark">
                    <i :class="getStatusIcon(order.orderStatus)" style="margin-right: 4px;"></i>
                    {{ getStatusText(order.orderStatus) }}
                  </el-tag>
                  <span class="order_time">{{ order.orderTime }}</span>
                </div>
                <div class="order_amount">
                  实付金额：<span class="amount">¥{{ order.expense.finallyPrice }}</span>
                </div>
              </div>

              <!-- 订单内容 -->
              <div class="order_content">
                <!-- 商品信息 -->
                <div class="book_list">
                  <el-image
                    v-for="(img, index) in order.coverImgList"
                    :key="index"
                    :src="getImageUrl(img)"
                    class="book_cover"
                    fit="cover">
                  </el-image>
                </div>

                <!-- 订单信息 -->
                <div class="order_info">
                  <p class="order_id">订单号：{{ order.orderId }}</p>
                  <p class="receiver_info">收货人：{{ order.address.name }} {{ order.address.phone }}</p>
                  <p class="address_info">收货地址：{{ order.address.addr }}</p>
                </div>

                <!-- 操作按钮 -->
                <div class="order_actions">
                  <el-button size="small" @click="goToOrderDetail(order.id)">订单详情</el-button>
                  <el-button size="small" type="success" @click="handleConfirmReceipt(order)">确认收货</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 已完成 -->
        <el-tab-pane :label="getTabLabel('completed')" name="fifth">
          <div class="tab_box" v-if="orderList.length === 0">
            <el-empty description="暂无已完成订单">
              <el-button type="primary" @click="goShopping">去逛逛</el-button>
            </el-empty>
          </div>
          <div class="tab_box" v-else>
            <div class="order_item" v-for="order in orderList" :key="order.id">
              <!-- 订单状态栏 -->
              <div class="order_status_bar">
                <div class="status_info">
                  <el-tag
                    :type="getStatusType(order.orderStatus)"
                    :color="getStatusColor(order.orderStatus)"
                    effect="dark">
                    <i :class="getStatusIcon(order.orderStatus)" style="margin-right: 4px;"></i>
                    {{ getStatusText(order.orderStatus) }}
                  </el-tag>
                  <span class="order_time">{{ order.orderTime }}</span>
                </div>
                <div class="order_amount">
                  实付金额：<span class="amount">¥{{ order.expense.finallyPrice }}</span>
                </div>
              </div>

              <!-- 订单商品信息 -->
              <div class="order_content">
                <!-- 商品信息 -->
                <div class="book_list">
                  <!-- 优先显示封面列表（与其他页面保持一致） -->
                  <template v-if="order.coverImgList && order.coverImgList.length > 0">
                    <el-image
                      v-for="(img, index) in order.coverImgList"
                      :key="index"
                      :src="getImageUrl(img)"
                      class="book_cover"
                      fit="cover">
                    </el-image>
                  </template>
                  <!-- 备用方案：显示详细图书信息 -->
                  <template v-else-if="order.orderDetailDtoList && order.orderDetailDtoList.length > 0">
                    <div class="book_item" v-for="(book, index) in order.orderDetailDtoList" :key="index">
                      <el-image
                        class="book_cover"
                        :src="getImageUrl(book.coverImg)"
                        fit="cover">
                      </el-image>
                      <div class="book_info">
                        <h4 class="book_title">{{ book.bookName }}</h4>
                        <p class="book_price">¥{{ book.price }} × {{ book.num }}</p>
                      </div>
                    </div>
                  </template>
                  <!-- 无图书信息时的占位符 -->
                  <template v-else>
                    <div class="no_book_info">
                      <el-image class="book_cover" fit="cover">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                      <div class="book_info">
                        <h4 class="book_title">图书信息加载中...</h4>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- 订单信息 -->
                <div class="order_info">
                  <p class="order_id">订单号：{{ order.orderId }}</p>
                  <p class="receiver_info">收货人：{{ order.address.name }} {{ order.address.phone }}</p>
                  <p class="address_info">收货地址：{{ order.address.addr }}</p>
                  <p class="complete_time" v-if="order.completeTime">完成时间：{{ order.completeTime }}</p>
                </div>

                <!-- 订单操作按钮 -->
                <div class="order_actions">
                  <el-button size="small" @click="goToOrderDetail(order.id)">订单详情</el-button>
                  <el-button size="small" type="primary" @click="buyAgain(order)">再次购买</el-button>
                  <el-button size="small" type="success" @click="reviewOrder(order)" v-if="!order.hasReviewed">评价订单</el-button>
                  <el-button size="small" @click="viewReview(order)" v-else>查看评价</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane :label="getTabLabel('cancelled')" name="sixth">
          <div class="tab_box" v-if="orderList.length === 0">
            <el-empty description="暂无已取消订单">
              <el-button type="primary" @click="goShopping">去逛逛</el-button>
            </el-empty>
          </div>
          <div class="tab_box" v-else>
            <div class="order_item" v-for="order in orderList" :key="order.id">
              <!-- 订单状态栏 -->
              <div class="order_status_bar">
                <div class="status_info">
                  <el-tag
                    :type="getStatusType(order.orderStatus)"
                    :color="getStatusColor(order.orderStatus)"
                    effect="dark">
                    <i :class="getStatusIcon(order.orderStatus)" style="margin-right: 4px;"></i>
                    {{ getStatusText(order.orderStatus) }}
                  </el-tag>
                  <span class="order_time">{{ order.orderTime }}</span>
                </div>
                <div class="order_amount">
                  实付金额：<span class="amount">¥{{ order.expense.finallyPrice }}</span>
                </div>
              </div>

              <!-- 订单商品信息 -->
              <div class="order_content">
                <!-- 商品信息 -->
                <div class="book_list">
                  <!-- 优先显示封面列表（与其他页面保持一致） -->
                  <template v-if="order.coverImgList && order.coverImgList.length > 0">
                    <el-image
                      v-for="(img, index) in order.coverImgList"
                      :key="index"
                      :src="getImageUrl(img)"
                      class="book_cover"
                      fit="cover">
                    </el-image>
                  </template>
                  <!-- 备用方案：显示详细图书信息 -->
                  <template v-else-if="order.orderDetailDtoList && order.orderDetailDtoList.length > 0">
                    <div class="book_item" v-for="(book, index) in order.orderDetailDtoList" :key="index">
                      <el-image
                        class="book_cover"
                        :src="getImageUrl(book.coverImg)"
                        fit="cover">
                      </el-image>
                      <div class="book_info">
                        <h4 class="book_title">{{ book.bookName }}</h4>
                        <p class="book_price">¥{{ book.price }} × {{ book.num }}</p>
                      </div>
                    </div>
                  </template>
                  <!-- 无图书信息时的占位符 -->
                  <template v-else>
                    <div class="no_book_info">
                      <el-image class="book_cover" fit="cover">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                      <div class="book_info">
                        <h4 class="book_title">图书信息加载中...</h4>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- 订单信息 -->
                <div class="order_info">
                  <p class="order_id">订单号：{{ order.orderId }}</p>
                  <p class="receiver_info">收货人：{{ order.address.name }} {{ order.address.phone }}</p>
                  <p class="address_info">收货地址：{{ order.address.addr }}</p>
                  <p class="cancel_reason" v-if="order.cancelReason">取消原因：{{ order.cancelReason }}</p>
                </div>

                <!-- 订单操作按钮 -->
                <div class="order_actions">
                  <el-button size="small" @click="goToOrderDetail(order.id)">订单详情</el-button>
                  <el-button size="small" type="primary" @click="buyAgain(order)">再次购买</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div style="margin: 10px 0px 20px;width: 100%" v-show="total>0">
      <div class="block" style="float: right">
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

    <!-- 支付对话框 -->
    <PaymentDialog
      :visible.sync="showPaymentDialogFlag"
      :order-info="selectedOrderForPayment"
      @payment-success="onPaymentSuccess"
      @payment-cancel="onPaymentCancel">
    </PaymentDialog>
  </div>
</template>
<script>
// <!--  reqUserGetOrderList-->
    import {reqUserGetOrderList,reqModOrderStatus,reqConfirmPayment} from "../../../api/order";
    import {getImageUrl} from "../../../utils/imageUtils";
    import PaymentDialog from "../../PaymentDialog";
// <!--用户订单页面-->
    export default {
        name: "UserOrder",
        components: {
            PaymentDialog
        },
        data() {
            return {
                activeName: 'first',
                currentPage: 1,
                page_size: 5,
                total: 0,
                orderList: [],
                orderStatus: "",
                beUserDelete: false,
                // 支付对话框相关
                showPaymentDialogFlag: false,
                selectedOrderForPayment: null,
                // 订单标签页配置
                orderTabs: {
                    'all': { label: '全部订单', status: '', count: 0 },
                    'pending': { label: '待付款', status: '待付款', count: 0 },
                    'paid': { label: '待发货', status: '已付款', count: 0 },
                    'shipped': { label: '待收货', status: '已发货', count: 0 },
                    'completed': { label: '已完成', status: '已完成', count: 0 },
                    'cancelled': { label: '已取消', status: '已取消', count: 0 }
                },
                // 状态显示配置
                statusConfig: {
                    '待付款': { text: '待付款', color: '#E6A23C', icon: 'el-icon-time' },
                    '已付款': { text: '待发货', color: '#409EFF', icon: 'el-icon-box' },
                    '已发货': { text: '待收货', color: '#67C23A', icon: 'el-icon-truck' },
                    '已完成': { text: '已完成', color: '#909399', icon: 'el-icon-check' },
                    '已取消': { text: '已取消', color: '#F56C6C', icon: 'el-icon-close' }
                }
            };
        },
        created(){
          this.getOrderList(1,5);
          // 初始化时更新标签页计数
          this.updateTabCounts();
        },
        methods: {
            // 标签页点击处理
            handleClick() {
                console.log("=====this.activeName===="+this.activeName+"=======");
                switch (this.activeName) {
                    case "first":
                        this.orderStatus = "";
                        this.beUserDelete = false;
                        break;
                    case "second":
                        this.orderStatus = "待付款";
                        this.beUserDelete = false;
                        break;
                    case "third":
                        this.orderStatus = "已付款";
                        this.beUserDelete = false;
                        break;
                    case "fourth":
                        this.orderStatus = "已发货";
                        this.beUserDelete = false;
                        break;
                    case "fifth":
                        this.orderStatus = "已完成";
                        this.beUserDelete = false;
                        break;
                    case "sixth":
                        this.orderStatus = "已取消";
                        this.beUserDelete = false;
                        break;
                }
                console.log("=====this.orderStatus====="+this.orderStatus+"======")
                this.getOrderList(1, 5);
            },

            // 获取标签页显示文本（包含数量）
            getTabLabel(tabKey) {
                const tab = this.orderTabs[tabKey];
                return tab && tab.count > 0 ? `${tab.label}(${tab.count})` : (tab ? tab.label : '');
            },

            // 获取状态显示文本
            getStatusText(status) {
                return this.statusConfig[status] ? this.statusConfig[status].text : status;
            },

            // 获取状态颜色
            getStatusColor(status) {
                return this.statusConfig[status] ? this.statusConfig[status].color : '#909399';
            },

            // 获取状态图标
            getStatusIcon(status) {
                return this.statusConfig[status] ? this.statusConfig[status].icon : 'el-icon-info';
            },

            // 获取Element UI标签类型
            getStatusType(status) {
                const typeMap = {
                    '待付款': 'warning',
                    '已付款': 'primary',
                    '已发货': 'success',
                    '已完成': 'info',
                    '已取消': 'danger'
                };
                return typeMap[status] || 'info';
            },

            // 获取可用操作
            getAvailableActions(orderStatus) {
                const actionMap = {
                    '待付款': [
                        { text: '立即支付', type: 'primary', action: 'pay' },
                        { text: '取消订单', type: 'default', action: 'cancel' }
                    ],
                    '已付款': [
                        { text: '查看详情', type: 'default', action: 'detail' },
                        { text: '联系客服', type: 'default', action: 'service' }
                    ],
                    '已发货': [
                        { text: '确认收货', type: 'primary', action: 'confirm' },
                        { text: '查看物流', type: 'default', action: 'logistics' },
                        { text: '联系客服', type: 'default', action: 'service' }
                    ],
                    '已完成': [
                        { text: '查看详情', type: 'default', action: 'detail' },
                        { text: '再次购买', type: 'primary', action: 'rebuy' }
                    ],
                    '已取消': [
                        { text: '查看详情', type: 'default', action: 'detail' },
                        { text: '再次购买', type: 'primary', action: 'rebuy' }
                    ]
                };
                return actionMap[orderStatus] || [{ text: '查看详情', type: 'default', action: 'detail' }];
            },

            // 处理操作点击
            handleAction(action, order) {
                switch (action) {
                    case 'pay':
                        this.handlePayment(order);
                        break;
                    case 'cancel':
                        this.handleCancel(order);
                        break;
                    case 'confirm':
                        this.handleConfirmReceipt(order);
                        break;
                    case 'detail':
                        this.goToOrderDetail(order.id);
                        break;
                    case 'service':
                        this.$message.info('客服功能开发中...');
                        break;
                    case 'logistics':
                        this.$message.info('物流跟踪功能开发中...');
                        break;
                    case 'rebuy':
                        this.$message.info('再次购买功能开发中...');
                        break;
                }
            },

            // 处理支付
            async handlePayment(order) {
                try {
                    console.log('开始支付，订单ID:', order.orderId);
                    const result = await reqConfirmPayment(order.orderId);
                    console.log('支付API响应:', result);

                    // 检查响应结构
                    if (result && result.code === 200) {
                        this.$message.success('支付成功！');
                        this.getOrderList(this.currentPage, this.page_size); // 刷新列表
                    } else {
                        const errorMsg = result && result.message ? result.message : '支付失败';
                        this.$message.error(errorMsg);
                    }
                } catch (error) {
                    console.error('支付错误:', error);
                    // 检查错误响应
                    if (error.response && error.response.data) {
                        const errorMsg = error.response.data.message || '支付失败，请重试';
                        this.$message.error(errorMsg);
                    } else {
                        this.$message.error('支付失败，请重试');
                    }
                }
            },

            // 显示支付对话框
            showPaymentDialog(order) {
                this.selectedOrderForPayment = order;
                this.showPaymentDialogFlag = true;
            },

            // 支付成功回调
            async onPaymentSuccess(data) {
                console.log('支付成功:', data);
                this.$message.success('支付成功！');
                // 刷新订单列表
                await this.getOrderList(this.currentPage, this.page_size);
            },

            // 支付取消回调
            onPaymentCancel() {
                console.log('支付已取消');
            },

            // 处理取消订单
            handleCancel(order) {
                this.$confirm('确定要取消这个订单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.modifyOrderStatus(order.id, '已取消');
                });
            },

            // 处理确认收货
            handleConfirmReceipt(order) {
                this.$confirm('确定已收到商品吗？', '确认收货', {
                    confirmButtonText: '确认收货',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.modifyOrderStatus(order.id, '已完成');
                });
            },

            // 获取支付倒计时
            getCountdown(paymentDeadline) {
                if (!paymentDeadline) return '';

                const deadline = new Date(paymentDeadline);
                const now = new Date();
                const diff = deadline - now;

                if (diff <= 0) {
                    return '已超时';
                }

                const minutes = Math.floor(diff / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                return `${minutes}分${seconds}秒`;
            },

            // 去购物
            goShopping() {
                this.$router.push('/');
            },

            //跳转到订单明细页面
            goToOrderDetail(id) {
                console.log("=====跳转到订单详情页========")
                this.$router.push({
                    path:'/user/userOrderDetail',
                    query: {
                        id: id
                    }
                });
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
            getOrderList(page, pageSize){
                let account = this.$store.getters.getUser.account;
                reqUserGetOrderList(account, page, pageSize, this.orderStatus, this.beUserDelete).then(response => {
                    if(response.code == 200){
                        this.total = response.total;
                        console.log(this.total);
                        this.orderList = response.orderDtoList || [];

                        // 更新标签页数量统计（异步执行，不阻塞页面显示）
                        this.updateTabCounts();
                    } else {
                        this.$message({
                            message: response.message,
                            type: "warning"
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: "获取用户订单出错了",
                        type: "warning"
                    });
                });
            },

            // 更新标签页数量统计
            async updateTabCounts() {
                try {
                    let account = this.$store.getters.getUser.account;

                    // 获取各状态的订单数量
                    const statusList = ['', '待付款', '已付款', '已发货', '已完成', '已取消'];
                    const tabKeys = ['all', 'pending', 'paid', 'shipped', 'completed', 'cancelled'];

                    for (let i = 0; i < statusList.length; i++) {
                        const status = statusList[i];
                        const tabKey = tabKeys[i];

                        try {
                            // 使用现有的API方法
                            const response = await reqUserGetOrderList(account, 1, 1, status, false);

                            if (response.code === 200) {
                                this.orderTabs[tabKey].count = response.total || 0;
                            } else {
                                this.orderTabs[tabKey].count = 0;
                            }
                        } catch (error) {
                            console.error(`获取${status || '全部'}订单数量失败:`, error);
                            this.orderTabs[tabKey].count = 0;
                        }
                    }
                } catch (error) {
                    console.error('更新标签页数量失败:', error);
                }
            },

            //进行订单收货
            getOrder(id){
                this.$confirm('确认收货码?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    reqModOrderStatus(id,"已收货").then(response=>{
                        if(response.code==200){
                            this.$message({
                                message: response.message,
                                type: "success"
                            })
                        }else {
                            this.$message({
                                message: response.message,
                                type: "warning"
                            })
                        }
                    }).catch(()=>{
                        this.$message({
                            message: "确认收货出错了",
                            type: "warning"
                        })
                    })
                }).catch(()=>{
                    this.$message({
                        message: "取消确认收货",
                        type: "warning"
                    })
                });
            },

            //修改订单状态
            modifyOrderStatus(id, orderStatus){
                reqModOrderStatus(id, orderStatus).then(response => {
                    if(response.code == 200){
                        this.$message({
                            message: response.message,
                            type: "success"
                        });
                        // 刷新订单列表
                        this.getOrderList(this.currentPage, this.page_size);
                    } else {
                        this.$message({
                            message: response.message,
                            type: "warning"
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: "操作失败，请重试",
                        type: "warning"
                    });
                });
            },

            // 获取图片完整URL
            getImageUrl(imagePath) {
                return getImageUrl(imagePath);
            },

            // 再次购买
            buyAgain(order) {
                this.$confirm('确定要再次购买这些商品吗？', '再次购买', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    // 这里可以实现再次购买的逻辑
                    // 例如：将商品添加到购物车或直接跳转到购买页面
                    this.$message.info('再次购买功能开发中...');

                    // 未来可以实现的逻辑：
                    // 1. 获取订单中的商品信息
                    // 2. 将商品添加到购物车
                    // 3. 跳转到购物车或结算页面

                    console.log('再次购买订单:', order);
                }).catch(() => {
                    this.$message.info('已取消再次购买');
                });
            },

            // 评价订单
            reviewOrder(order) {
                // 检查订单状态
                if (order.orderStatus !== '已完成') {
                    this.$message.warning('只有已完成的订单才能评价');
                    return;
                }

                // 跳转到评价页面
                this.$router.push({
                    path: '/user/orderReview',
                    query: {
                        orderId: order.orderId
                    }
                });
            },

            // 查看评价
            viewReview(order) {
                this.$message.info('查看评价功能开发中...');

                // 未来可以实现的逻辑：
                // 1. 跳转到评价详情页面
                // 2. 显示用户的评价内容和评分

                console.log('查看订单评价:', order);
            }
        }
    }
</script>

<style scoped>

  .content{
    margin: 10px auto;
    width: 100%;
    max-width: 1200px;
    background-color: white;
    padding: 30px 20px;
    box-sizing: border-box;
  }
  h1{
    color: #757575;
    font-family: 新宋体;
  }
  .box_info{
    width: 100%;
    max-width: 960px;
    margin: 10px auto;
  }
  :deep(.el-tabs__item) {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #757575;
  }

  /* 新的订单项样式 */
  .order_item {
    width: 100%;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    margin-bottom: 20px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s ease;
  }

  .order_item:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  /* 订单状态栏 */
  .order_status_bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 8px 8px 0 0;
  }

  .order_status_bar.pending {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  }

  .status_info {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .order_time {
    color: #666;
    font-size: 12px;
  }

  .countdown {
    color: #ff6600;
    font-weight: bold;
    font-size: 12px;
  }

  .order_amount {
    font-size: 14px;
    color: #333;
  }

  .amount {
    color: #ff6600;
    font-size: 18px;
    font-weight: bold;
  }

  .amount.pending {
    color: #e65100;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }

  /* 订单内容 */
  .order_content {
    display: flex;
    align-items: flex-start;
    padding: 20px;
    gap: 20px;
    min-height: 120px;
  }

  .book_list {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
    flex-wrap: wrap;
    max-width: 300px;
  }

  .book_cover {
    width: 60px;
    height: 80px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
  }

  /* 待发货、已完成、已取消页面的详细图书信息样式 */
  .book_item {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 200px;
    margin-bottom: 10px;
  }

  .book_info {
    flex: 1;
    min-width: 120px;
  }

  .book_title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin: 0 0 5px 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .book_price {
    font-size: 13px;
    color: #666;
    margin: 0;
  }

  .order_info {
    flex: 1;
    min-width: 200px;
    padding: 0 20px;
  }

  .order_info p {
    margin: 5px 0;
    font-size: 13px;
    color: #666;
    line-height: 1.4;
  }

  .order_id {
    color: #333 !important;
    font-weight: 500;
  }

  .receiver_info {
    color: #333 !important;
  }

  .address_info {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cancel_reason {
    color: #F56C6C !important;
    font-style: italic;
    font-size: 12px !important;
  }

  .complete_time {
    color: #67C23A !important;
    font-weight: 500;
    font-size: 12px !important;
  }

  .order_actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
    min-width: 120px;
    align-items: stretch;
    justify-content: flex-start;
  }

  /* 操作按钮样式优化 */
  .order_actions .el-button {
    margin: 0 !important;
    padding: 8px 16px !important;
    font-size: 13px !important;
    border-radius: 4px !important;
    min-height: 32px !important;
    white-space: nowrap;
  }

  /* 主要操作按钮（如立即支付、确认收货）样式 */
  .order_actions .el-button--primary,
  .order_actions .el-button--success {
    font-weight: 500 !important;
  }

  /* 次要操作按钮（如订单详情）样式 */
  .order_actions .el-button--default {
    border: 1px solid #dcdfe6 !important;
    color: #606266 !important;
    background-color: #ffffff !important;
  }

  .order_actions .el-button--default:hover {
    color: #409eff !important;
    border-color: #c6e2ff !important;
    background-color: #ecf5ff !important;
  }

  /* 警告操作按钮（如取消订单）样式 - 修复文字可见性 */
  .order_actions .el-button--warning {
    color: #ffffff !important;
    background-color: #e6a23c !important;
    border-color: #e6a23c !important;
    font-weight: 500 !important;
  }

  .order_actions .el-button--warning:hover {
    background-color: #cf9236 !important;
    border-color: #cf9236 !important;
    color: #ffffff !important;
  }

  .order_actions .el-button--warning:active {
    background-color: #b8832f !important;
    border-color: #b8832f !important;
  }

  /* 无图书信息占位符样式 */
  .no_book_info {
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0.6;
  }

  .no_book_info .book_cover {
    background-color: #f5f5f5;
  }

  .no_book_info .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    color: #909399;
    font-size: 20px;
  }

  .no_book_info .book_title {
    color: #909399;
    font-style: italic;
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .order_content {
      flex-direction: column;
      align-items: stretch;
      padding: 15px;
      gap: 15px;
    }

    .book_list {
      max-width: none;
      justify-content: center;
    }

    .order_info {
      padding: 0;
      min-width: auto;
    }

    .order_actions {
      flex-direction: row;
      justify-content: center;
      min-width: auto;
      gap: 12px;
      flex-wrap: wrap;
    }

    .order_actions .el-button {
      flex: 0 0 auto;
      min-width: 80px;
    }
  }

  /* 确保Element UI标签显示清晰 */
  .el-tag {
    font-weight: 500 !important;
    border: none !important;
    font-size: 12px !important;
    padding: 4px 8px !important;
    border-radius: 4px !important;
  }

  .el-tag--warning {
    background-color: #E6A23C !important;
    color: white !important;
  }

  .el-tag--primary {
    background-color: #409EFF !important;
    color: white !important;
  }

  .el-tag--success {
    background-color: #67C23A !important;
    color: white !important;
  }

  .el-tag--info {
    background-color: #909399 !important;
    color: white !important;
  }

  .el-tag--danger {
    background-color: #F56C6C !important;
    color: white !important;
  }
  .tab_box{
    width: 100%;
    max-width: 960px;
  }

  .order_list{
    border: 1px #f3f0e9 solid;
    margin: 12px auto;
    width: 100%;
    max-width: 960px;
    height: auto;
    min-height: 250px;
    line-height: 35px;
    border: 1px solid #cacaca;
    box-sizing: border-box;
  }
  .order_summary{
    width: 100%;
    height: auto;
    min-height: 105px;
    padding: 15px 25px;
    border-bottom: 1px solid #e7e7e7;
    box-sizing: border-box;
  }
  .order_status{
    font-size: 22px;
    color: #757575;
  }
  .caption-info{
    font-size: 14px;
    color: #757575;
  }
  .money{
    font-size: 23px;
    color: black;
  }
  .bookInfo{
    width: 100%;
    height: auto;
    min-height: 145px;
    padding: 15px 25px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .book_item{
    flex: 1;
    height: auto;
    min-height: 105px;
    display: flex;
    align-items: center;
  }
  .bookImg{
    width: 60px;
    height: 85px;
    margin-right: 15px;
    flex-shrink: 0;
  }
  .book_detail{
    margin: 0 20px;
    height: auto;
    line-height: 27.5px;
    font-size: 14px;
    flex: 1;
  }
  .book_action{
    width: 250px;
    font-size: 14px;
    color: #757575;
    height: auto;
    min-height: 105px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    padding: 10px;
  }
  .plainBtn{
    width: 100%;
    height: 32px;
    background-color: white;
    color: #757575;
    border: 1px #cacaca solid;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 13px;
  }
  .plainBtn:hover{
    border: 1px #409EFF solid;
    background-color: #ecf5ff;
    color: #409EFF;
    transform: translateY(-1px);
  }

  .plainBtn:active{
    transform: translateY(0);
  }
  .noMesInfo{
    text-align: center;
    font-size: 18px;
    color: #757575;
    line-height: 60px
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .content {
      padding: 20px 10px;
    }

    .bookInfo {
      flex-direction: column;
      align-items: stretch;
      padding: 10px 15px;
    }

    .book_item {
      flex-direction: column;
      align-items: center;
      margin-bottom: 15px;
    }

    .bookImg {
      margin-right: 0;
      margin-bottom: 10px;
    }

    .book_detail {
      margin: 0;
      text-align: center;
    }

    .book_action {
      width: 100%;
      flex-direction: row;
      justify-content: space-around;
      min-height: auto;
      padding: 10px;
      gap: 8px;
    }

    .plainBtn {
      width: auto;
      flex: 1;
      min-width: 80px;
      font-size: 12px;
      height: 30px;
    }

    .order_summary {
      padding: 10px 15px;
    }

    .order_status {
      font-size: 18px;
    }

    .money {
      font-size: 20px;
    }
  }

  @media (max-width: 480px) {
    .book_action {
      flex-direction: column;
      align-items: stretch;
      gap: 6px;
    }

    .plainBtn {
      width: 100%;
      height: 36px;
      font-size: 13px;
    }
  }

</style>
