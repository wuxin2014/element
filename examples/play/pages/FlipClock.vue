/*
 * 翻牌时钟
 * @author： 兔子先生
 * @createDate: 2019-11-24
 */
<template>
  <div>
    <div class="FlipClock">
      <Flipper ref="flipperHour1" />
      <Flipper ref="flipperHour2" />
      <em>:</em>
      <Flipper ref="flipperMinute1" />
      <Flipper ref="flipperMinute2" />
      <em>:</em>
      <Flipper ref="flipperSecond1" />
      <Flipper ref="flipperSecond2" />
    </div>
    <CollapseText id="1">
      闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
      闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
      闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
      闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
      闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
      闻笛声独惆怅,云深夜未央,是与非都过往,醒来了怎能当梦一场,红尘中毁誉得失如何去量,潇潇血热刀锋凉.
    </CollapseText>
  </div>
</template>

<script>
import Flipper from './components/Flipper.vue'
import CollapseText from './components/CollapseText.vue'

export default {
  name: 'FlipClock',
  components: {
    Flipper,
    CollapseText
  },
  data() {
    return {
      timer: null,
      flipObjs: [],
      textContent: ''
    }
  },
  mounted() {
    this.flipObjs = [
      this.$refs.flipperHour1,
      this.$refs.flipperHour2,
      this.$refs.flipperMinute1,
      this.$refs.flipperMinute2,
      this.$refs.flipperSecond1,
      this.$refs.flipperSecond2
    ]
    this.init()
    this.run()
  },
  methods: {
    // 初始化数字
    init() {
      let now = new Date()
      let nowTimeStr = this.formatDate(new Date(now.getTime()), 'hhiiss')
      for (let i = 0; i < this.flipObjs.length; i++) {
        this.flipObjs[i].setFront(nowTimeStr[i])
      }
    },
    // 开始计时
    run() {
      this.timer = setInterval(() => {
        // 获取当前时间
        let now = new Date()
        let nowTimeStr = this.formatDate(new Date(now.getTime() - 1000), 'hhiiss')
        let nextTimeStr = this.formatDate(now, 'hhiiss')
        for (let i = 0; i < this.flipObjs.length; i++) {
          if (nowTimeStr[i] === nextTimeStr[i]) {
            continue
          }
          this.flipObjs[i].flipDown(
            nowTimeStr[i],
            nextTimeStr[i]
          )
        }
      }, 1000)
    },
    // 正则格式化日期
    formatDate(date, dateFormat) {
      if (/(y+)/.test(dateFormat)) {
        dateFormat = dateFormat.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      // 格式化月、日、时、分、秒
      let o = {
        'm+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'i+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(dateFormat)) {
          // 取出对应的值
          let str = o[k] + ''
          /* 根据设置的格式，输出对应的字符
           * 例如: 早上8时，hh => 08，h => 8
           * 但是，当数字>=10时，无论格式为一位还是多位，不做截取，这是与年份格式化不一致的地方
           * 例如: 下午15时，hh => 15, h => 15
           */
          dateFormat = dateFormat.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : this.padLeftZero(str)
          )
        }
      }
      return dateFormat
    },
    // 日期时间补零
    padLeftZero(str) {
      return ('00' + str).substr(str.length)
    }
  },
}
</script>

<style>
.FlipClock {
  text-align: center;
}
.FlipClock .M-Flipper {
  margin: 0 3px;
}
.FlipClock em {
  display: inline-block;
  line-height: 102px;
  font-size: 66px;
  font-style: normal;
  vertical-align: top;
}
</style>
