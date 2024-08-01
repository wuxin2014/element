<template>
  <div>
    <div class="collapse-text-container">
      <CollapseText>
        闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
        闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
        闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
        闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
        闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
        闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
      </CollapseText>
    </div>
    <div class="list-container">
      <div ref="listRef" class="list" style="position: absolute; visibility: hidden;">
        <div v-for="(item, index) in list" :key="index" class="item" ref="itemRef">{{ item }}</div>
      </div>
      <div class="list">
        <div v-for="(item, index) in newList" :key="index" class="item">{{ item }}</div>
        <div v-if="newList.length > 0" class="expand-wrap" @click="handleExpand">展开</div>
      </div>
    </div>
  </div>
</template>

<script>
import CollapseText from './components/CollapseText.vue'

export default {
  components: {
    CollapseText
  },
  data() {
    return {
      list: ['闻笛声独惆怅', '笛声', '醒来了怎能当梦一场', '是与非都过往', '是非', '梦一场', '潇潇血热刀锋凉'],
      newList: [],
      isExpand: false,
      curIndex: -1
    }
  },
  mounted() {
    this.layout()
  },
  methods: {
    layout() {
      this.$nextTick(() => {
        const clientWidth = this.$refs.listRef.clientWidth;
        const offsetHeight = this.$refs.listRef.offsetHeight;
        // const offsetWidth = this.$refs.listRef.scrollWidth;
        if (offsetHeight > 42) {
          let widthSum = 0
          this.$refs.itemRef.forEach((element, index) => {
            widthSum += element.offsetWidth
            if (widthSum <= clientWidth - 60) {
              this.curIndex = index - 1
            }
          });
          this.newList = this.list.slice(0, this.curIndex + 1)
        }
      })
    },
    handleExpand() {
      if (this.isExpand) {
        this.newList = this.list.slice(0, this.curIndex + 1)
      } else {
        this.newList = this.list
      }
      this.isExpand = !this.isExpand
    }
  },
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.collapse-text-container {
  width: 600px;
  padding: 10px;
  background-color: aliceblue;
  border-radius: 8px;
  // box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}

.list-container {
  width: 400px;
  background-color: aliceblue;
  padding: 10px;
  height: 100%;
  margin-top: 30px;

  .list {
    width: 400px;
    height: 100%;
    overflow: hidden;
  }

  .item {
    height: 30px;
    padding: 0 10px;
    line-height: 30px;
    border: 1px solid pink;
    margin: 5px;
    border-radius: 30px;
    float: left;
  }

  .expand-wrap {
    float: right;
    width: 50px;
    height: 30px;
    margin: 5px;
    text-align: center;
    line-height: 30px;
    background: #3f51b5;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
