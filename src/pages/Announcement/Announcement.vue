<template>
  <div class="modern-homepage">
    <Nav></Nav>

    <main class="announcement-page container">
      <h2 class="title">网站公告</h2>
      <ul class="announcement-list">
        <li v-for="item in announcements" :key="item.id" class="item">
          <router-link :to="{path:'/announcement/detail', query:{id:item.id}}" class="detail-link">
            <h3>{{ item.title }}</h3>
            <p class="time">{{ formatDate(item.publishTime) }}</p>
          </router-link>
        </li>
      </ul>
    </main>

    <Footer></Footer>
  </div>
</template>

<script>
import { reqGetEnabledAnnouncementList } from '../../api/announcement';
import Nav from "../../components/Common/BaseNavigation";
import Footer from "../../components/Common/BaseFooter";

export default {
  name: 'AnnouncementPage',
  components: { Nav, Footer },
  data() {
    return {
      announcements: []
    }
  },
  methods: {
    load() {
      reqGetEnabledAnnouncementList().then(res => {
        if (res.code === 200) {
          this.announcements = res.announcementList || [];
        }
      })
    },
    formatDate(timeStr) {
      return timeStr ? timeStr.substr(0, 10) : '';
    }
  },
  created() {
    this.load();
  }
}
</script>

<style scoped>
.modern-homepage {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}
.title {
  text-align: center;
  margin-bottom: 20px;
}
.item h3 {
  margin: 0;
}
.time {
  color: #999;
  font-size: 12px;
}
.content {
  margin: 10px 0 20px;
}
</style> 