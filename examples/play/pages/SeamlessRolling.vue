<template>
  <div class="scroll">
    <list-scroll class="box" :speed="1" :length="list.length">
      <div class="list">
        <div class="item" v-for="item in list" :key="item.xh">
          <span>{{ item.xh }}-{{ item.label }}</span>
        </div>
        <div class="item" v-for="item in list" :key="`${item.xh}-copy`">
          <span>{{ item.xh }}-{{ item.label }}</span>
        </div>
      </div>
    </list-scroll>

    <!-- <list-scroll2 class="box" :speed="1" :length="list.length">
      <div class="list">
        <div class="item" v-for="item in list" :key="`${item.xh}`">
          <span>{{ item.xh }}-{{ item.label }}</span>
        </div>
      </div>
    </list-scroll2> -->

    <div style="height: 34px;overflow: hidden;">
      <div class="boxR" :style="{ transitionDuration: `${transitionDuration}ms`, transform: `translateY( ${translateHeight}px)`}">
        <div class="item" v-for="item in list" :key="`${item.xh}`">
          <span>{{ item.xh }}-{{ item.label }}</span>
        </div>
        <div class="item">
          <span>{{ list[0].xh }}-{{ list[0].label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
import ListScroll from "./components/SeamlessRolling";
import ListScroll2 from "./components/SeamlessRolling2";
export default {
  name: "scroll",
  components: {
    ListScroll,
    ListScroll2
  },
  data() {
    return {
      translateValue: 34, // 一个轮播项的高度
      translateHeight: 0, // 当前滚动高度
      transitionDuration: 500,
      list: new Array(10)
        .fill(1)
        .map((s, i) => ({ xh: i + 1, label: "hello wrold" })),
    };
  },

  mounted() {
    setInterval(() => {
      this.translateHeight -= this.translateValue
      this.transitionDuration = 500
      if(this.translateHeight === -this.translateValue * this.list.length) {
        setTimeout(() => {
          // this.translateX -= this.translateValue // 这行多余
          this.transitionDuration = 0
          this.translateHeight = 0
        }, 600)
      }
    }, 1500)
  }
};
</script>
    
<style lang="scss" scoped>
  .box {
    height: 34px;
    background-color: beige;
    margin-bottom: 30px;
  }

  .list {
    padding: 0 10px;
    width: 300px;
    .item {
      display: flex;
      padding: 5px 0;
      cursor: pointer;
      &:hover {
        background-color: #95a5a6;
      }
    }
  }

  .boxR div {
    width: 300px;
    height: 34px;
    background-color: aquamarine;
  }
</style>