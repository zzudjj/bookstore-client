<template>
  <div class="topic-list-page">
    <Nav/>
    <div class="container">
      <h2 class="page-title">主题书单</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in list" :key="item.id">
          <router-link :to="{path:'/topic',query:{id:item.id}}" class="topic-card">
            <el-card shadow="hover">
              <img :src="getImageUrl(item.cover)" class="cover"/>
              <div class="info">
                <h3>{{item.title}}</h3>
                <p>{{item.subTitle}}</p>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        @current-change="handleChange"/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Nav from "../../components/Common/BaseNavigation";
import Footer from "../../components/Common/BaseFooter";
import {reqGetTopicList} from "../../api/topic";
import {getImageUrl} from "../../utils/imageUtils";

export default {
  name: "TopicsList",
  components: {Nav, Footer},
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 12,
      total: 0
    };
  },
  methods: {
    loadData() {
      reqGetTopicList(this.page, this.pageSize).then(res => {
        if (res.code === 200) {
          this.list = res.topicList;
          this.total = res.total;
        }
      });
    },
    handleChange(p) {
      this.page = p;
      this.loadData();
    },
    getImageUrl(path) {
      return getImageUrl(path);
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style scoped>
.topic-card {
  text-decoration: none;
}
.cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
.info h3 {
  margin: 10px 0 5px 0;
  font-size: 16px;
}
.info p {
  margin: 0;
  color: #999;
}
</style> 