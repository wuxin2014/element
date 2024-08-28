<template>
  <el-form label-width="100px">
    <el-form-item label="金额：">
      <el-input v-model="moneyValue" @input="handleMoneyInput" style="width: 200px"/>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      moneyValue: ''
    }
  },
  methods: {
    // 金额输入框 数字保留两位小数
    handleMoneyInput(value) {
      if (!value) return

      if (isNaN(Number(value))) {
        this.moneyValue = ''
        return
      }

      const partArr = value.split('.')
      // 验证以0*开头
      if (partArr[0].indexOf('0') === 0 && partArr[0].length >= 2) {
        this.moneyValue = value.substring(1)
        return
      }

      // 验证小数点只能是两位
      if (partArr.length === 2 && partArr[1].length > 2) {
        // 小数点仅保留两位
        this.moneyValue = partArr[0] + '.' + partArr[1].substring(0, 2);
        this.$message.error('仅支持小数点后两位')
        return
      }
    }
  }
}
</script>

<style>
</style>