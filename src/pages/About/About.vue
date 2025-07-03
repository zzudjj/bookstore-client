<template>
  <div class="modern-homepage">
    <Nav></Nav>

    <main class="about-page container">
      <h2 class="title">关于我们</h2>
      <div class="content" v-html="about.content"></div>
    </main>

    <Footer></Footer>
  </div>
</template>

<script>
import { reqGetAbout } from '../../api/about';
import Nav from "../../components/Common/BaseNavigation";
import Footer from "../../components/Common/BaseFooter";

export default {
  name: 'AboutPage',
  components: { Nav, Footer },
  data() {
    return {
      about: {}
    }
  },
  methods: {
    load() {
      reqGetAbout().then(res => {
        if (res.code === 200) {
          this.about = res.about || {};
        }
      })
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
.content {
  line-height: 1.8;
}
</style> 