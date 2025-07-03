<template>
  <div class="topic-manage">
    <el-card shadow="never" class="header-card">
      <span class="title"><i class="el-icon-tickets"></i> 书单管理</span>
      <el-button type="primary" size="mini" class="btn-add" @click="openCreate">新增书单</el-button>
    </el-card>

    <el-table
      :data="list"
      border
      style="width:100%">
      <el-table-column prop="id" label="ID" width="60" align="center"/>
      <el-table-column prop="cover" label="封面" width="120" align="center">
        <template slot-scope="scope">
          <el-image
            :key="cacheVer + '_' + scope.row.id"
            :src="getImg(scope.row.cover)"
            style="height:80px"/>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"/>
      <el-table-column prop="subTitle" label="副标题"/>
      <el-table-column prop="rank" label="排序" width="80" align="center"/>
      <el-table-column label="上架" width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="changeStatus(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="openEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @current-change="changePage"
      style="margin-top:20px;text-align:right"/>

    <!-- 编辑 / 新建 Dialog -->
    <el-dialog
      :title="form.id ? '编辑书单' : '新增书单'"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="form.subTitle"/>
        </el-form-item>
        <el-form-item label="封面链接">
          <el-upload :action="''" :auto-upload="false" :show-file-list="false" :on-change="handleFileChange">
            <el-button size="mini">选择文件</el-button>
          </el-upload>
          <el-input v-model="form.cover" placeholder="或直接填写URL" style="margin-top:10px"/>
        </el-form-item>
        <el-form-item label="包含图书">
          <el-button size="mini" @click="openBookSelect">选择图书</el-button>
          <el-table :data="form.items" border size="mini" style="margin-top: 10px;">
            <el-table-column label="书名">
              <template slot-scope="scope">
                {{ getBookName(scope.row.bookId) }}
              </template>
            </el-table-column>
            <el-table-column label="推荐理由">
              <template slot-scope="scope">
                <el-input v-model="scope.row.recommendReason" placeholder="请输入推荐理由"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="移除" width="70" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="removeBook(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.rank" :min="0"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </el-dialog>

    <!-- 图书选择 Dialog -->
    <el-dialog
      title="选择图书"
      :visible.sync="bookSelectVisible"
      :append-to-body="true"
      width="800px">
      <div class="book-transfer-container">
        <el-transfer
          v-model="selectedBookIds"
          :data="allBooks"
          :titles="['未选图书', '已选图书']"
          filterable
          filter-placeholder="请输入图书名搜索">
        </el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bookSelectVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBookSelection">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getImageUrl} from "../../../../utils/imageUtils";
import {
  reqGetTopicList,
  reqAddTopic,
  reqUpdateTopic,
  reqDeleteTopic,
  reqChangeTopicStatus,
  reqUploadCover
} from "../../../../api/topic";
import { reqGetAllBooks } from "../../../../api/book";
import { reqGetTopicDetail } from "../../../../api/topic";

export default {
  name: "TopicManage",
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 10,
      total: 0,
      cacheVer: Date.now(),
      dialogVisible: false,
      bookSelectVisible: false,
      allBooks: [],
      selectedBookIds: [],
      bookMap: {},
      selectedFile: null,
      form: {
        id: null,
        title: '',
        subTitle: '',
        cover: '',
        rank: 0,
        status: true,
        items: []
      }
    };
  },
  methods: {
    getImg(path) {
      if(!path) return '';
      return getImageUrl(path)+`?v=${this.cacheVer}`;
    },
    getBookName(bookId) {
      return this.bookMap[bookId] || '未知图书';
    },
    loadAllBooks() {
      reqGetAllBooks().then(res => {
        if (res.code === 200) {
          this.allBooks = res.books.map(book => ({
            key: book.id,
            label: book.bookName,
            disabled: false
          }));
          this.bookMap = res.books.reduce((map, book) => {
            map[book.id] = book.bookName;
            return map;
          }, {});
        }
      });
    },
    load() {
      this.cacheVer = Date.now();
      reqGetTopicList(this.page, this.pageSize, true).then(res => {
        if (res.code === 200) {
          this.list = res.topicList;
          this.total = res.total;
        }
      });
    },
    changePage(p){this.page=p;this.load();},
    openCreate() {
      this.form = {title:'',subTitle:'',cover:'',rank:0,status:true,id:null, items: []};
      this.selectedBookIds = [];
      this.dialogVisible = true;
    },
    openEdit(row) {
      reqGetTopicDetail(row.id).then(res => {
        if (res.code === 200) {
          console.log("从后端获取的书单详情:", res);
          this.form = {...res.topic, items: res.items || []};
          this.selectedBookIds = this.form.items.map(item => item.bookId);
          console.log("设置已选图书ID为:", this.selectedBookIds);
          this.dialogVisible = true;
        }
      });
    },
    openBookSelect() {
      this.selectedBookIds = this.form.items.map(item => item.bookId);
      this.bookSelectVisible = true;
    },
    confirmBookSelection() {
      const newItems = this.selectedBookIds.map(bookId => {
        const existingItem = this.form.items.find(item => item.bookId === bookId);
        return existingItem || {
          bookId: bookId,
          recommendReason: '',
          orderNo: 0 // 将在保存时重新计算
        };
      });
      this.form.items = newItems;
      this.bookSelectVisible = false;
    },
    removeBook(index) {
      const removedBookId = this.form.items[index].bookId;
      this.form.items.splice(index, 1);
      this.selectedBookIds = this.selectedBookIds.filter(id => id !== removedBookId);
    },
    save() {
      // 保存前重新计算 orderNo
      this.form.items.forEach((item, index) => {
        item.orderNo = index + 1;
      });

      const payload = { ...this.form };
      if (this.selectedFile) {
        // 如果有新文件上传，则不提交 base64 格式的 cover 字段
        delete payload.cover;
      }

      const savePromise = payload.id
        ? reqUpdateTopic(payload.id, payload)
        : reqAddTopic(payload);

      savePromise.then(res => {
        if (res.code === 200) {
          const topicId = payload.id || (res.data ? res.data.id : null);

          const uploadPromise = this.selectedFile && topicId
              ? reqUploadCover(topicId, this.selectedFile)
              : Promise.resolve();

          uploadPromise.then(() => {
            this.$message.success('操作成功');
            this.dialogVisible = false;
            this.selectedFile = null;
            setTimeout(() => this.load(), 300); // 延迟加载以等待服务器文件同步
          });
        } else {
          this.$message.error(res.message || '保存失败');
        }
      }).catch(err => {
        console.error("保存书单操作失败: ", err);
        this.$message.error('请求失败，请稍后重试');
      });
    },
    del(row){
      this.$confirm('确认删除该书单?', '提示', {type:'warning'}).then(()=>{
        reqDeleteTopic(row.id).then(res=>{if(res.code===200){this.$message.success('删除成功');this.load();}})
      });
    },
    changeStatus(row){
      reqChangeTopicStatus(row.id,row.status).then(()=>{});
    },
    handleFileChange(file) {
      this.selectedFile = file.raw;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.form.cover = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  },
  mounted(){
    this.load();
    this.loadAllBooks();
  }
};
</script>

<style>
.el-dialog {
  display: flex;
  flex-direction: column;
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  max-height:calc(100% - 30px);
  max-width:calc(100% - 30px);
}
.el-dialog .el-dialog__body {
  flex:1;
  overflow: auto;
}

/* 强制 transfer 组件左右布局 */
.book-transfer-container .el-transfer {
  display: flex !important;
  flex-direction: row !important;
  align-items: flex-start !important;
  justify-content: center !important;
  text-align: left !important;
}

.book-transfer-container .el-transfer__buttons {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  margin: 0 20px !important;
  padding: 0 !important;
}

.book-transfer-container .el-transfer-panel {
  width: 250px !important;
  display: inline-block !important;
  vertical-align: top !important;
  margin: 0 !important;
}

/* 确保穿梭框按钮垂直排列 */
.book-transfer-container .el-transfer__button {
  display: block !important;
  margin: 5px 0 !important;
}
</style>

<style scoped>
.header-card{margin-bottom:15px;}
.title{font-size:16px;font-weight:600;}
.btn-add{float:right;}
.book-count-tag {
  margin-left: 10px;
}
</style> 