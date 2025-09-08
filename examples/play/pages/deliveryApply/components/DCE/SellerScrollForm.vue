<template>
  <div class="form-container">
    <div class="columnTitle">卖方仓单信息</div>
    <div style="display: flex; padding:10px 0">
      <el-button v-if="!isDetail" size="mini" @click="handleAdd">添加/修改</el-button>
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-position="top">
      <div style="padding-bottom: 16px">
        <el-table
          border
          :data="renderList"
          row-key="uuid"
          :header-cell-style="{background:'#F5F6F9'}"
          :summary-method="getSummaries"
          show-summary
          class="table-show-summary-wrapper"
        >
          <el-table-column type="index" label="序号" align="center" width="70">
            <template slot-scope="scope">
              <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="deliveryType"
            label="仓库/分库"
            align="center">
            <template slot-scope="scope">
              {{ scope.deliverType === 'A' ? '交割库' : '车板场所' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouse"
            label="仓库/分库"
            align="center">
          </el-table-column>
          <el-table-column
            prop="numberOfHands"
            label="数量(手)"
            align="center">
          </el-table-column>
          <el-table-column prop="numberOfSheets" label="数量(张)" align="center">
          </el-table-column>
          <el-table-column v-if="!isDetail" prop="opt" label="操作" width="120px" align="center">
            <template slot-scope="{row}">
              <el-button type="text" @click="handleDel(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 超过10条则分页展示 -->
        <div v-if="form.sellerDeliveryInformations.length > 10" class="pagination-wrap">
          <el-pagination
            background layout="total, sizes, prev, pager, next, jumper"
            :current-page="pageNum"
            :page-size="pageSize"
            :page-sizes="pageSizeList"
            :total="form.sellerDeliveryInformations.length"
            @current-change="handlePageNumChange"
            @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </div>
      <el-row :gutter="48">
        <el-col :span="9">
          <el-form-item label="标准重量" prop="standardWeight">
            <el-input v-model="form.standardWeight" disabled>
              <template slot="append">{{ varietyTbInfo.weight_unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item prop="payment">
            <span slot="label">估算货款<span style="color: red; font-size:12px">(按标准重量及交割月合约最新结算价计算)</span></span>
            <el-input v-model="form.payment" disabled>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <AddDialog
      :visible="addVisible"
      :listData="form.sellerDeliveryInformations"
      :baseInfo="baseInfo"
      :varietyTbInfo="varietyTbInfo"
      :deliverType="deliverType"
      @close="addVisible = false"
      @ok="handleFinalData"/>
  </div>
</template>

<script>
import AddDailog from './SellerScrollAddDailog.vue'
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
    },
    instInfo: {
      type: Object,
      default: () => ({})
    },
    deliverType: {
      type: Array,
      default: () => []
    },
  },
  components: {
    AddDailog
  },
  data() {
    return {
      form: {
        sellerDeliveryInformations: [],
        standardWeight: '',
        payment: '',
        deliveryQuantity: '',
      },
      rules: {
        sellerDeliveryInformations: { required: true, message: '请计算标准重量', trigger: 'change' },
        standardWeight: { required: true, message: '请计算标准重量', trigger: 'change' },
        payment: { required: true, message: '请计算估算货款', trigger: 'change' },
      },
      pageNum: 1,
      pageSize: 10,
      pageSizeList: [10, 20, 50, 100],
      addVisible: false,
    }
  },
  computed: {
    renderList() {
      const startIndex = (this.pageNum - 1) * this.pageSize;
      const endIndex = this.pageNum * this.pageSize;
      return this.form.sellerDeliveryInformations.slice(startIndex, endIndex);
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
    deliveryVariety() {
      return this.baseInfo.deliveryVariety
    },
  },
  mounted() {
    if (this.$route.query.missionCode) {
      // eslint-disable-next-line no-unused-vars
      const { remarks,...rest } = this.$parent.$parent.getFormDetailInfo() || {}
      this.form = { ...this.form,...rest}
      if (rest.sellerDeliveryInformations && rest.sellerDeliveryInformations.length > 0) {
        this.form.sellerDeliveryInformations = rest.sellerDeliveryInformations.map(item => ({ ...item, uuid:`uuid-${++uuid}`}))
      }
    }
  },
  methods: {
    clearListData() {
      this.form.sellerDeliveryInformations = []
    },
    handleAdd() {
      // 校验是否有已添加信息,若存在则弹框提示“交易所数据实时更新,需重新填写数据。”【确认]:进入添加/修改页
      if (this.form.sellerDeliveryInformations.length > 0) {
        this.$MessageBox.alert('交易所数据实时更新,需重新填写数据。','提示',{
          confirmButtonText:'确认',
          customClass:'online-web-confirm-box',
          confirmButtonClass:'space-margin-left'
        }).then(() => {
          this.addVisible = true
        })
        return
      }
      this.addVisible = true
    },
    handleDel(row) {
      this.form.sellerDeliveryInformations = this.form.sellerDeliveryInformations.filter(v => v.uuid !== row.uuid)
      if (this.form.sellerDeliveryInformations.length % this.pageSize === 0 && this.pageNum >1) {
        this.pageNum -= 1
      }
      if (this.form.sellerDeliveryInformations.length === 0) {
        this.$refs.formRef.validateField('sellerDeliveryInformations')
      }
    },
    handleFinalData(dataList) {
      this.form.sellerDeliveryInformations = dataList.map(item => {
        return {
          ...item,
          number0fSheets: item.numberOfHands / this.deliveryUnitHand
        }
      })
      this.addVisible = false
      this.$refs.formRef.validateField('sellerDeliveryInformations')
    },
    handlePageNumChange(val) {
      this.pageNum = val
    },
    handleSizeChange(val) {
      this.pageNum = 1
      this.pageSize = val
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if (['deliveryType', 'warehouse'].includes(column.property)) {
          sums[index] = '--/--'
          return
        }
        if (column.property === 'opt') {
          sums[index] = ''
          return
        }
        if (this.form.sellerDeliveryInformations.length) {
          sums[index] = this.form.sellerDeliveryInformations.reduce((prev, curr) => {
            const value = curr[column.property] ? Number(delcommafy(curr[column.property])) : ''
            if (!isNaN(value)) {
              return bigNumberAdd(prev, delcommafy(curr[column.property]))
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index] || ''
        } else {
          sums[index] = ''
        }
      })
      sums.forEach((item,index) => {
        if (item && !isNaN(item)) {
          if (index === 3 && !this.isDetail) {
            // 标准重量=交割单位(数量)*张数
            this.form.standardWeight = this.deliveryUnitAmount * sums[index]
            // 估算货款=标准重量*交割月合约最新结算价
            this.form.payment = (this.form.standardWeight * this.lastSettlePrice).toFixed(2)
            this.form.deliveryQuantity = sums[index]
          }
          sums[index] = commafy(sums[index]) // 千位符展示
        } else {
          if (index === 3 && !this.isDetail) {
            this.form.standardWeight = ''
            this.form.payment = ''
            this.form.deliveryQuantity = ''
          }
        }
      })
      return sums
    },
    getFormData() {
      return { ...this.form }
    },
    resetForm() {
      this.$refs.formRef.resetFields()
    },
    validateForm() {
      return new Promise((resolve) => {
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            resolve(true)
          } else {
            resolve(null)
          }
        })
      })
    }
  }
}
</script>