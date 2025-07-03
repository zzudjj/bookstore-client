<template>
  <div class="content">
    <el-carousel :interval="5000" arrow="always" height="300px">
      <el-carousel-item v-for="item in imgList" :key="item.id">
        <router-link :to="{path: '/topic',query:{id:item.id}}">
        <img :src="getImg(item.cover)" alt="图片" @error="imgError($event)"/>
        </router-link>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import {getImageUrl} from "../../utils/imageUtils";
    export default {
        name: "Carousel",
        props:{
            imgList: {
                type: Array,
                default: null
            }
        },
        data(){
            return{
                imgS: ["static/image/20.jpg",
                    "static/image/21.jpg",
                    "static/image/22.jpg",
                    "static/image/23.jpg"],
                fallback: '/static/image/topic/default_topic_cover.svg'
            }
        },
        methods:{
          getImg(path){return getImageUrl(path);},
          imgError(e){e.target.src=this.fallback;}
        },
        created() {
            // console.log("轮播图中this.imgList:"+this.imgList)
        }
    }
</script>

<style scoped>
  .content{
    width: 100%;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  img{
    width: 100%;
    height: 100%;
    /*height: inherit;*/
  }
</style>
