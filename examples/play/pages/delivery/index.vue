<template>
  <div>
    <BuyerFocusForm ref="formRef" />
    <div>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import WHSellerForm from './components/CZCE/WHSellerForm.vue'
import BuyerFocusForm from './components/CZCE/BuyerFocusForm.vue'
export default {
  data() {
    return {
      searchForm: {
        exchange: '',
        transCode: '',
        deliveryVariety: '',
        deliveryContract: '',
        deliveryDirection: '',
        deliveryTime: ''
      },
      varietyTbInfo: {},
      instInfo: {},
      detailInfo: {}
    }
  },
  components: {
    WHSellerForm,
    BuyerFocusForm
  },
  provide() {
    return {
      baseInfo: this.searchForm,
      getVarietyTbInfo: () => this.varietyTbInfo, // 没有明确定义内部字段的，需使用函数形式，数据才可响应
      getInstInfo: () => this.instInfo,
      detailInfo: this.detailInfo
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.formRef.validateForm(() => {
        
      })
    }
  }
}
</script>