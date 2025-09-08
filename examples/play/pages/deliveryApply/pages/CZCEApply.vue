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
import BuyerFocusForm from '../components/CZCE/BuyerFocusForm.vue'
import WarehouseBuyerForm from '../components/CZCE/WarehouseBuyerForm.vue'
import WarehouseSellerNCForm from '../components/CZCE/WarehouseSellerNCForm.vue'
import WarehouseSellerCForm from '../components/CZCE/WarehouseSellerCForm.vue'
import VehicleBuyerAPForm from '../components/CZCE/VehicleBuyerAPForm.vue'
import VehicleBuyerScrollZCForm from '../components/CZCE/VehicleBuyerScrollZCForm.vue'
import VehicleSellerZCForm from '../components/CZCE/VehicleSellerZCForm.vue'
import VehicleBuyerScrollPKForm from '../components/CZCE/VehicleBuyerScrollPKForm.vue'
import VehicleSellerPKForm from '../components/CZCE/VehicleSellerPKForm.vue'
import VehicleBuyerScrollCJForm from '../components/CZCE/VehicleBuyerScrollCJForm.vue'
import VehicleSellerCJForm from '../components/CZCE/VehicleSellerCJForm.vue'
const sheet1 = []
export default {
  components: {
    BuyerFocusForm,
    WarehouseBuyerForm,
    WarehouseSellerCForm,
    WarehouseSellerNCForm,
    VehicleBuyerAPForm,
    VehicleSellerZCForm,
    VehicleSellerCJForm,
    VehicleSellerPKForm,
    VehicleBuyerScrollZCForm,
    VehicleBuyerScrollCJForm,
    VehicleBuyerScrollPKForm,
  },
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
    isScrollDelivery() {
      return this.baseInfo.deliveryTime.includes('0')
    },
    // 交割品种选择变化时车船版类型的值
    deliveryOfVehicleAndShipPlates() {
      return this.varietyTbInfo.delivery_of_vehicle_and_ship_plates
    },
    generalOrNot() {
      return this.varietyTbInfo.general_or_not
    },
    currentComponent() {
      console.log(sheet1.includes(this.baseInfo.deliveryVariety))
      if (this.form.deliveryType === 'A') {
        // 所有品种-买入-滚动交割/部分品种(附件表格sheet1外的其他品种)-买入-集中交割-仓单
        if (this.isBuyer && (this.isScrollDelivery || (!sheet1.includes(this.baseInfo.deliveryVariety) && !this.isScrollDelivery))) {
          console.log('仓单===所有品种-买入-滚动交割/部分品种〈附件表格sheet1外的其他品种)-买入-集中交割')
          return 'WarehouseBuyerForm'
        }
        // 非通用品种-卖出-仓单
        if (this.generalOrNot === '0' && !this.isBuyer) {
          console.log('仓单===非通用品种-卖出')
          return 'WarehouseSellerNCForm'
        }
        // 通用品种-卖出-仓单
        if (this.generalOrNot === '1' && !this.isBuyer) {
          console.log('仓单===通用品种-卖出')
          return 'WarehouseSellerCForm'
        }
      }

      if (this.form.deliveryType === 'C') {
        if (this.baseInfo.deliveryVariety === 'AP' && ((this.isBuyer && this.isScrollDelivery) || !this.isBuyer)) {
          console.log('车船板=-=AP-买入-滚动交割或卖出-集中/滚动交割')
          return 'VehicleBuyerAPForm'
        }
        if (this.baseInfo.deliveryVariety === 'ZC' && this.isBuyer && this.isScrollDelivery) {
          console.log('车船板===ZC-买入-滚动交割')
          return 'VehicleBuyerScrollZCForm'
        }
        if (this.baseInfo.deliveryVariety=== 'ZC' && !this.isBuyer) {
          console.log('车船板===ZC-卖出-集中/滚动交割')
          return 'VehicleSellerZCForm'
        }
        if (this.baseInfo.deliveryVariety === 'PK' && this.isBuyer && this.isScrollDelivery) {
          console.log('车船板=-=PK-买入-滚动交割')
          return 'VehicleBuyerScrollPKForm'
        }
        if (this.baseInfo.deliveryVariety === 'PK' && !this.isBuyer) {
          console.log('车船板--=PK-卖出-集中/滚动交割')
          return 'VehicleSellerPKForm'
        }
        if (this.baseInfo.deliveryVariety === 'CJ' && this.isBuyer && this.isScrollDelivery) {
          console.log('车船板===CJ-买入-滚动交割')
          return 'VehicleBuyerScrollCJForm'
        }
        if (this.baseInfo.deliveryVariety === 'CJ' && !this.isBuyer) {
          console.log('车船板===CJ-卖出-集中/滚动交割')
          return 'VehicleSellerCJForm'
        }
        // 油菜籽、普麦、强麦(买入-滚动交割或卖出-集中/滚动交割)
        if (['RS','PM', 'WH'].includes(this.baseInfo.deliveryVariety) && ((this.isBuyer && this.isScrollDelivery) || !this.isBuyer)) {
          console.log('车船板==-油菜籽、普麦、强麦(买入-滚动交割或卖出-集中/滚动交割)')
          return null
        }
      }

      if (sheet1.includes(this.baseInfo.deliveryVariety) && this.isBuyer && !this.isScrollDelivery) {
        console.log('部分品种(sheet1中品种非通用品种+PM/PK)-买入-集中交割')
        return 'BuyerFocusForm'
      }
      return null
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
      const { czceDeliverInformation, deliveryTime } = this.detailInfo || {}
      const baseDT = this.baseInfo.deliveryTime
      console.log('==baseDT==', baseDT,deliveryTime)
      if ((Array.isArray(baseDT) && baseDT.sort().join( ',') !== deliveryTime.sort().join(',')) || (typeof baseDT === 'string' && baseDT !== deliveryTime[0])) {
        return {}
      }
      return this.isBuyer ? (czceDeliverInformation?.czceBuyerDeliveryInformation || {}) :(czceDeliverInformation?.czceSellerDeliveryInformation || {})
    },
    setFieldValue() {
      const { czceDeliverInformation, deliveryType, fileInfos} = this.detailInfo || {}
      if (this.isBuyer) {
        this.form.deliveryType = deliveryType || []
        this.form.remarks = czceDeliverInformation.czceBuyerDeliveryInformation.remarks || ''
      } else {
        this.form.deliveryType = deliveryType[0] || ''
        this.form.remarks = czceDeliverInformation.czceSellerDeliveryInformation.remarks || ''
      }
      this.form.fileInfos = fileInfos?.filter(item => item.fileAttribute === 'F00150') || []
    },
    initDeliveryType() {
      this.form.deliveryType = this.deliveryOfVehicleAndShipPlates === 'N' ? 'A': ''
    },
    handleDeliveryTypeChange() {
      if (this.form.deliveryType === 'C') {
        if (this.deliveryOfVehicleAndShipPlates === 'N') {
          this.form.deliveryType = 'A'
          this.$Message.error('该品种无车(船)板交割。')
          return
        }
        if (['RS','PM','WH'].includes(this.baseInfo.deliveryVariety) && ((this.isBuyer && this.isScrollDelivery) || !this.isBuyer)) {
          console.log('车船板===油菜籽、普麦、强麦(买入-滚动交割或卖出-集中/滚动交割)')
          this.$MessageBox.alert('该品种暂不支持线上车船板交割申请,可联系期货服务人员获取申请表单。', '提示', {
            confirmButtonText: '确认',
            showClose: false,
            customClass:'online-web-confirm-box',
            confirmButtonClass:'space-margin-left'
          }).then(() => {
            this .$parent.clearVarietyData()
          })
          return
        }
      }
    },
    getFormData() {
      const result = this.$refs.dynamicFormRef.getFormData()
      const paramsData = { ...result,remarks: this.form.remarks }
      const czceDeliverInformation = {}
      if (this.isBuyer) {
        czceDeliverInformation.czceBuyerDeliveryInformation = paramsData
      } else {
        czceDeliverInformation.czceSellerDeliveryInformation = paramsData
      }
      return {
        deliveryType: this.form.deliveryType,
        czceDeliverInformation,
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