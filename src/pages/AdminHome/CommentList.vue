<template>
  <div class="content">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>评论管理</span>
      </div>
      <el-table :data="filteredComments" style="width: 100%" v-loading="loading" :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}" fit>
        <el-table-column prop="id" label="评论ID" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="bookName" label="图书名称" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openReplyDialog(scope.row)">发表反馈</el-button>
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
    <!-- 发表评论弹窗 -->
    <el-dialog title="发表反馈" :visible.sync="replyDialogVisible" width="400px" append-to-body>
      <el-input
        ref="replyInput"
        type="textarea"
        v-model="replyContent"
        placeholder="请输入反馈内容"
        rows="4"
        maxlength="300"
        show-word-limit
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply" :disabled="!replyContent.trim()">提交</el-button>
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
      replyTarget: null
    }
  },
  computed: {
    filteredComments() {
      // 后端已分页，这里直接返回
      return this.comments;
    }
  },
  methods: {
    fetchComments() {
      this.loading = true
      const token = localStorage.getItem('token')
      reqAdminGetAllComments(this.page, this.page_size, token).then(res => {
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
      return new Date(time).toLocaleString()
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
          this.$message.success('评论成功')
          this.replyDialogVisible = false
          this.fetchComments()
        } else {
          this.$message.error(res.message || '评论失败')
        }
      }).catch(() => {
        this.$message.error('评论失败')
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
  width: 980px;
  min-width: 980px;
}
</style> 