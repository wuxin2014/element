<template>
  <div class="listScroll" ref="box">
    <!-- 在vue中如何复制一份列表出来呢且不能丢失绑定的事件，很简单使用slot插槽，使用两个插槽我们就拥有了两个列表 -->
    <slot></slot>
    <slot></slot>
  </div>
</template>
  
<script>
export default {
  name: "SeamlessRolling2",
  mounted() {
    //在盒子内容高度小于可视高度时不滚动
    if (this.boxHeight < this.ele0.clientHeight) {
      this.start();
      this.setEvet();
    } else {
      this.isScroll = false;
    }
  },
  props: {
    speed: {
      default: 1,
      type: Number,
    },
  },
  computed: {
    //第一个slot
    ele0() {
      return this.$refs.box.children[0];
    },
    //第二个slot
    ele1() {
      return this.$refs.box.children[1];
    },
    //盒子的可视高度
    boxHeight() {
      return this.$refs.box.clientHeight;
    },
  },
  data() {
    return {
      height: 0,
      isScroll: true,
    };
  },
  methods: {
    //鼠标移入停止滚动 移出继续滚动
    setEvet() {
      this.$refs.box.onmouseenter = () => {
        this.isScroll = false;
        // this.height = 0;
      };
      this.$refs.box.onmouseleave = () => {
        this.isScroll = true;
        this.$nextTick(() => {
          this.start();
        });
      };
    },
    //滚动方法
    start() {
      this.ele0.style = `transform:translateY(-${this.height}px);`;
      this.ele1.style = `height:${this.boxHeight}px;transform:translateY(-${this.height}px);overflow: hidden;`;
      if (this.height >= this.ele0.clientHeight) {
        // this.height = 34;
        this.height = 0;
      } else {
        // this.height += 34
        this.height += this.speed
      }
      if (!this.isScroll) return;

      // setTimeout(() => {
      //   this.start();
      // }, 1500)
      window.requestAnimationFrame(() => {
        this.start();
      });
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