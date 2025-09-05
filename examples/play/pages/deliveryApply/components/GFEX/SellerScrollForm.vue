<template>
  <div class="form-container">
    <div class="columnTitle">卖方仓单信息</div>
    <div>您可以通过本页面直接填写或者上传固定模板附件<span class="template-download-text" @click="handleDownloadTemplate">【模板下载]</span>进行批量导入
    </div>
    <div style="display: flex; padding:10px 0">
      <el-button v-if="!isDetail" size="mini" icon="el-icon-plus" @click="handleAdd"></el-button>
      <ExcelUpload v-if="!isDetail" businessType="DELIV_APPLY_GFEX" style="margin:010px" @success="handleImportData"></ExcelUpload>
      <el-button type="primary" size="mini" :loading="exportLoading" @click="handleExport">导出</el-button>
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
            prop="warehouseNumber"
            label="仓单编号"
            align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'sellerDeliveryInformations.'+ scope.$index + '.warehouseNumber'"
                :rules="{ required: true, validator:validateWhRcpNo, record:scope.row, trigger: ['blur', 'change'] }"
              >
                <el-input v-model="scope.row.warehouseNumber" :disabled="isDetail" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="warehouse"
            label="仓库/分库"
            align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'sellerDeliveryInformations.'+ scope.$index + '.warehouse'"
                :rules="{ required: true, validator:validateWarehouse, record:scope.row, trigger: ['blur', 'change'] }"
              >
                <el-input v-model="scope.row.warehouse" :disabled="isDetail" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="numberOfHands"
            label="数量(手)"
            align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'sellerDeliveryInformations.'+ scope.$index + '.numberOfHands'"
                :rules="{ required: true, validator:validateNumberOfHands, record:scope.row, trigger: ['blur', 'change'] }"
              >
                <el-input v-model="scope.row.numberOfHands" :disabled="isDetail" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </template>
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
        <div
          v-if="form.sellerDeliveryInformations.length > 10"
          class="pagination-wrap">
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
      <el-row :gutter="48">
        <el-col :span="8">
          <el-form-item
            label="投保标志"
            prop="signs0fSpeculation">
            <el-radio-group
              v-model="form.signsOfSpeculation"
              :disabled="isDetail">
              <el-radio
                v-for="item in signsOfSpeculationList"
                :key="item.value"
                :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ExcelUpload from '../ExcelUpload.vue'
import { DELIVERY_INSURE_FLAG } from '../..util'
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
  components: {
    ExcelUpload
  },
  data() {
    return {
      form: {
        sellerDeliveryInformations: [
          {
            uuid: `uuid-${uuid}`,
            warehouseNumber: '',
            warehouse: '',
            numberOfHands: '',
            numberOfSheets: ''
          }
        ],
        standardWeight: '',
        payment: '',
        deliveryQuantity: '',
        signsOfSpeculation: '',
      },
      rules: {
        sellerDeliveryInformations: { required: true, message: '请计算标准重量', trigger: 'change' },
        standardWeight: { required: true, message: '请计算标准重量', trigger: 'change' },
        payment: { required: true, message: '请计算估算货款', trigger: 'change' },
        signsOfSpeculation: { required: true, message: '请选择投保标志', trigger: 'change' },
      },
      signsOfSpeculationList: DELIVERY_INSURE_FLAG,
      pageNum: 1,
      pageSize: 10,
      pageSizeList: [10, 20, 50, 100],
      exportLoading: false
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
      if (rest.sellerDeliveryInformations &&rest.sellerDeliveryInformations.length > 0) {
        this.form.sellerDeliveryInformations = rest.sellerDeliveryInformations.map(item => ({ ...item, uuid:`uuid-${++uuid}`}))
      }
    }
  },
  methods: {
    validateWhRcpNo(rule, value, callback) {
      value = rule.record.warehouseNumber
      // 对应品种代码(大小写均可)+14位数字
      // const regex = new RegExp('^' + this.deliveryVariety + '[0-9]{14}$','gi')
      if (!value) {
        callback(new Error('请输入仓单编号'))
      } else {
        callback()
      }
    },
    validateWarehouse(rule, value, callback) {
      value = rule.record.warehouse
      if (!value) {
        callback(new Error('请输入仓库/分库'))
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
    handleDownloadTemplate() {
      // todo
    },
    handleImportData(result) {
      result = result.map(item => {
        return {
          ...item,
          warehouseNumber: item.warehouseNumber || '',
          warehouse: item.warehouse || '',
          numberOfHands: item.numberOfHands || '',
          numberOfSheets: item.numberOfHands ? item.numberOfHands / this.deliveryUnitHand : '',
          uuid: `uuid-${++uuid}`,
        }
      })
      // TODO 容易犯错的地方, 正则不能提出循环外,否则会出问题
      for (const item of result) {
        const whRegex = new RegExp('^' + this.deliveryVariety + '[0-9]{14}$','gi')
        if (item.warehouseNumber && !whRegex.test(item.warehouseNumber)) {
          return this.$message.error('请输入正确仓单号。')
        }
        if (item.numberOfHands && (item.numberOfHands % this.deliveryUnitHand !== 0)) {
          return this.$message.error(`请输入交割单位:${this.deliveryUnitHand}的整数倍。`)
        }
      }

      if (this.form.sellerDeliveryInformations.length > 0) {
        // 校验通过则判断当前是否已有添加行,若有则弹框提示“请选择追加或覆盖表格内已有数据。
        this.$messageBox.confirm('请选择追加或覆盖表格内已有数据。', '提示', {
          confirmButtonText: '覆盖',
          cancelButtonText: '追加',
          customClass: 'online-web-confirm-box',
          confirmButtonClass: 'space-margin-left',
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.form.sellerDeliveryInformations = result
        }).catch(() => {
          this.form.sellerDeliveryInformations.push(...result)
        })
      } else {
        this.form.sellerDeliveryInformations = result
      }
    },
    handleAdd() {
      this.form.sellerDeliveryInformations.push({
        uuid: `uuid-${++uuid}`,
        warehouseNumber: '',
        warehouse: '',
        numberOfHands: '',
        numberOfSheets: ''
      })
    },
    handleDel(record) {
      if (this.form.sellerDeliveryInformations.length === 1) {
        this.$message.error('至少上传一条数据')
        return
      }
      this.form.sellerDeliveryInformations = this.form.sellerDeliveryInformations.filter(v => v.uuid !== record.uuid)
      if (this.form.sellerDeliveryInformations.length % this.pageSize === 0 && this.pageNum >1) {
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
        if (['warehouseNumber', 'warehouse'].includes(column.property)) {
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
          if (index === 4 && !this.isDetail) {
            // 标准重量=交割单位(数量)*张数
            this.form.standardWeight = this.deliveryUnitAmount * sums[index]
            // 估算货款=标准重量*交割月合约最新结算价
            this.form.payment = (this.form.standardWeight * this.lastSettlePrice).toFixed(2)
            this.form.deliveryQuantity = sums[index]
          }
          sums[index] = commafy(sums[index]) // 千位符展示
        } else {
          if (index === 4 && !this.isDetail) {
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
            if (this.form.sellerDeliveryInformations.some(item => !item.warehouseNumber || !item.numberOfHands || !item.warehouse)) {
              this.$message.error('请完整填写申请表格内容。')
              return
            }
            if (hasDuplicateField(this.form.sellerDeliveryInformations, 'warehouseNumber')) {
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