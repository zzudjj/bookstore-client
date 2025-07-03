<template>
  <div class="topic-detail">
    <Nav/>
    <div class="header" :style="{'background-image': 'url(' + getImg(topic.cover) + ')'}">
      <div class="mask"></div>
      <div class="title-box">
        <h1>{{topic.title}}</h1>
        <p>{{topic.subTitle}}</p>
      </div>
    </div>

    <div class="container list-zone">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="item in items" :key="item.bookId">
          <router-link :to="{path:'/book',query:{id:item.bookId}}" class="book-card">
            <el-card>
              <el-image :src="getImg(item.cover)" class="book-cover" fit="cover"/>
              <div class="reco-info">
                <p class="reason">{{item.recommendReason}}</p>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Nav from "../../components/Common/BaseNavigation";
import Footer from "../../components/Common/BaseFooter";
import {reqGetTopicDetail} from "../../api/topic";
import {getImageUrl,getBookCoverUrl} from "../../utils/imageUtils";

export default {
  name: "TopicDetail",
  components:{Nav,Footer},
  data(){
    return{
      id:null,
      topic:{},
      items:[]
    };
  },
  created(){
    this.id = this.$route.query.id;
    this.loadData();
  },
  methods:{
    loadData(){
      reqGetTopicDetail(this.id).then(res=>{
        if(res.code===200){
          this.topic = res.topic;
          this.items = res.items;
        }
      });
    },
    getImg(path){return getImageUrl(path);},
    // cover already provided
  }
};
</script>

<style scoped>
.header{
  height:300px;
  background-size:cover;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
}
.mask{
  position:absolute;
  top:0;left:0;right:0;bottom:0;
  background:rgba(0,0,0,0.4);
}
.title-box{
  position:relative;
  color:#fff;
  text-align:center;
}
.list-zone{
  padding:40px 0;
}
.book-card{text-decoration:none;}
.book-cover{width:100%;height:220px;object-fit:cover;}
.reason{margin:10px 0 0 0;color:#ff9f00;font-size:14px;}
</style> 