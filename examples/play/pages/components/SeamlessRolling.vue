<template>
  <div class="listScroll" ref="box">
    <div ref="listRef" :style="{ transitionDuration: `${transitionDuration}ms`, transform: `translateY(-${height}px)`}">
      <slot></slot>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "SeamlessRolling",
  props: {
    length: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      height: 0,
      transitionDuration: 500,
    };
  },
  computed: {
    boxHeight() {
      return this.$refs.listRef.offsetHeight;
    },
    boxWrap() {
      return this.$refs.listRef;
    },
  },
  mounted() {
    this.itemHeight = this.boxHeight / (this.length * 2);
    this.startScroll();
  },
  methods: {
    // 鼠标移入停止滚动移出继续滚动
    setEvet() {
      this.$refs.box.onmouseenter = () => {
        this.timer && clearInterval(this.timer);
      };
      this.$refs.box.onmouseleave = () => {
        this.startScroll();
      };
    },
    // 滚动方法
    startScroll() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.height += this.itemHeight;
        this.transitionDuration = 500;
        if (this.height === this.boxHeight / 2) {
          setTimeout(() => {
            // this.height += this.itemHeight; // 这行多余
            this.transitionDuration = 0;
            this.height = 0
          }, 600)
        }
      }, 1500);
    },
    // 这个方法会出问题
    startScroll2() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.height === this.boxHeight / 2) {
          setTimeout(() => {
            this.transitionDuration = 0;
            this.height = 0
          }, 600)
        } else {
          this.height += this.itemHeight;
          this.transitionDuration = 500;
        }
      }, 1500);
    },
  },
};
</script>
    
<style lang="scss" scoped>
.listScroll {
  overflow: hidden;
}

.hover {
  overflow-y: auto;
}

.hide {
  display: none;
}
</style>