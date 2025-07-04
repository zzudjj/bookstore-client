<template>
  <div class="content">
    <div class="header-section">
      <h1>
        <i class="el-icon-chat-dot-round"></i>
        我的评价
      </h1>
      <div class="stats-info">
        <el-tag type="info" size="small">共 {{ total }} 条评价</el-tag>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" size="small">
        <el-form-item label="搜索：">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索图书名称或评价内容"
            prefix-icon="el-icon-search"
            clearable
            @input="handleSearch"
            style="width: 250px;">
          </el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-select v-model="sortBy" @change="handleSortChange" style="width: 120px;">
            <el-option label="最新评价" value="createTime"></el-option>
            <el-option label="点赞最多" value="likeCount"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list" v-loading="loading">
      <div v-if="filteredComments.length === 0 && !loading" class="empty-state">
        <i class="el-icon-chat-dot-round"></i>
        <p>暂无评价记录</p>
        <el-button type="primary" size="small" @click="$router.push('/userHome/userOrder')">
          去订单页面评价
        </el-button>
      </div>

      <div v-for="comment in filteredComments" :key="comment.id" class="comment-card">
        <div class="comment-header">
          <div class="book-info">
            <i class="el-icon-reading book-icon"></i>
            <span class="book-name">{{ comment.bookName }}</span>
          </div>
          <div class="comment-meta">
            <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
            <el-tag size="mini" type="success" v-if="comment.likeCount > 0">
              <i class="el-icon-thumb"></i>
              {{ comment.likeCount }} 赞
            </el-tag>
          </div>
        </div>
        
        <div class="comment-content">
          <p class="content-text">{{ comment.content }}</p>
        </div>

        <!-- 回复列表 -->
        <div v-if="comment.replies && comment.replies.length > 0" class="replies-section">
          <div class="replies-title">
            <i class="el-icon-chat-line-round"></i>
            <span>管理员回复 ({{ comment.replies.length }})</span>
          </div>
          <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
            <div class="reply-header">
              <span class="reply-author">管理员</span>
              <span class="reply-time">{{ formatTime(reply.createTime) }}</span>
            </div>
            <div class="reply-content">{{ reply.content }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-section" v-if="total > 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { reqGetMyComments } from '../../../api/comment'

export default {
  name: 'MyComments',
  data() {
    return {
      comments: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
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
  created() {
    this.fetchComments()
  },
  methods: {
    fetchComments() {
      this.loading = true
      const token = localStorage.getItem('token')

      reqGetMyComments(this.currentPage, this.pageSize, token, this.searchKeyword).then(res => {
        if (res.code === 200) {
          this.comments = res.comments || []
          this.total = res.total || 0
        } else {
          this.$message.error(res.message || '获取评价失败')
        }
      }).catch(() => {
        this.$message.error('获取评价失败')
      }).finally(() => {
        this.loading = false
      })
    },
    
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchComments()
    },
    
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
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
    
    handleSearch() {
      // 重置到第一页并重新获取数据
      this.currentPage = 1
      this.fetchComments()
    },
    
    handleSortChange() {
      // 排序在computed中处理
    }
  }
}
</script>

<style scoped>
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

/* 筛选区域 */
.filter-section {
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

/* 评论列表 */
.comments-list {
  min-height: 400px;
}

.comment-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  background: #fff;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  overflow: hidden;
}

.comment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.book-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.book-icon {
  color: #409eff;
  font-size: 16px;
}

.book-name {
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-content {
  margin-bottom: 16px;
}

.content-text {
  line-height: 1.6;
  color: #333;
  margin: 0;
  font-size: 14px;
  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
  max-width: 100%;
}

/* 回复区域 */
.replies-section {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 16px;
  border-left: 4px solid #409eff;
}

.replies-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-weight: 500;
  color: #409eff;
  font-size: 14px;
}

.reply-item {
  background: white;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.reply-author {
  font-weight: 500;
  color: #409eff;
  font-size: 12px;
}

.reply-time {
  color: #999;
  font-size: 11px;
}

.reply-content {
  color: #333;
  font-size: 13px;
  line-height: 1.5;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 16px;
}

/* 分页 */
.pagination-section {
  margin-top: 30px;
  text-align: center;
}
</style>
