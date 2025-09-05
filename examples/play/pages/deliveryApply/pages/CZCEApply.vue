<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-position="top">
      <BuyerFocusForm
        v-if="currentComponent === 'BuyerFocusForm'"
        ref="dynamicFormRef"
        :baseInfo="baseInfo"
        :varietyTbInfo="varietyTbInfo"
        :isDetail="isDetail"
        :instInfo="instInfo"
        :deliveryWhList="deliveryWhList">
      </BuyerFocusForm>
      <template v-else>
        <el-form-item
          label="交割类型"
          prop="deliveryType"
          :rules="{ required: true, message: '请选择', trigger: 'change' }">
          <el-select
            v-model="form.deliveryType"
            :disabled="isDetail"
            :popper-append-to-body="false"
            popper-class="custom_poper_class"
            style="width: 300px"
            @change="handleDeliveryTypeChange">
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
      </template>
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
import mixins from '../util/mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      form: {
        deliveryType: '',
        remark: '',
        fileInfos: []
      },
      rules: {},
      deliveryTypeList: []
    }
  },
  computed:{
    isBuyer() {
      return this.baseInfo.deliveryDirection === '0'
    },
    currentComponent() {
      if (this.baseInfo.deliveryTime === '1') {
        // 集中交割
        return this.isBuyer? 'BuyerFocusForm' : 'SellerFocusForm'
      } else {
        return this.isBuyer ? 'BuyerScrollForm' : 'SellerScrollForm'
      }
    },
    // 交割品种选择变化时车船版类型的值
    delivery0fVehicleAndShipPlates() {
      return this.varietyTbInfo.delivery_of_vehicle_and_ship_plates
    },
  },
  watch:{
    'baseInfo.deliveryDirection'() {
      this.initDeliveryType()
    }
  },
  mounted() {
    if (this.$route.query.missionCode) {
      this.setFieldValue()
    } else {
      this.initDeliveryType()
    }
  },
  methods: {
    getFormDetailInfo() {
      const { gqsDeliverInformation, deliveryTime} = this.detailInfo || {}
      // 广期所交割时间-单选
      if (deliveryTime[0] !== this.baseInfo.deliveryTime) return {}
      return this.isBuyer ? (gqsDeliverInformation?.gqsSBuyerDeliveryInformation || {}) :(gqsDeliverInformation?.gqsSellerDeliveryInformation || {})
    },
    setFieldValue(){
      const { gqsDeliverInformation, deliveryType, fileInfos} = this.detailInfo || {}
      if (this.isBuyer) {
        this.form.deliveryType = deliveryType || []
        this.form.remarks = gqsDeliverInformation.gqsSBuyerDeliveryInformation.remarks || ''
      } else {
        this.form.deliveryType = deliveryType[0] || ''
        this.form.remarks = gqsDeliverInformation.gqsSellerDeliveryInformation.remarks || ''
      }
      this.form.fileInfos = fileInfos?.filter(item => item.fileAttribute === 'F00150') || []
    },
    initDeliveryType() {
      if (this.isBuyer) {
        this.form.deliveryType = this.deliveryOfVehicleAndShipPlates === 'N' ? ['A'] : []
      } else {
        this.form.deliveryType = this.deliveryOfVehicleAndShipPlates === 'N' ? 'A': ''
      }
    },
    handleDeliveryTypeChange() {
      if (this.deliveryOfVehicleAndShipPlates === 'N' && this.form.deliveryType?.includes('C')) {
        this.$Message.error('该品种无车(船)板交割。')
        if (this.isBuyer) {
          this.form.deliveryType = this.form.deliveryType.filter(v => v !== 'C')
        } else {
          this.form.deliveryType = 'A'
        }
      }
    },
    getFormData() {
      const result = this.$refs.dynamicFormRef.getFormData()
      const paramsData = { ...result,remarks: this.form.remarks }
      const gqsDeliverInformation ={}
      if (this.isBuyer) {
        gqsDeliverInformation.gqsSBuyerDeliveryInformation = paramsData
      } else {
        gqsDeliverInformation.gqsSellerDeliveryInformation = paramsData
      }
      return {
        deliveryType: this.form.deliveryType,
        gqsDeliverInformation,
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