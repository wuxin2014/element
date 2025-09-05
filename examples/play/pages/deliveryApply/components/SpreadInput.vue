<template>
  <div class="spread-input-wrap">
    <el-input v-model="leftVal" :disabled="disabled" placeholder="开始升贴水" @blur="handleBlur('leftVal')" />
    <span class="separetor">-</span>
    <el-input v-model="rightVal" :disabled="disabled" placeholder="结束升贴水" @blur="handleBlur('rightVal')" />
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      leftVal: '',
      rightVal: ''
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.initData()
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.value) {
        const arr = this.value.split('-')
        if (arr.length === 2) {
          this.leftVal = arr[0]
          this.rightVal = arr[1]
        }
      } else {
        this.leftVal = ''
        this.rightVal = ''
      }
    },
    handleBlur(field) {
      if (!this[field]) {
        if (!this.leftVal && !this.rightVal) {
          this.$emit('input','')
        } else {
          this.$emit('input',`${this.leftVal}-${this.rightVal}`)
        }
        return
      }
      // 需要为正数
      if (isNaN(Number(this[field])) || this[field] <= 0) {
        this[field] = ''
        this.$message.error('请输入正数')
        return
      }
      const arr = this[field].split('.')
      // 以0开头
      if (arr[0].length >= 2 && arr[0].index0f('0') === 0) {
        this[field] = ''
        this.$message.error('请输入正数')
        return
      }
      if (arr.length === 2 && arr[1].length > 4) {
        this[field] = ''
        this.$message.error('小数位最多保留4位小数')
        return
      }
      if (this.leftVal && this.rightVal) {
        if (Number(this.leftVal) >= Number(this.rightVal)) {
          this[field] = ''
          this.$message.error('开始升贴水应该小于结束升贴水')
          return
        }
        this.$emit('input', `${this.leftVal}-${this.rightVal}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.spread-input-wrap {
  display: flex;
  align-items: center;
  .separetor {
    padding: 0 20px;
  }
}
</style>