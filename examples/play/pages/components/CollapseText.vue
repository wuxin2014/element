<template>
  <div class="wrapper">
    <div ref="textRef" class="text" :class="{expand: isExpand}">
      <label v-show="isTextOverflow" class="expand-btn" @click="isExpand = !isExpand">{{ isExpand ? '收起' : '展开' }}</label>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTextOverflow: false,
      isExpand: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.$refs.textRef.style.height = "auto"; // 多余
      this.isTextOverflow = this.$refs.textRef.scrollHeight > this.$refs.textRef.clientHeight;
    })
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  width: 100%;
  overflow: hidden;

}
.text {
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-align: justify;
  position: relative;
  &.expand {
    -webkit-line-clamp: 999;
  }

  &::before {
    content: "";
    height: calc(100% - 24px);
    float: right;
  }

  .expand-btn {
    float: right;
    clear: both;
    margin-left: 10px;
    font-size: 16px;
    padding: 0 8px;
    background: #3f51b5;
    line-height: 24px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
  }
}
</style>