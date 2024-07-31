<template>
  <div>
    <!-- <div class="wrapper">
      <input :id="id" class="exp" type="checkbox" />
      <div class="text" ref="textRef">
        <label v-if="isTextOverflow" class="btn" :for="id"></label>
        <slot></slot>
      </div>
    </div> -->
    <div class="wrapper">
      <div ref="textRef" class="text" :class="{expand: isExpand}">
        <label v-show="isTextOverflow" class="expand-btn" @click="isExpand = !isExpand">{{ isExpand ? '收起' : '展开' }}</label>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
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
  width: 800px;
  padding: 15px;
  margin: 50px auto;
  border-radius: 8px;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
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

  &::before {
    content: "";
    height: calc(100% - 24px);
    float: right;
  }

  &.expand {
    -webkit-line-clamp: 999;
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

  .btn {
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

    &::before {
      content: "展开";
    }
  }
}
.exp {
  display: none;
}
.exp:checked + .text {
  -webkit-line-clamp: 999;
}
.exp:checked + .text .btn::before {
  content: "收起";
}
</style>