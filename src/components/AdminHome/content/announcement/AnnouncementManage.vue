<template>
  <div class="announcement-manage">
    <el-card>
      <div slot="header" class="clearfix">
        <span>公告管理</span>
        <el-button style="float: right;" type="primary" size="mini" @click="openDialog()">新增公告</el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="#" width="60"/>
        <el-table-column prop="title" label="标题"/>
        <el-table-column prop="author" label="发布人" width="120"/>
        <el-table-column prop="publishTime" label="发布时间" width="160"/>
        <el-table-column prop="enable" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.enable ? 'success' : 'info'">
              {{ scope.row.enable ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="openDialog(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page="page"
          :total="total"
          @current-change="handlePage">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      append-to-body
      custom-class="announcement-dialog"
      :close-on-click-modal="false">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :rows="6" v-model="form.content"/>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="form.enable"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqAddAnnouncement,
  reqDelAnnouncement,
  reqModifyAnnouncement,
  reqGetAnnouncementList
} from "../../../../api/announcement";

export default {
  name: "AnnouncementManage",
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogTitle: '新增公告',
      form: {
        id: null,
        title: '',
        content: '',
        enable: 1
      }
    }
  },
  methods: {
    loadList() {
      reqGetAnnouncementList(this.page, this.pageSize).then(res => {
        if (res.code === 200) {
          this.tableData = res.announcementList || [];
          this.total = res.total || 0;
        }
      })
    },
    handlePage(p) {
      this.page = p;
      this.loadList();
    },
    openDialog(row) {
      if (row) {
        this.dialogTitle = '编辑公告';
        this.form = {...row, enable: row.enable === 1 || row.enable === true};
      } else {
        this.dialogTitle = '新增公告';
        this.form = {id: null, title: '', content: '', enable: 1};
      }
      this.dialogVisible = true;
    },
    submit() {
      const api = this.form.id ? reqModifyAnnouncement : reqAddAnnouncement;
      const payload = {...this.form, enable: this.form.enable ? 1 : 0};
      api(payload).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功');
          this.dialogVisible = false;
          this.loadList();
        }
      })
    },
    del(id) {
      this.$confirm('确定删除此公告吗？', '提示', {type: 'warning'}).then(() => {
        reqDelAnnouncement(id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.loadList();
          }
        })
      })
    }
  },
  created() {
    this.loadList();
  }
}
</script>

<style scoped>
.announcement-manage {
  padding: 20px;
}
.pagination {
  margin-top: 20px;
  text-align: right;
}
.announcement-dialog >>> .el-dialog {
  border-radius: 8px;
}
.announcement-dialog >>> .el-dialog__body {
  padding-top: 10px;
}
</style> 