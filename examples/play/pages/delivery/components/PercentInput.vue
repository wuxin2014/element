<template>
  <el-input v-model="inputVal" :disabled="disabled" placeholder="请输入">
    <template slot="append">%</template>
  </el-input>
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
      inputVal: '',
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.inputVal = newVal
      }
    }
  },
  mounted() {
    this.inputVal = value
  },
  methods: {
    handleBlur() {
      if (!this.inputVal) return
      console.log('00.1' < 0)
      if (isNaN(Number(this.inputVal)) || this.inputVal < 0) {
        this.inputVal = ''
        this.$message.error('请输入数字')
        return
      }
      const arr = this.inputVal.split('.')
      // 以0*开头
      if (arr[0].length >= 2 && arr[0].indexOf('0') === 0) {
        this.inputVal = ''
        this.$message.error('请输入数字')
        return
      }
      if (arr.length === 2 && arr[1].length > 10) {
        this.inputVal = ''
        this.$message.error('小数位最多保留10位小数')
        return
      }

      if (this.inputVal > 100) {
        this.inputVal = ''
        this.$message.error('百分比不能大于100')
        return
      }
      this.$emit('input', this.inputVal)
    }
  }
}
</script>