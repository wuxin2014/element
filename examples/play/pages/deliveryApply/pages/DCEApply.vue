<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      size="small"
      label-position="top">
      <BuyerScrollYForm
        v-if="currentComponent === 'BuyerScrollYForm'"
        ref="dynamicFormRef"
        :baseInfo="baseInfo"
        :varietyTbInfo="varietyTbInfo"
        :instInfo="instInfo"
        :isDetail="isDetail">
      </BuyerScrollYForm>
      <template v-else>
        <el-form-item
          label="交割类型"
          prop="deliveryType"
          :rules="{ required: true, message: '请选择', trigger: 'change' }">
          <el-select
            v-model="form.deliveryType"
            multiple
            :disabled="isDetail || !isScrollDelivery"
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
import BuyerScrollYForm from '../components/DCE/BuyerScrollYForm.vue'
import BuyerScrollNForm from '../components/DCE/BuyerScrollNForm.vue'
import BuyerFocusForm from '../components/DCE/BuyerFocusForm.vue'
import SellerScrollForm from '../components/DCE/SellerScrollForm.vue'
import SellerFocusForm from '../components/DCE/SellerFocusForm.vue'
export default {
  components: {
    BuyerScrollYForm,
    BuyerScrollNForm,
    BuyerFocusForm,
    SellerScrollForm,
    SellerFocusForm
  },
  mixins: [mixins],
  data() {
    return {
      form: {
        deliveryType: [],
        remark: '',
        fileInfos: []
      },
      rules: {},
      deliveryTypeList: []
    }
  },
  computed: {
    isBuyer() {
      return this.baseInfo.deliveryDirection === '0'
    },
    // 滚动交割
    isScrollDelivery() {
      // deliveryTime: 0-滚动交割, 1-集中交割
      return this.baseInfo.deliveryTime === '0'
    },
    // 交割品种选择变化时车船版类型的值
    deliveryOfVehicleAndShipPlates() {
      return this.varietyTbInfo.delivery_of_vehicle_and_ship_plates
    },
    currentComponent() {
      if (this.isBuyer) {
        return this.isScrollDelivery ? (this.deliveryOfVehicleAndShipPlates === 'Y' ? 'BuyerScrollYForm' : 'BuyerScrollNForm') : 'BuyerFocusForm'
      } else {
        return this.isScrollDelivery ? 'SellerScrollForm' : 'SellerFocusForm'
      }
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
    validateDeliveryType() {
      return new Promise((resolve) => {
        this.$refs.formRef.validateField('deliveryType', (res) => {
          resolve(!res)
        })
      })
    },
    getFormDetailInfo() {
      const { dssDeliverInformation, deliveryTime } = this.detailInfo || {}
      // 大商所交割时间-单选
      if (deliveryTime[0] !== this.baseInfo.deliveryTime) return {}
      return this.isBuyer ? (dssDeliverInformation?.dssBuyerDeliveryInformation || {}) : (dssDeliverInformation?.dssSellerDeliveryInformation || {})
    },
    setFieldValue() {
      const { dssDeliverInformation,deliveryType, fileInfos } = this.detailInfo || {}
      this.form.deliveryType = deliveryType || []
      if (this.isBuyer) {
        this.form.remarks = dssDeliverInformation.dssBuyerDeliveryInformation.remarks || ''
      } else {
        this.form.remarks = dssDeliverInformation.dssSellerDeliveryInformation.remarks || ''
      }
      this.form.fileInfos = fileInfos?.filter(item => item.fileAttribute === 'F00150') || []
    },
    initDeliveryType() {
      if (this.isScrollDelivery) {
        // 滚动交割
        this.form.deliveryType = this.deliveryOfVehicleAndShipPlates === 'N' ? ['A'] : []
      } else {
        this.form.deliveryType = ['A']
      }
    },
    handleDeliveryTypeChange() {
      if (this.form.deliveryType.includes('C' )) {
        // 集中交割-车(船)板交割
        if (!this.isScrollDelivery && this.delivery0fVehicleAndShipPlates === 'Y') {
          this.$Message.error('该品种车(船)板交割仅针对滚动交割。')
          this.form.deliveryType = this.form.deliveryType.filter(v => v !== 'C')
          return
        }
        if (this.isScrollDelivery && this.delivery0fVehicleAndShipPlates === 'N') {
          this.$Message.error('该品种无车(船)板交割。')
          this.form.deliveryType = this.form.deliveryType.filter(v => v !=='C')
          return
        }
        // 鸡蛋品种选择车(船)板-卖出-滚动交割
        if (!this.isBuyer && this.isScrollDelivery && this.baseInfo.deliveryVariety === 'jd') {
          this.$MessageBox.confirm('请确认已申请大商所车板交割资格。', '提示', {
            confirmButtonText: '进行资质报备',
            cancelButtonText: '继续交割申请',
            customClass: 'online-web-confirm-box',
            confirmButtonClass: 'space-margin-left',
            showClose: false,
            closeOnClickModal:false,
            closeOnPressEscape: false
          }).then(() => {
            // todo
          }).catch(() => {
            this.clearSellerScrollVehicleYData()
          })
          return
        }
        this.clearSellerScrollVehicleYData()
      }
      this.clearSellerScrol1VehicleYData()
    },
    getFormData() {
      const result = this.$refs.dynamicFormRef.getFormData()
      const paramsData = { ...result, remarks: this.form.remarks }
      const dssDeliverInformation = {}
      if (this.isBuyer) {
        dssDeliverInformation.dssBuyerDeliveryInformation = paramsData
      } else {
        dssDeliverInformation.dssSellerDeliveryInformation = paramsData
      }
      return {
        deliveryType: this.form.deliveryType,
        dssDeliverInformation,
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