<template>
  <div class="modern-homepage">
    <Nav></Nav>
    <main class="detail container" v-loading="loading">
      <h2 class="title">{{ announcement.title }}</h2>
      <p class="time">{{ formatDate(announcement.publishTime) }}</p>
      <div class="content" v-html="announcement.content"></div>
    </main>
    <Footer></Footer>
  </div>
</template>

<script>
import { reqGetAnnouncement } from '../../api/announcement';
import Nav from "../../components/Common/BaseNavigation";
import Footer from "../../components/Common/BaseFooter";

export default {
  name: 'AnnouncementDetail',
  components: { Nav, Footer },
  data() {
    return {
      loading: false,
      announcement: {}
    }
  },
  methods: {
    load() {
      const id = this.$route.query.id;
      if (!id) return;
      this.loading = true;
      reqGetAnnouncement(id).then(res => {
        this.loading = false;
        if (res.code === 200) {
          this.announcement = res.announcement;
        }
      })
    },
    formatDate(t) { return t ? t.substr(0,10) : '' }
  },
  created() { this.load(); }
}
</script>

<style scoped>
.detail.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}
.title { text-align:center; margin-bottom:10px; }
.time { text-align:center; color:#999; margin-bottom:20px; }
.content { line-height:1.8; }
</style> 