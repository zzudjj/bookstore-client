<template>
  <div class="content">
    <el-card class="box-card" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          size="small">
          查询
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 25px">
        <el-form :inline="true" :model="search" size="small" label-width="140px">
          <el-form-item label="书名">
            <el-input v-model="search.bookName"></el-input>
          </el-form-item>
          <el-form-item label="ISBN">
            <el-input v-model="search.isbn"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="search.author"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-cascader
              v-model="book.bookSort"
              :options="options"
              :props="{ checkStrictly: true }"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="出版社">
            <el-select v-model="book.publish" placeholder="请选择出版社" prop="publish">
              <el-option
                v-for="item in publishList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态">
            <el-select v-model="search.put" placeholder="请选择上架状态">
              <el-option label="上架" value="shanghai"></el-option>
              <el-option label=下架 value="beijing"></el-option>
            </el-select>
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
        size="mini">
        添加
      </el-button>
    </el-card>

    <div class="table_content">
      <el-table
        ref="multipleTable"
        border
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :row-style="getRowStyle"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          label="编号"
          width="60"
          align="center">
          <template slot-scope="scope">
            <el-tag size="mini" type="info">{{ scope.row.id }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="图书信息"
          min-width="300"
          align="left">
          <template slot-scope="scope">
            <div class="book-info">
              <el-image
                class="book-cover"
                :src="getBookCoverUrl(scope.row.coverImg)"
                fit="cover">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div class="book-details">
                <div class="book-title">{{ scope.row.bookName }}</div>
                <div class="book-meta">
                  <span class="author">作者：{{ scope.row.author }}</span>
                  <span class="isbn">ISBN：{{ scope.row.isbn }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="价格信息"
          width="120"
          align="center">
          <template slot-scope="scope">
            <div class="price-info">
              <div class="market-price">原价：<span class="price-value">¥{{ scope.row.marketPrice }}</span></div>
              <div class="sale-price">售价：<span class="price-value sale">¥{{ scope.row.price }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="库存/销量"
          width="100"
          align="center">
          <template slot-scope="scope">
            <div class="stock-sales">
              <div class="stock-info">
                <span class="label">库存：</span>
                <span :class="['value', scope.row.stock <= 10 ? 'low-stock' : '']">
                  {{ scope.row.stock }}
                </span>
              </div>
              <div class="sales-info">
                <span class="label">销量：</span>
                <span class="value">{{ scope.row.sales || 0 }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态标签"
          width="140"
          align="center">
          <template slot-scope="scope">
            <div class="status-tags">
              <div class="tag-row">
                <span class="tag-label">上架</span>
                <el-switch
                  v-model="scope.row.put"
                  size="mini"
                  @change="handlePut($event,scope.row,scope.$index)">
                </el-switch>
              </div>
              <div class="tag-row">
                <span class="tag-label">新品</span>
                <el-switch
                  v-model="scope.row.newProduct"
                  size="mini"
                  @change="handleNew($event,scope.row,scope.$index)">
                </el-switch>
              </div>
              <div class="tag-row">
                <span class="tag-label">推荐</span>
                <el-switch
                  v-model="scope.row.recommend"
                  size="mini"
                  @change="handleRec($event,scope.row,scope.$index)">
                </el-switch>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="rank"
          label="排序"
          width="70"
          align="center">
          <template slot-scope="scope">
            <el-tag size="mini" type="warning">{{ scope.row.rank }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="140"
          align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="updateBook(scope.$index,scope.row)"
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

  </div>
</template>

<script>
    import {reqGetPublishNames} from "../../../../api/publish";
    import {reqGetSortList} from "../../../../api/sort";
    import {reqGetBookList,reqDelBook,reqModifyPut,reqModifyRec,reqModifyNew} from "../../../../api/book";
    import {getBookCoverUrl} from "../../../../utils/imageUtils";
    import axios from 'axios';
    import qs from 'qs';
    export default {
        name: "BookList",
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
                    bookName: '',
                    author: '',
                    isbn: '',
                    publish: '',
                    put: '',
                    bookSort: '',
                },
                publishList: [],//出版社下拉选择器
                options: [],//图书分类的联机选择器
                // options: [{
                //     value: 'zhinan',
                //     label: '指南',
                //     children: [{
                //         value: 'shejiyuanze',
                //         label: '设计原则',
                //     }, {
                //         value: 'daohang',
                //         label: '导航',
                //     }]
                // }, {
                //     value: 'zujian',
                //     label: '组件',
                //     children: [{
                //         value: 'basic',
                //         label: 'Basic',
                //     }, {
                //         value: 'form',
                //         label: 'Form',
                //     }, {
                //         value: 'data',
                //         label: 'Data',
                //     }, {
                //         value: 'notice',
                //         label: 'Notice',
                //     }, {
                //         value: 'navigation',
                //         label: 'Navigation',
                //     }, {
                //         value: 'others',
                //         label: 'Others',
                //     }]
                // }],

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
            this.getSortList();
            this.GetSort(1,5);
            console.log("init起作用了！")
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
                this.GetSort(1,this.page_size);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                console.log(this.currentPage+":"+this.page_size);
                this.GetSort(this.currentPage,this.page_size);
            },
            //得到图书列表
            GetSort(page,pageSize){
                this.loading=false;
                reqGetBookList(page,pageSize).then(response=>{
                    if(response.code==200){
                        this.total = response.total;
                        console.log(this.total);
                        this.tableData = response.bookList;
                    }
                    console.log(response);
                }).catch(err=>{
                    console.log(err);
                })
            },

            // 表格行样式
            getRowStyle({row, rowIndex}) {
                return {
                    height: '80px'
                };
            },

            // 获取图书封面完整URL
            getBookCoverUrl(coverImg) {
                return getBookCoverUrl(coverImg);
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

            //处理是否显示滑块的改变
            handlePut(e,row,index){
                console.log(row.put);
                reqModifyPut(row.id,row.put).then(response=>{
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
                }).catch(err=>{
                    console.log(err);
                })
            },

            handleRec(e,row,index){
                console.log(row.put);
                reqModifyRec(row.id,row.recommend).then(response=>{
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
                }).catch(err=>{
                    console.log(err);
                })
            },
            handleNew(e,row,index){
                console.log(row.put);
                reqModifyNew(row.id,row.newProduct).then(response=>{
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
                }).catch(err=>{
                    console.log(err);
                })
            },



            //处理删除函数
            handleDelete(index, row){
                this.$confirm('是否要进行删除操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    reqDelBook(row.id).then(response=>{
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
                        this.GetSort(this.currentPage,this.page_size);
                    }).catch(err=>{
                        console.log(err);
                    })
                }).catch(()=>{
                    console.log("取消删除了");
                });
            },


            //得到并设置图书分类的联级选择器
            getSortList() {
                reqGetSortList().then(response => {
                    let list = response.sortResponseList;
                    this.options = [];
                    for (let i = 0; i < list.length; i++) {
                        let children = [];
                        if (list[i].children != null && list[i].children.length > 0) {
                            for (let j = 0; j < list[i].children.length; j++) {
                                children.push({label: list[i].children[j].sortName, value: list[i].children[j].id});
                            }
                        }
                        console.log(list[i]);
                        this.options.push({label: list[i].upperSort.sortName, value: list[i].upperSort.id, children: children});
                    }
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

/* 图书信息样式 */
.book-info {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.book-cover {
  width: 60px;
  height: 80px;
  margin-right: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.book-details {
  flex: 1;
}

.book-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.4;
}

.book-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.book-meta span {
  font-size: 12px;
  color: #909399;
}

.author {
  color: #606266;
}

.isbn {
  color: #909399;
}

/* 价格信息样式 */
.price-info {
  text-align: center;
}

.market-price, .sale-price {
  margin: 4px 0;
  font-size: 12px;
}

.market-price {
  color: #909399;
  text-decoration: line-through;
}

.sale-price {
  color: #E6A23C;
  font-weight: 600;
}

.price-value {
  font-weight: 600;
}

.price-value.sale {
  color: #E6A23C;
  font-size: 14px;
}

/* 库存销量样式 */
.stock-sales {
  text-align: center;
}

.stock-info, .sales-info {
  margin: 6px 0;
  font-size: 12px;
}

.stock-info .label, .sales-info .label {
  color: #909399;
}

.stock-info .value, .sales-info .value {
  font-weight: 600;
  color: #303133;
}

.stock-info .value.low-stock {
  color: #F56C6C;
  font-weight: 700;
}

/* 状态标签样式 */
.status-tags {
  padding: 5px 0;
}

.tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0;
  padding: 0 5px;
}

.tag-label {
  font-size: 12px;
  color: #606266;
  min-width: 30px;
}

/* 图片错误占位符 */
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 20px;
}

/deep/ .el-input__inner {
  padding-right: 0px;
}

</style>
