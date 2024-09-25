<template>
  <div class="container" style="height: 600px;">
    <el-button
      type="primary"
      @click="openFullScreen1"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-text="Loading"
      element-loading-background="rgba(255, 255, 255, 0.4)"
      element-loading-spinner="el-icon-loading">
      指令方式
    </el-button>
    <el-button
      type="primary"
      @click="openFullScreen2">
      服务方式
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingInstance: null,
      fullscreenLoading: false,
    }
  },
  mounted() {
    this.$PLoading.show()
    setTimeout(() => {
      this.$PLoading.hide()
    }, 2000);
  },
  methods: {
    openFullScreen1() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
    openFullScreen2() {
      debugger
      this.loadingInstance = this.$loading({
        target: 'container',
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.4)'
      });
      setTimeout(() => {
        // this.loadingInstance.close()
      }, 2000)
    },
  }
}
</script>

<style>
</style>