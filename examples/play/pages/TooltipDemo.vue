<template>
  <div>
    <el-tooltip class="item" effect="dark" content="Top Left 提示文字上左上左上上左上左上左上左上左上左上左上左上左上左上上左上左上左上左上左上左上左上左上左上左上上左上左上左上左上左上左上左上左上左上左上左上左上左上左上左上左上上左上左上左上左上左上左上左上左上左上左上上左上左上左上左上左上左上左上左上左上左上上左上左上左上左上左上左上左上左上左上左上左上左上左上左上左上左上上左上左上左上左上左上左上左上左上左上左上上左上左上左上左上左上左上左上左上左上左上上左上左上左上左上左上左上左上左上左上左上左上左上左上左" placement="top-start" popper-class="tip-popper-class">
      <el-button>上左</el-button>
    </el-tooltip>
    <div ref="comp" class="comp">
      <h3>Hello Vue 2 + Vite</h3>
      <el-button type="primary">按钮</el-button>
      <!-- <el-tooltip
        ref="elTooltip"
        class="item"
        effect="light"
        placement="top"
        popper-class="tip-popper-class"
        :popper-options="popperOptions">
          <el-button>上边</el-button>
          <div slot="content" class="tooltipContainer">
            <div v-for="(item, index) in 100" :key="index">{{ item }}-这是内容</div>
          </div>
      </el-tooltip> -->
    </div>
    <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
      <el-button>上左</el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      popperOptions: { boundariesElement: this.$refs.comp, gpuAcceleration: true },
    }
  },
  created() {
    this.$message('这是一条消息提示')
  },
  mounted() {
    console.log('this.$refs.elTooltip', this.$refs.elTooltip)
    this.popperOptions = {
      ...this.popperOptions,
      boundariesElement: this.$refs.comp,
    }

    // this.$nextTick(()=>{
    //   this.$refs.elTooltip.updatePopper()
    // })
  },
}
</script>

<style>
body {
  padding: 0;
  margin: 0;
  position: relative;
}

#app {
  padding: 10px;
}
.tooltipContainer {
  max-height: 200px;
  overflow: auto;
}
.comp {
  width: 300px;
  height: 200px;
  background: lightblue;
  margin-top: 300px;
}

.tip-popper-class {
  max-width: 600px;
}
</style>

