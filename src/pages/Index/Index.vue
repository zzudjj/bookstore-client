<template>
  <div class="modern-homepage">
    <!-- 🧭 导航栏 -->
    <Nav></Nav>

    <!-- 🎯 主要内容区域 -->
    <main class="homepage-main">

      <!-- 🎠 轮播图和快速导航区域 -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">

            <!-- 📋 分类导航侧边栏 -->
            <aside class="category-sidebar">
              <div class="sidebar-header">
                <i class="el-icon-menu"></i>
                <span>图书分类</span>
              </div>

              <div class="category-menu">
                <div
                  v-for="(item, index) in options"
                  :key="index"
                  class="category-item"
                  @mouseenter="showSubMenu(index)"
                  @mouseleave="hideSubMenu">

                  <div class="category-main">
                    <template v-if="item.length >= 2">
                      <router-link
                        :to="{path: '/search', query: {id: item[0].value, name: item[0].label}}"
                        class="category-link">
                        {{ item[0].label }}
                      </router-link>
                      <span class="separator">|</span>
                      <router-link
                        :to="{path: '/search', query: {id: item[1].value, name: item[1].label}}"
                        class="category-link">
                        {{ item[1].label }}
                      </router-link>
                    </template>

                    <template v-else-if="item.length === 1">
                      <router-link
                        :to="{path: '/search', query: {id: item[0].value, name: item[0].label}}"
                        class="category-link">
                        {{ item[0].label }}
                      </router-link>
                    </template>

                    <i class="el-icon-arrow-right category-arrow"></i>
                  </div>

                  <!-- 📂 子分类悬浮面板 -->
                  <transition name="submenu-fade">
                    <div
                      v-show="currentSubMenu === index"
                      class="submenu-panel">
                      <div
                        v-for="book in item"
                        :key="book.value"
                        class="submenu-section">
                        <h4 class="submenu-title">
                          <router-link
                            :to="{path: '/search', query: {id: book.value, name: book.label}}">
                            {{ book.label }}
                          </router-link>
                        </h4>
                        <div class="submenu-links">
                          <router-link
                            v-for="child in book.children"
                            :key="child.value"
                            :to="{path: '/search', query: {id: child.value, name: getName(book.label, child.label)}}"
                            class="submenu-link">
                            {{ child.label }}
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <!-- 📞 客服信息 -->
              <div class="customer-service">
                <div class="service-icon">
                  <i class="el-icon-phone"></i>
                </div>
                <div class="service-info">
                  <h4>书店客服中心</h4>
                  <p>预约电话 010-8430 857</p>
                </div>
              </div>
            </aside>

            <!-- 🎠 轮播图区域 -->
            <div class="carousel-area">
              <Carousel :imgList="bookTopicList"></Carousel>

              <!-- 🔥 快速入口 -->
              <div class="quick-entries">
                <router-link
                  v-for="entry in quickEntries"
                  :key="entry.name"
                  :to="entry.path"
                  class="quick-entry">
                  <i :class="entry.icon"></i>
                  <span>{{ entry.name }}</span>
                </router-link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 📚 图书展示区域 -->
      <section class="books-showcase">
        <div class="container">

          <!-- 🔥 最新出版 -->
          <div class="showcase-section">
            <div class="section-title">
              <h2>
                <i class="el-icon-star-on"></i>
                最新出版
              </h2>
              <router-link to="/search" class="view-more">
                查看更多 <i class="el-icon-arrow-right"></i>
              </router-link>
            </div>
            <GalleryBook></GalleryBook>
          </div>

          <!-- ⚡ 今日秒杀 -->
          <div class="showcase-section">
            <div class="section-title">
              <h2>
                <i class="el-icon-lightning"></i>
                今日秒杀
              </h2>
              <router-link to="/spike" class="view-more">
                查看更多 <i class="el-icon-arrow-right"></i>
              </router-link>
            </div>
            <SpikeBox></SpikeBox>
          </div>

        </div>
      </section>

      <!-- 🎯 推荐图书区域 -->
      <section class="recommended-books">
        <div class="container">
          <RecBookBox :list-sort="recommend"></RecBookBox>
        </div>
      </section>

      <!-- 📖 新品图书区域 -->
      <section class="new-books">
        <div class="container">
          <RecBookBox :list-sort="newProduct"></RecBookBox>
        </div>
      </section>

      <!-- 🏷️ 分类图书区域 -->
      <!-- <section class="category-books">
        <div class="container">
          <BookBox></BookBox>
        </div>
      </section> -->

    </main>

    <!-- 🦶 页脚 -->
    <Footer></Footer>

  </div>
</template>

<script>
    import Nav from "../../components/Common/BaseNavigation";
    import Footer from "../../components/Common/BaseFooter";
    import Carousel from "../../components/Index/Carousel";
    import GalleryBook from "../../components/Index/BookGallery";
    import SpikeBox from "../../components/Index/FlashSaleCard";
    import BookBox from "../../components/Index/BookCard";
    import RecBookBox from "../../components/Index/RecommendedBooks";
    import {reqGetSortList} from "../../api/sort";
    import {reqGetTopicList} from "../../api/bookTopic";

    export default {
        name: "index",
        components: {Nav,Footer,Carousel,GalleryBook,SpikeBox,BookBox,RecBookBox},
        data() {
            return {
                recommend: "recommend",
                newProduct: "newProduct",
                bookTopicList: [],

                // 分类菜单相关
                currentSubMenu: null,
                options: [],

                // 快速入口配置
                quickEntries: [
                  { name: '新书推荐', path: '/search?sort=new', icon: 'el-icon-star-on' },
                  { name: '热门图书', path: '/search?sort=hot', icon: 'el-icon-lightning' },
                  { name: '特价专区', path: '/spike', icon: 'el-icon-price-tag' },
                  { name: '图书分类', path: '/search', icon: 'el-icon-collection' }
                ]
            };
        },
        methods: {
            // 显示子菜单
            showSubMenu(index) {
                this.currentSubMenu = index;
            },

            // 隐藏子菜单
            hideSubMenu() {
                this.currentSubMenu = null;
            },

            //得到书单列表
            GetTopic(page,pageSize){
                this.loading=false;
                reqGetTopicList(page,pageSize).then(response=>{
                    if(response.code==200){
                        this.bookTopicList = [];
                        let list = response.bookTopicList;
                        for(let i=0;i<list.length;i++){
                            this.bookTopicList.push({cover:list[i].cover,id:list[i].id});
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },

            getName(upperName,childName){
                return upperName+"/"+childName;
            },

            //得到并设置图书分类的联级选择器
            getSortList() {
                reqGetSortList().then(response => {
                    if(response.code==200){
                        console.log("list:"+response);
                        let list = response.sortResponseList;
                        this.options = [];
                        if(list.length%2==0){
                            for (let i = 0; i < list.length; i=i+2) {
                                let children = [];
                                if (list[i].children != null && list[i].children.length > 0) {
                                    for (let j = 0; j < list[i].children.length; j++) {
                                        children.push({label: list[i].children[j].sortName, value: list[i].children[j].id});
                                    }
                                }
                                // console.log(list[i]);

                                let children1 = [];
                                if (list[i+1].children != null && list[i+1].children.length > 0) {
                                    for (let j = 0; j < list[i+1].children.length; j++) {
                                        children1.push({label: list[i+1].children[j].sortName, value: list[i+1].children[j].id});
                                    }
                                }
                                // console.log(list[i+1]);
                                this.single=0
                                this.options.push([{label: list[i].upperSort.sortName, value: list[i].upperSort.id, seen: false, children: children},{label: list[i+1].upperSort.sortName, value: list[i+1].upperSort.id, seen: false, children: children1}])
                            }
                        }
                        else {
                            for (let i = 0; i < list.length-1; i=i+2) {
                                let children = [];
                                if (list[i].children != null && list[i].children.length > 0) {
                                    for (let j = 0; j < list[i].children.length; j++) {
                                        children.push({label: list[i].children[j].sortName, value: list[i].children[j].id});
                                    }
                                }
                                // console.log(list[i]);

                                let children1 = [];
                                if (list[i+1].children != null && list[i+1].children.length > 0) {
                                    for (let j = 0; j < list[i+1].children.length; j++) {
                                        children1.push({label: list[i+1].children[j].sortName, value: list[i+1].children[j].id});
                                    }
                                }
                                // console.log(list[i+1]);

                                this.options.push([{label: list[i].upperSort.sortName, value: list[i].upperSort.id, seen: false, children: children},{label: list[i+1].upperSort.sortName, value: list[i+1].upperSort.id, seen: false, children: children1}])
                            }
                            let children2 = [];
                            if (list[list.length-1].children != null && list[list.length-1].children.length > 0) {
                                for (let j = 0; j < list[list.length-1].children.length; j++) {
                                    children2.push({label: list[list.length-1].children[j].sortName, value: list[list.length-1].children[j].id});
                                }
                            }
                            this.options.push([{label: list[list.length-1].upperSort.sortName, value: list[list.length-1].upperSort.id, seen: false, children: children2}])
                            this.single=1;
                        }
                    }
                });
            },

        },
        computed:{
            optionsList(){
                const optionsList  = [];
                const a = this.options;
                for(let i=0;i<a.length;i=i+2){
                  let j=i+1;
                  optionsList.push([a[i],a[j]]);
                }
                return optionsList;
            }
        },
        mounted(){
            // this.getSortList();
            this.getSortList();
        },
        created() {
            this.GetTopic(1,5);
            // this.getSortList();
        },
    }
</script>

<style scoped>
/* 🏠 现代化首页样式 */

.modern-homepage {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 📦 通用容器 */
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 🎯 主要内容区域 */
.homepage-main {
  padding-top: 0;
}

/* 🎠 英雄区域 */
.hero-section {
  background: white;
  padding: 30px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.hero-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* 📋 分类侧边栏 */
.category-sidebar {
  width: 250px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: visible; /* 允许子元素溢出，解决悬浮面板被遮挡问题 */
  flex-shrink: 0;
}

.sidebar-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.category-menu {
  position: relative;
}

.category-item {
  position: relative;
  border-bottom: 1px solid #f0f0f0;
}

.category-item:last-child {
  border-bottom: none;
}

.category-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-main:hover {
  background: #f8f9fa;
  color: #667eea;
}

.category-link {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.category-link:hover {
  color: #667eea;
}

.separator {
  margin: 0 8px;
  color: #ddd;
}

.category-arrow {
  color: #ccc;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.category-item:hover .category-arrow {
  transform: translateX(3px);
  color: #667eea;
}

/* 📂 子菜单面板 */
.submenu-panel {
  position: absolute;
  left: 100%;
  top: 0;
  width: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 1000;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.submenu-section {
  padding: 10px 0;
}

.submenu-title {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.submenu-title a {
  color: #667eea;
  text-decoration: none;
}

.submenu-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.submenu-link {
  padding: 4px 8px;
  background: #f8f9fa;
  color: #666;
  text-decoration: none;
  border-radius: 6px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.submenu-link:hover {
  background: #667eea;
  color: white;
}

/* 📞 客服信息 */
.customer-service {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  padding: 20px;
  margin: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.service-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.service-info h4 {
  margin: 0 0 5px 0;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.service-info p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

/* 🎠 轮播图区域 */
.carousel-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 🔥 快速入口 */
.quick-entries {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.quick-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.quick-entry:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  color: #667eea;
}

.quick-entry i {
  font-size: 32px;
  color: #667eea;
}

.quick-entry span {
  font-size: 14px;
  font-weight: 500;
}

/* 📚 图书展示区域 */
.books-showcase {
  background: white;
  padding: 40px 0;
}

.showcase-section {
  margin-bottom: 50px;
}

.showcase-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
}

.section-title h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.section-title h2 i {
  color: #667eea;
  font-size: 28px;
}

.view-more {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-more:hover {
  color: #764ba2;
  transform: translateX(3px);
}

/* 🎯 推荐图书区域 */
.recommended-books {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.recommended-books::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="20" cy="80" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.recommended-books .container {
  position: relative;
  z-index: 1;
}

/* 📖 新品图书区域 */
.new-books {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.new-books::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.2)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  opacity: 0.4;
}

.new-books .container {
  position: relative;
  z-index: 1;
}

/* 🏷️ 分类图书区域 */
.category-books {
  background: #f8f9fa;
  padding: 60px 0;
}

/* 🎬 过渡动画 */
.submenu-fade-enter-active,
.submenu-fade-leave-active {
  transition: all 0.3s ease;
}

.submenu-fade-enter {
  opacity: 0;
  transform: translateX(-10px);
}

.submenu-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* 📱 响应式设计 */
@media (max-width: 1200px) {
  .container {
    padding: 0 15px;
  }

  .hero-content {
    flex-direction: column;
  }

  .category-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .submenu-panel {
    width: 100%;
    left: 0;
    top: 100%;
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }

  .quick-entries {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-title {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .section-title h2 {
    font-size: 20px;
  }

  .books-showcase,
  .recommended-books,
  .new-books,
  .category-books {
    padding: 30px 0;
  }
}

@media (max-width: 480px) {
  .quick-entries {
    grid-template-columns: 1fr;
  }

  .quick-entry {
    padding: 15px;
  }

  .section-title h2 {
    font-size: 18px;
  }
}
</style>
