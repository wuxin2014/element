<template>
  <el-input
    v-model="inputVal"
    :disabled="disabled"
    :placeholder="placeholder"
    @blur="handleBlur">
    <template slot="append">%</template>
  </el-input>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default:''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default:'请输入'
    }
  },
  data() {
    return {
      inputVal: ''
    }
  },
  watch: {
    value(newVal) {
      this.inputVal = newVal
    }
  },
  mounted() {
    this.inputVal = this.value
  },
  methods: {
    handleBlur() {
      if (!this.inputVal) {
        this.$emit('input', '')
        return
      }
      if (isNaN(Number(this.inputVal)) || this.inputVal<=0){
        this.inputVal = ''
        this.$Message.error('请输入大于0的数字')
        return
      }
      const arr = this.inputVal.split('.')
      // 以e*开头
      if (arr[0].length >= 2 && arr[0].index0f('0') === 0) {
        this.inputVal = ''
        this.$Message.error('请输入大于0的数字')
        return
      }

      if (arr.length === 2 && arr[1].length > 10) {
        this.inputVal = ''
        this.$Message.error('小数位最多保留10位小数')
        return
      }
      if (this.inputVal > 100) {
        this.inputVal = ''
        this.$Message.error('百分比不能超过100')
        return
      }
      this.$emit('input', this.inputVal)
    }
  }
}
</script>