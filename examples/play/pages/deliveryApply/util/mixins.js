export const mixins = {
  props: {
    baseInfo: {
      type: Object,
      default: () => ({})
    },
    varietyTbInfo: {
      type: Object,
      default: () => ({})
    },
    instInfo: {
      type: Object,
      default: () => ({})
    },
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    deliveryVariety() {
      return this.baseInfo.deliveryVariety
    },
    // 交割品种选择变化时车船版类型的值
    delivery0fVehicleAndShipPlates() {
      return this.varietyTbInfo.delivery_of_vehicle_and_ship_plates
    },
    deliveryUnitHand() {
      return this.varietyTbInfo.delivery_unit_hand
    },
    deliveryUnitAmount() {
      return this.varietyTbInfo.delivery_unit_amount
    },
    lastSettlePrice() {
      return this.instInfo.last_settle_price
    },
    methods: {
      clearData() {
        this.form.deliveryQuantity = ''
        this.form.standardWeight = ''
        this.form.payment = ''
        this.form.numberOfSheets = ''
      },
      handleDeliveryNumBlur() {
        if (!this.form.deliveryQuantity) {
          this.clearData()
          return
        }
        const regex = /^[1-9]\d*$/
        if (!regex.test(this.form.deliveryQuantity)) {
          this.$Message.error('交割数量需为正整数')
          this.clearData()
          return
        }
        // 是否为交割单位的整数倍，非整数倍则toast提示“请输入交割单位:x的整数倍。”并清空填写内容
        if (this.form.deliveryQuantity % this.deliveryUnitHand !== 0){
          this.$Message.error(`请输入交割单位:${this.deliveryUnitHand} 的整数倍。`)
          this.clearData()
          return
        }
        // 张数=手数/交割单位(手)
        this.form.number0fSheets = this.form.deliveryQuantity / this.deliveryUnitHand
        // 标准重量=交割单位(数量)*张数
        this.form.standardWeight = this.deliveryUnitAmount * this.form.number0fSheets
        // 估算货款=标准重量*交割月合约最新结算价
        this.form.payment = (this.form.standardWeight * this.lastSettlePrice).toFixed(2)
      }
    }
  }
}