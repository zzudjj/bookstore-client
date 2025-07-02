<template>
  <div class="about-manage" v-loading="loading">
    <el-card>
      <div slot="header" class="clearfix">
        <span>网站介绍</span>
        <el-button style="float: right" type="primary" size="mini" @click="save">保存</el-button>
      </div>
      <el-input type="textarea" :rows="15" v-model="content" placeholder="请输入网站介绍内容"/>
    </el-card>
  </div>
</template>

<script>
import { reqGetAbout, reqModifyAbout, reqAddAbout } from "../../../../api/about";

export default {
  name: "AboutManage",
  data() {
    return {
      loading: false,
      aboutId: null,
      content: ''
    }
  },
  methods: {
    load() {
      this.loading = true;
      reqGetAbout().then(res => {
        this.loading = false;
        if (res.code === 200 && res.about) {
          this.aboutId = res.about.id;
          this.content = res.about.content;
        }
      })
    },
    save() {
      const api = this.aboutId ? reqModifyAbout : reqAddAbout;
      api({ id: this.aboutId, content: this.content }).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功');
          if (!this.aboutId) this.load();
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
.about-manage {
  padding: 20px;
}
</style> 