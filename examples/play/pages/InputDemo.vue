<template>
  <el-form label-width="100px">
    <el-form-item label="金额：">
      <el-input v-model.trim="moneyValue" @input="handleMoneyInput" @blur="handleBlur" style="width: 200px"/>
    </el-form-item>
    <el-form-item label="数字：">
      <el-input-number v-model="num" :controls="false" style="width: 200px"></el-input-number>
    </el-form-item>
    <el-button @click="handleClick">提交</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      moneyValue: '',
      num: ''
    }
  },
  methods: {
    // 金额输入框 数字保留两位小数
    handleMoneyInput(value) {
      if (!value) return
      console.log('===', value)
      if (isNaN(Number(value))) {
        this.moneyValue = ''
        this.$message.error('请输入数字')
        return
      }

      const partArr = value.split('.')
      // // 以小数点开头
      // if (partArr[0].length === 0) {
      //   this.moneyValue = '0' + value
      //   return
      // }
      // 以0*开头
      if (partArr[0].indexOf('0') === 0 && partArr[0].length >= 2) {
        this.moneyValue = '' + Number(value)
        return
      }
      // 小数点只能保留两位
      if (partArr.length === 2 && partArr[1].length > 2) {
        this.moneyValue = partArr[0] + '.' + partArr[1].substring(0, 2);
        this.$message.error('仅支持小数点后两位')
        return
      }
    },
    handleBlur() {
      if (!this.moneyValue) return
      this.moneyValue = '' + Number(this.moneyValue)
    },
    handleClick() {
      console.log('==handleClick==', this.moneyValue)
    }
  }
}
</script>

<style>
</style>