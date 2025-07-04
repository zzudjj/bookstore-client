<template>
  <div class="content">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div class="header-content">
          <div class="header-left">
            <i class="el-icon-chat-dot-round header-icon"></i>
            <span class="header-title">评论管理</span>
            <el-tag type="info" size="small">共 {{ total }} 条评论</el-tag>
          </div>
          <div class="header-right">
            <el-button size="small" @click="fetchComments" :loading="loading">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-form :inline="true" size="small">
          <el-form-item label="搜索：">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索用户名或图书名称"
              prefix-icon="el-icon-search"
              clearable
              @input="handleSearch"
              style="width: 200px;">
            </el-input>
          </el-form-item>
          <el-form-item label="排序：">
            <el-select v-model="sortBy" @change="handleSortChange" style="width: 120px;">
              <el-option label="最新评论" value="createTime"></el-option>
              <el-option label="点赞最多" value="likeCount"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        :data="filteredComments"
        style="width: 100%"
        v-loading="loading"
        :header-cell-style="headerCellStyle"
        :row-class-name="tableRowClassName"
        fit
        stripe>
        <el-table-column prop="id" label="ID" width="70" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" type="info">#{{ scope.row.id }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="用户信息" width="140" align="center">
          <template slot-scope="scope">
            <div class="user-info">
              <div class="user-avatar">
                <el-avatar
                  :src="scope.row.userImgUrl"
                  size="small"
                  :alt="scope.row.userName">
                  <i class="el-icon-user-solid"></i>
                </el-avatar>
              </div>
              <div class="user-name">{{ scope.row.userName || '未知用户' }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="bookName" label="图书名称" width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="book-info">
              <i class="el-icon-reading book-icon"></i>
              <span>{{ scope.row.bookName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="content" label="评论内容" min-width="350" align="left">
          <template slot-scope="scope">
            <div class="comment-content">
              <div class="content-text" :title="scope.row.content">
                {{ scope.row.content }}
              </div>
              <div class="content-meta">
                <el-tag size="mini" type="success" v-if="scope.row.likeCount > 0">
                  <i class="el-icon-thumb"></i>
                  {{ scope.row.likeCount }} 赞
                </el-tag>
                <el-tag size="mini" type="info" v-if="scope.row.replies && scope.row.replies.length > 0">
                  <i class="el-icon-chat-dot-round"></i>
                  {{ scope.row.replies.length }} 回复
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="发布时间" width="140" align="center">
          <template slot-scope="scope">
            <div class="time-info">
              <div class="time-text">{{ formatTime(scope.row.createTime) }}</div>
              <div class="time-ago">{{ getTimeAgo(scope.row.createTime) }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="回复评论" placement="top">
              <el-button
                type="primary"
                size="mini"
                circle
                @click="openReplyDialog(scope.row)">
                <i class="el-icon-chat-line-round"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;width: 100%;">
        <div class="block" style="float: right;padding: 0px 0px 10px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="page_size"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <!-- 发表反馈弹窗 -->
    <el-dialog title="回复用户评论" :visible.sync="replyDialogVisible" width="600px" append-to-body>
      <!-- 原评论信息 -->
      <div v-if="replyTarget" class="original-comment">
        <div class="comment-header">
          <h4>原评论信息</h4>
        </div>
        <div class="comment-info">
          <div class="info-row">
            <span class="label">用户：</span>
            <span class="value">{{ replyTarget.userName }}</span>
          </div>
          <div class="info-row">
            <span class="label">图书：</span>
            <span class="value">{{ replyTarget.bookName }}</span>
          </div>
          <div class="info-row">
            <span class="label">时间：</span>
            <span class="value">{{ formatTime(replyTarget.createTime) }}</span>
          </div>
        </div>
        <div class="original-content">
          <div class="content-label">评论内容：</div>
          <div class="content-text">{{ replyTarget.content }}</div>
        </div>
      </div>

      <!-- 回复输入框 -->
      <div class="reply-section">
        <div class="reply-label">管理员回复：</div>
        <el-input
          ref="replyInput"
          type="textarea"
          v-model="replyContent"
          placeholder="请输入回复内容..."
          rows="4"
          maxlength="500"
          show-word-limit
        ></el-input>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply" :disabled="!replyContent.trim()">
          <i class="el-icon-s-promotion"></i>
          发送回复
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqAdminGetAllComments, reqAddComment } from '../../api/comment'
export default {
  name: 'AdminCommentList',
  data() {
    return {
      comments: [],
      total: 0,
      page: 1,
      page_size: 10,
      loading: false,
      replyDialogVisible: false,
      replyContent: '',
      replyTarget: null,
      searchKeyword: '',
      sortBy: 'createTime'
    }
  },
  computed: {
    filteredComments() {
      // 现在搜索由后端处理，这里只做排序
      let filtered = this.comments;

      // 排序
      if (this.sortBy === 'likeCount') {
        filtered = [...filtered].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      } else {
        filtered = [...filtered].sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
      }

      return filtered;
    }
  },
  methods: {
    fetchComments() {
      this.loading = true
      const token = localStorage.getItem('token')
      reqAdminGetAllComments(this.page, this.page_size, token, this.searchKeyword).then(res => {
        if (res.code === 200) {
          this.comments = res.comments || []
          this.total = res.total || 0
        } else {
          this.$message.error(res.message || '获取评论失败')
        }
      }).catch(() => {
        this.$message.error('获取评论失败')
      }).finally(() => {
        this.loading = false
      })
    },
    handleCurrentChange(page) {
      this.page = page
      this.fetchComments()
    },
    handleSizeChange(size) {
      this.page_size = size
      this.page = 1
      this.fetchComments()
    },
    formatTime(time) {
      if (!time) return ''
      return new Date(time).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    getTimeAgo(time) {
      if (!time) return ''
      const now = new Date()
      const commentTime = new Date(time)
      const diff = now - commentTime
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (days > 0) return `${days}天前`
      if (hours > 0) return `${hours}小时前`
      if (minutes > 0) return `${minutes}分钟前`
      return '刚刚'
    },

    headerCellStyle() {
      return {
        background: '#f8f9fa',
        color: '#333',
        fontWeight: '500',
        textAlign: 'center'
      }
    },

    tableRowClassName({row, rowIndex}) {
      if (row.likeCount > 10) return 'popular-row'
      return ''
    },

    handleSearch() {
      // 重置到第一页并重新获取数据
      this.page = 1
      this.fetchComments()
    },

    handleSortChange() {
      // 排序在computed中处理
    },
    openReplyDialog(row) {
      this.replyTarget = row
      this.replyContent = ''
      this.replyDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.replyInput) {
          this.$refs.replyInput.focus && this.$refs.replyInput.focus()
        }
      })
    },
    submitReply() {
      if (!this.replyTarget) return
      const token = localStorage.getItem('token')
      reqAddComment({
        bookId: this.replyTarget.bookId,
        content: this.replyContent,
        parentId: this.replyTarget.id
      }, token).then(res => {
        if (res.code === 200) {
          this.$message.success('回复发送成功')
          this.replyDialogVisible = false
          this.fetchComments()
        } else {
          this.$message.error(res.message || '回复发送失败')
        }
      }).catch(() => {
        this.$message.error('回复发送失败')
      })
    }
  },
  created() {
    this.fetchComments()
  }
}
</script>

<style scoped>
.content {
  margin: 0px auto;
  width: 1200px;
  min-width: 1200px;
}

/* 头部样式 */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 18px;
  color: #409eff;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* 筛选区域 */
.filter-section {
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

/* 表格样式 */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.user-avatar {
  margin-bottom: 4px;
}

.user-name {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.book-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.book-icon {
  color: #409eff;
  font-size: 14px;
}

.time-info {
  text-align: center;
}

.time-text {
  font-size: 12px;
  color: #333;
  margin-bottom: 2px;
}

.time-ago {
  font-size: 11px;
  color: #999;
}

/* 评论内容样式 */
.comment-content {
  padding: 8px 0;
}

.content-text {
  margin: 0 0 8px 0;
  line-height: 1.6;
  color: #333;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
}

.content-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

/* 表格行样式 */
.popular-row {
  background-color: #fff7e6 !important;
}

.popular-row:hover {
  background-color: #fff3d9 !important;
}

/* 对话框样式 */
.original-comment {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  border-left: 4px solid #409eff;
}

.comment-header h4 {
  margin: 0 0 12px 0;
  color: #409eff;
  font-size: 16px;
}

.comment-info {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  margin-bottom: 6px;
  align-items: center;
}

.info-row .label {
  font-weight: 500;
  color: #666;
  width: 60px;
  flex-shrink: 0;
}

.info-row .value {
  color: #333;
  flex: 1;
}

.original-content {
  border-top: 1px solid #e4e7ed;
  padding-top: 12px;
}

.content-label {
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.original-content .content-text {
  background: white;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  color: #333;
  line-height: 1.6;
  -webkit-line-clamp: unset;
  overflow: visible;
  display: block;
}

.reply-section {
  margin-top: 20px;
}

.reply-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

/* 表格行悬浮效果 */
.el-table tbody tr:hover {
  background-color: #f5f7fa;
}
</style>