<template>
  <div class="content">
    <div class="header-section">
      <h1>
        <i class="el-icon-message"></i>
        消息通知
      </h1>
      <div class="stats-info">
        <el-tag type="info" size="small">共 0 条消息</el-tag>
      </div>
    </div>

    <div class="message-container">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="message-tabs">
        <el-tab-pane label="全部消息" name="first">
          <div class="tab_box">
            <div class="empty-state">
              <i class="el-icon-chat-line-round"></i>
              <p>暂无消息</p>
              <span class="empty-desc">您的消息通知将在这里显示</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="物流动态" name="second">
          <div class="tab_box">
            <div class="empty-state">
              <i class="el-icon-truck"></i>
              <p>暂无物流信息</p>
              <span class="empty-desc">订单物流动态将在这里显示</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="特惠活动" name="third">
          <div class="tab_box">
            <div class="empty-state">
              <i class="el-icon-present"></i>
              <p>暂无活动信息</p>
              <span class="empty-desc">最新优惠活动将在这里显示</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统通知" name="fourth">
          <div class="tab_box">
            <div class="empty-state">
              <i class="el-icon-bell"></i>
              <p>暂无系统通知</p>
              <span class="empty-desc">系统重要通知将在这里显示</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
    // <!--消息通知页面-->
    export default {
        name: "MesNotice",
        data() {
            return {
                activeName: 'second'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    }
</script>

<style scoped>
/* 主容器 */
.content {
  margin: 10px auto;
  max-width: 1000px;
  width: 95%;
  background-color: white;
  padding: 30px 20px;
  min-height: 600px;
  box-sizing: border-box;
}

/* 头部样式 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
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

/* 消息容器 */
.message-container {
  margin-top: 20px;
}

/* 标签页样式 */
::v-deep .message-tabs .el-tabs__item {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  color: #757575;
  padding: 0 20px;
}

::v-deep .message-tabs .el-tabs__item.is-active {
  color: #409eff;
  font-weight: bold;
}

.tab_box {
  width: 100%;
  min-height: 400px;
  padding: 20px 0;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty-state i {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
  display: block;
}

.empty-state p {
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
}

.empty-desc {
  font-size: 14px;
  color: #999;
  line-height: 1.5;
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

  .empty-state {
    padding: 60px 20px;
  }

  .empty-state i {
    font-size: 48px;
  }

  .empty-state p {
    font-size: 16px;
  }
}
</style>
