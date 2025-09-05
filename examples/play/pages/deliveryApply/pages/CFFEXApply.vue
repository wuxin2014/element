<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      size="small"
      label-position="top">
      <el-form-item
        label="交割类型"
        prop="deliveryType">
        <el-select
          v-model="form.deliveryType"
          disabled
          :popper-append-to-body="false"
          popper-class="custom_poper_class"
          style="width: 300px">
          <el-option
            v-for="item in deliveryTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <component
        ref="dynamicFormRef"
        :is="currentComponent"
        :baseInfo="baseInfo"
        :varietyTbInfo="varietyTbInfo"
        :isDetail="isDetail"
        :instInfo="instInfo">
      </component>
      <el-form-item
        label="备注"
        prop="remark">
        <el-input
          type="textarea"
          v-model="form.remarks"
          :disabled="isDetail" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import BuyerForm from '../components/CFFEX/BuyerForm.vue'
import SellerForm from '../components/CFFEX/SellerForm.vue'
import mixins from '../util/mixins'
export default {
  components: {
    BuyerForm,
    SellerForm
  },
  mixins: [mixins],
  data() {
    return {
      form: {
        deliveryType: 'B',
        remark: '',
        fileInfos: []
      },
      rules: {
        deliveryType: { required: true, message: '请选择', trigger: 'change' }
      },
      deliveryTypeList: [{ label: '国债', value: 'B' }]
    }
  },
  computed:{
    isBuyer() {
      return this.baseInfo.deliveryDirection === '0'
    },
    currentComponent() {
      return this.isBuyer ? 'BuyerForm' : 'SellerForm'
    },
    // 交割品种选择变化时车船版类型的值
    deliveryOfVehicleAndShipPlates() {
      return this.varietyTbInfo.delivery_of_vehicle_and_ship_plates
    },
  },
  watch:{
    'baseInfo.deliveryDirection'() {
      this.form = {
        deliveryType: 'B',
        remark: '',
        fileInfos: []
      }
    }
  },
  mounted() {
    if (this.$route.query.missionCode) {
      this.setFieldValue()
    }
  },
  methods: {
    getFormDetailInfo() {
      const { zjsDeliverInformation } = this.detailInfo || {}
      return this.isBuyer ? (zjsDeliverInformation?.zjsBuyerDeliveryInformation || {}) :(zjsDeliverInformation?.zjsSellerDeliveryInformation || {})
    },
    setFieldValue(){
      const { zjsDeliverInformation, fileInfos } = this.detailInfo || {}
      if (this.isBuyer) {
        this.form.remarks = zjsDeliverInformation.zjsBuyerDeliveryInformation.remarks || ''
      } else {
        this.form.remarks = zjsDeliverInformation.zjsSellerDeliveryInformation.remarks || ''
      }
      this.form.fileInfos = fileInfos?.filter(item => item.fileAttribute === 'F00150') || []
    },
    getFormData() {
      const result = this.$refs.dynamicFormRef.getFormData()
      const paramsData = { ...result,remarks: this.form.remarks }
      const zjsDeliverInformation ={}
      if (this.isBuyer) {
        zjsDeliverInformation.zjsBuyerDeliveryInformation = paramsData
      } else {
        zjsDeliverInformation.zjsSellerDeliveryInformation = paramsData
      }
      return {
        deliveryType: this.form.deliveryType,
        zjsDeliverInformation,
        deliveryQuantity: result.deliveryQuantity,
        payment: result.payment
      }
    },
    resetForm() {
      this.$refs.formRef.resetFields()
      this.$refs.dynamicFormRef.resetForm()
    },
    async validateForm(callback) {
      try {
        const promise1 = this.$refs.formRef.validate()
        const promise2 = this.$refs.dynamicFormRef && this.$refs.dynamicFormRef.validateForm()
        await promise1
        const valid = await promise2
        const params = this.getFormData()
        valid ? callback(params): callback()
      } catch (error) {
        console.log('=error=',error)
        callback()
      }
    }
  }
}
</script>