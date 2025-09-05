<template>
  <div class="form-container">
    <div class="columnTitle">买方意向信息</div>
    <div style="display: flex; padding:10px 0">
      <el-button v-if="!isDetail" size="mini" @click="handleAdd">添加</el-button>
    </div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      size="small"
      label-position="top">
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
            prop="transactionTypeCode"
            label="交易类型编码"
            align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'buyerDeliveryInformations.'+ scope.$index + '.transactionTypeCode'"
                :rules="{ required: true, validator:validateTransactionTypeCode, record:scope.row, trigger: ['blur', 'change'] }">
                <el-select
                  v-model="scope.row.transactionTypeCode"
                  :disabled="isDetail"
                  style="width: 100%">
                  <el-option
                    v-for="item in transactionTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="numberOfHands"
            label="数量(手)"
            align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'buyerDeliveryInformations.'+ scope.$index + '.numberOfHands'"
                :rules="{ required: true, validator:validateNumberOfHands, record:scope.row, trigger: ['blur', 'change'] }">
                <el-input
                  v-model="scope.row.numberOfHands"
                  :disabled="isDetail"
                  placeholder="请输入"
                  style="width: 100%" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="numberOfSheets"
            label="数量(张)"
            align="center">
          </el-table-column>
          <el-table-column
            v-if="!isDetail"
            prop="opt"
            label="操作"
            width="120px"
            align="center">
            <template slot-scope="{row}">
              <el-button type="text" @click="handleDel(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 超过10条则分页展示 -->
        <div
          v-if="form.buyerDeliveryInformations.length > 10"
          class="pagination-wrap">
          <el-pagination
            background layout="total, sizes, prev, pager, next, jumper"
            :current-page="pageNum"
            :page-size="pageSize"
            :page-sizes="pageSizeList"
            :total="form.buyerDeliveryInformations.length"
            @current-change="handlePageNumChange"
            @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </div>
      <el-row :gutter="48">
        <el-col :span="8">
          <el-form-item prop="payment">
            <span slot="label">估算货款<span style="color: red; font-size:12px">(按标准重量及交割月合约最新结算价计算)</span></span>
            <el-input v-model="form.payment" disabled>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
      form: {
        buyerDeliveryInformations: [
          {
            uuid: `uuid-${uuid}`,
            transactionTypeCode: '',
            numberOfHands: '',
            numberOfSheets: ''
          }
        ],
        standardWeight: '',
        payment: '',
        deliveryQuantity: '',
      },
      rules: {
        standardWeight: { required: true, message: '请计算标准重量', trigger: 'change' },
        payment: { required: true, message: '请计算估算货款', trigger: 'change' },
      },
      pageNum: 1,
      pageSize: 10,
      pageSizeList: [10, 20, 50, 100],
      transactionTypeList: []
    }
  },
  computed: {
    renderList() {
      const startIndex = (this.pageNum - 1) * this.pageSize;
      const endIndex = this.pageNum * this.pageSize;
      return this.form.buyerDeliveryInformations.slice(startIndex, endIndex);
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
      if (rest.buyerDeliveryInformations &&rest.buyerDeliveryInformations.length > 0) {
        this.form.buyerDeliveryInformations = rest.buyerDeliveryInformations.map(item => ({ ...item, uuid:`uuid-${++uuid}`}))
      }
    }
  },
  methods: {
    validateTransactionTypeCode(rule, value, callback) {
      value = rule.record.transactionTypeCode
      if (!value) {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    },
    validateDeliveryAmount(rule, value, callback) {
      value = rule.record.number0fHands
      const regex = /^[1-9]\d*$/
      if (!value) {
        rule.record.numberOfSheets = ''
        callback(new Error('请输入数量'))
      } else if (!regex.test(value)) {
        rule.record.numberOfSheets = ''
        callback(new Error('数量需为正整数'))
      } else if (value % this.deliveryUnitHand !== 0) {
        rule.record.numberOfSheets = ''
        callback(new Error(`请输入交割单位:${this.deliveryUnitHand}的整数倍`))
      } else {
        rule.record.numberOfSheets = value / this.deliveryUnitHand
        callback()
      }
    },
    handleAdd() {
      this.form.buyerDeliveryInformations.push({
        uuid: `uuid-${++uuid}`,
        transactionTypeCode: '',
        numberOfHands: '',
        numberOfSheets: ''
      })
    },
    handleDel(record) {
      if (this.form.buyerDeliveryInformations.length === 1) {
        this.$message.error('至少上传一条数据')
        return
      }
      this.form.buyerDeliveryInformations = this.form.buyerDeliveryInformations.filter(v => v.uuid !== record.uuid)
      if (this.form.buyerDeliveryInformations.length % this.pageSize === 0 && this.pageNum > 1) {
        this.pageNum -= 1
      }
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
        if (['transactionTypeCode'].includes(column.property)) {
          sums[index] = '--/--'
          return
        }
        if (column.property === 'opt') {
          sums[index] = ''
          return
        }
        if (this.form.buyerDeliveryInformations.length) {
          sums[index] = this.form.buyerDeliveryInformations.reduce((prev, curr) => {
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
            if (this.form.buyerDeliveryInformations.some(item => !item.transactionTypeCode || !item.numberOfHands)) {
              this.$message.error('请完整填写申请表格内容。')
              return
            }
            if (hasDuplicateField(this.form.buyerDeliveryInformations, 'transactionTypeCode')) {
              this.$message.error('表格内容有重复，请确认调整后重新录入。')
              return
            }
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