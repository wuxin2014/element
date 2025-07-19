<template>
  <div class="form-container">
    <el-form ref="formRef" :model="form" size="small" label-position="top">
      <el-row :gutter="48" style="display: flex; flex-wrap: wrap;">
        <el-col :span="8">
          <el-form-item label="交割数量" prop="deliveryNumber">
            <el-input v-model="form.deliveryNumber">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标准重量" prop="standardWeight">
            <el-input v-model="form.standardWeight" disabled>
              <template slot="append">{{ varietyTbInfo.weight_unit || '吨' }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="payment">
            <div slot="label">估算货款<span style="color: red; font-size:12px">(按标准重量及交割月合约最新结算价计算)</span></div>
            <el-input v-model="form.payment" disabled>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-for="(fItem, index) in form.list" :key="fItem.uuid">
        <div class="columnTitle">
          {{ index === 0 ? '第一意向' : index === 1 ? '第二意向' : '第三意向' }}
          <el-button v-if="index === 0 && !isDetail" type="primary" size="mini" style="margin-left:20px"
            @click="handleAdd">新增</el-button>
          <el-button v-if="index > 0 && !isDetail" size="mini" style="margin-left:20px"
            @click="handleRemove(fItem)">删除</el-button>
        </div>
        <el-row :gutter="48">
          <el-col :span="8">
            <el-form-item label="交割类型" :prop="'list.' + index + '.delivery_type'"
              :rules="{ required: true, message: '请选择交割类型', trigger: 'change' }">
              <el-select v-model="fItem.delivery_type" :disabled="isDetail || deliveryOfVehicleAndShipPlates === 'N'"
                :popper-append-to-body="false" popper-class="custom_poper_class" style="width: 100%"
                @change="handleDeliveryTypeChange(fItem)">
                <el-option v-for="item in deliveryTypeList" :key="item.code" :label="item.text" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="48">
          <el-col v-for="colItem in fItem.formItems" :key="colItem.prop" :span="8">
            <el-form-item :label="colItem.label" :prop="colItem.prop">
              <div slot="label" v-if="colItem.type === 'spread-input'">
                {{ colItem.label }}
                <span style="color: red; font-size: 12px">(请填写闭区间)</span>
              </div>
              <el-select v-if="colItem.type === 'select'" v-model="fItem[colItem.prop]"
                :multiple="colItem.multiple || false" :disabled="isDetail" :popper-append-to-body="false"
                popper-class="custom_poper_class" style="width:100%">
                <el-option v-for="item in dynamicOptions[colItem.prop]" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <spread-input v-else-if="colItem.type === 'spread-input'" v-model="fItem[colItem.prop]"
                :disabled="isDetail" style="width: 100%">
              </spread-input>
              <el-input v-else-if="colItem.type === 'input'" v-model="fItem[colItem.prop]" :disabled="isDetail"
                placeholder="请输入" style="width: 100%">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import SpreadInput from './SpreadInput.vue'
let uuid = 1
export default {
  props: {
    isDetail: {
      type: Boolean,
      default: false
    },
    baseInfo: {
      type: Object,
      default: () => ({})
    },
    varietyTbInfo: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    SpreadInput
  },
  data() {
    return {
      form: {
        deliveryNumber: '',
        payment: '',
        standardWeight: '',
        list: []
      },
      deliveryTypeList: [
        { text: '标准仓单', code: 'A' },
        { text: '车(船)板', code: 'C' }
      ],
      dynamicOptions: {
        store_house: [],
        tax: ['保税', '完税'],
        vehicle_ship_plate: []
      }
    }
  },
  computed: {
    // 交割品种选择变化时车船版类型的值
    deliveryOfVehicleAndShipPlates() {
      return this.varietyTbInfo.delivery_of_vehicle_and_ship_plates
    },
    varietyCode() {
      return this.baseInfo.variety_code || 'AP'
    }
  },
  mounted() {
    this.handleAdd()
  },
  methods: {
    handleDeliveryTypeChange(fItem) {
      let formItems = []
      if (fItem.delivery_type === 'A') {
        if (['AP', 'CJ', 'JR', 'ZC', 'RS'].includes(this.varietyCode)) {
          // 仓库,等级,类别
          formItems = [
            { prop: 'store_house', label: '仓库', type: 'select', multiple: true },
            { prop: 'grade', label: '等级', type: 'input' },
            { prop: 'category', label: '类别', type: 'input' }
          ]
        } else if (['FG'].includes(this.varietyCode)) {
          // 仓库,产地
          formItems = [
            { prop: 'store_house', label: '仓库', type: 'select', multiple: true, },
            { prop: 'product_place', label: '产地', type: 'input' }
          ]
        } else if (['MA'].includes(this.varietyCode)) {
          // 仓库,保税,等级
          formItems = [
            { prop: 'store_house', label: '仓库', type: 'select', multiple: true },
            { prop: 'tax', label: '保税', type: 'select', },
            { prop: 'grade', label: '等级', type: 'input' },
            { prop: 'address', label: '提货地点', type: 'input' }
          ]
        } else if (['CF'].includes(this.varietyCode)) {
          // 仓库,等级,类别,年度,产地,升贴水
          formItems = [
            { prop: 'store_house', label: '仓库', type: 'select', multiple: true },
            { prop: 'grade', label: '等级', type: 'input' },
            { prop: 'category', label: '类别', type: 'input' },
            { prop: 'year', label: '年度', type: 'input' },
            { prop: 'product_place', label: '产地', type: 'input' },
            { prop: 'spread', label: '升贴水', type: 'spread-input' }
          ]
        } else if (['CY'].includes(this.varietyCode)) {
          // 仓库,类别
          formItems = [
            { prop: 'store_house', label: '仓库', type: 'select', multiple: true },
            { prop: 'category', label: '类别', type: 'input' }]
        } else if (['PM'].includes(this.varietyCode)) {
          // 等级
          formItems = [
            { prop: 'grade', label: '等级', type: 'input' }
          ]
        } else if (['PM'].includes(this.varietyCode)) {
          // 等级
          formItems = [
            { prop: 'grade', label: '等级', type: 'input' }
          ]
        } else if (['SF', 'SM'].includes(this.varietyCode)) {
          //仓库
          formItems = [
            { prop: 'store_house', label: '仓库', type: 'select', multiple: true }
          ]
        } else if (['UR'].includes(this.varietyCode)) {
          // 仓库,等级
          formItems = [
            { prop: 'store_house', label: '仓库', type: 'select', multiple: true },
            { prop: 'grade', label: '等级', type: 'input' },
            { prop: 'address', label: '提货地点', type: 'input' }
          ]
        } else if (['SH'].includes(this.varietyCode)) {
          // 仓库,交割服务机构,类别
          formItems = [
            { prop: 'store_house', label: '仓库', type: 'select', multiple: true },
            { prop: 'address', label: '提货地点', type: 'input' },
            { prop: 'category', label: "类别", type: 'input' }
          ]
        } else if (['SR'].includes(this.varietyCode)) {
          // 仓库,品牌,等级,年度
          formItems = [
            { prop: 'store_house', label: '仓库', type: 'select', multiple: true },
            { prop: 'brand', label: '品牌', type: 'input' },
            { prop: 'grade', label: '等级', type: 'input' },
            { prop: 'year', label: '年度', type: 'input' }
          ]
        }
      } else {
        if (['AP', 'PK'].includes(this.varietyCode)) {
          // 交割服务机构,类别
          formItems = [
            { prop: 'vehicle_ship_plate', label: '交割服务机构', type: 'select', multiple: true },
            { prop: 'category', label: '类别', type: 'input' }
          ]
        } else if (['CJ'].includes(this.varietyCode)) {
          // 交割服务机构,含水量,类别
          formItems = [
            { prop: 'vehicle_ship_plate', label: '交割服务机构', type: 'select', multiple: true },
            { prop: 'water', label: '含水量', type: 'input' },
            { prop: 'category', label: '类别', type: 'input' }
          ]
        } else if (['PM'].includes(this.varietyCode)) {
          // 交割服务机构,等级,年度,产地
          formItems = [
            { prop: 'vehicle_ship_plate', label: '交割服务机构', type: 'select', multiple: true },
            { prop: 'grade', label: '等级', type: 'input' },
            { prop: 'year', label: '年度', type: 'input' },
            { prop: 'product_place', label: '产地', type: 'input' }
          ]
        } else if (['RS'].includes(this.varietyCode)) {
          // 交割服务机构,产地,热损粒,杂质,生霉粒,水份,含油量
          formItems = [
            { prop: 'vehicle_ship_plate', label: '交割服务机构', type: 'select', multiple: true },
            { prop: 'product_place', label: '产地', type: 'input' },
            { prop: 'reli', label: '热损粒', type: 'input' },
            { prop: 'zazhi', label: '杂质', type: 'input' },
            { prop: 'shengmei', label: '生霉粒', type: 'input' },
            { prop: 'water', label: '水份', type: 'input' },
            { prop: 'olil', label: '含油量', type: 'input' }
          ]
        } else if (['WH'].includes(this.varietyCode)) {
          // 仓库,等级,年度,产地
          formItems = [
            { prop: 'store_house', label: '仓库', type: 'select', multiple: true },
            { prop: 'grade', label: '等级', type: 'input' },
            { prop: 'year', label: '年度', type: 'input' },
            { prop: 'product_place', label: '产地', type: 'input' }
          ]
        } else if (['ZC'].includes(this.varietyCode)) {
          // 交割服务机构,煤种,年度,等级,类别,产地
          formItems = [
            { prop: 'vehicle_ship_plate', label: '交割服务机构', type: 'select', multiple: true },
            { prop: 'coal_kind', label: '煤种', type: 'input' },
            { prop: 'year', label: '年度', type: 'input' },
            { prop: 'grade', label: '等级', type: 'input' },
            { prop: 'category', label: '类别', type: 'input' },
            { prop: 'product_place', label: '产地', type: 'input' }
          ]
        }
      }
      formItems.forEach(item => {
        let value = item.multiple ? [] : ''
        if (fItem[item.prop]) {
          value = fItem[item.prop]
        }
        this.$set(fItem, item.prop, value)
      })
      fItem.formItems = formItems
    },
    handleAdd() {
      if (this.form.list.length >= 3) {
        return this.$message.error('仅支持填写三个意向申请。')
      }
      const fItem = {
        uuid: `uuid-${++uuid}`,
        delivery_type: this.deliveryOfVehicleAndShipPlates === 'N' ? 'A' : '',
        formItems: []
      }
      this.form.list.push(fItem)
      if (this.deliveryOfVehicleAndShipPlates === 'N') {
        this.handleDeliveryTypeChange(fItem)
      }
    },
    handleRemove(item) {
      this.form.list = this.form.list.filter(v => v.uuid !== item.uuid)
    },
    resetForm() {
      this.$refs.formRef.resetFields()
    },
    validateForm(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          callback({ ...this.form })
        } else {
          callback()
        }
      })
    }
  }
}
</script>