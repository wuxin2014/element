<template>
  <div class="form-container">
    <div class="columnTitle">卖方仓单信息</div>
    <div>您可以通过本页面直接填写或者上传固定模板附件<span class="template-download-text" @click="handleDownloadTemplate">【模板下载】</span>进行批量导入
    </div>
    <div style="display: flex; padding:10px 0">
      <el-button v-if="!isDetail" size="mini" icon="el-icon-plus" @click="handleAdd"></el-button>
      <ExcelUpload v-if="!isDetail" businessType="DELIV_APPLY_CZCE" style="margin:0 10px" @success="handleImportData">
      </ExcelUpload>
      <el-button type="primary" size="mini" :loading="exportLoading" @click="handleExport">导出</el-button>
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-position="top">
      <div style="padding-bottom: 16px">
        <el-table border :data="renderList" :header-cell-style="{ background: '#F5F6F9' }" :summary-method="getSummaries"
          show-summary class="table-show-summary-wrapper">
          <el-table-column type="index" label="序号" align="center" width="70">
            <template slot-scope="scope">
              <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="wh_rcp_no" label="仓单号" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'tableList.' + scope.$index + '.wh_rcp_no'" :rules="[
                { required: true, message: '请输入仓单号', trigger: ['blur', 'change'] },
                { validator: validateWhRcpNo, trigger: ['blur', 'change'] }
              ]">
                <el-input v-model="scope.row.wh_rcp_no" :disabled="isDetail" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="qty" label="数量(手)" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'tableList.' + scope.$index + '.qty'"
                :rules="{ required: true, validator: validateDeliveryAmount, record: scope.row, trigger: ['blur', 'change'] }">
                <el-input v-model="scope.row.qty" :disabled="isDetail" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="qtyz" label="数量(张)" align="center">
          </el-table-column>
          <el-table-column v-if="!isDetail" prop="opt" label="操作" width="120px" align="center">
            <template slot-scope="{row}">
              <el-button type="text" @click="handleDel(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 超过10条则分页展示 -->
        <div v-if="form.tableList.length > 10" class="pagination-wrap">
          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage"
            :page-size="pageSize" :page-sizes="pageSizeList" :total="form.tableList.length"
            @current-change="handlePageNumChange" @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </div>
      <el-row :gutter="48">
        <el-col :span="9">
          <el-form-item label="标准重量" prop="field1">
            <el-input v-model="form.field1" disabled>
              <template slot="append">{{ varietyTbInfo.weight_unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item prop="field2">
            <span slot="label">估算货款<span style="color: red; font-size:12px">(按标准重量及交割月合约最新结算价计算)</span></span>
            <el-input v-model="form.field2" disabled>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="最后交易日是否申报冻结数量" prop="field3">
            <el-radio-group v-model="form.field3" :disabled="isDetail" @change="handleRadioChange">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="申报冻结数量" prop="field4"
            :rules="{ required: form.field3 === '是', pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' }">
            <el-input v-model="form.field4" :disabled="isDetail || form.field3 !== '是'" placeholder="请输入">
              <template slot="append">张</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ExcelUpload from './ExcelUpload.vue'
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
        tableList: [
          {
            uuid: `uuid-${uuid}`,
            wh_rcp_no: '',
            qty: '',
            qtyz: ''
          }
        ],
        field1: '',
        field2: '',
        field3: '',
        field4: '',
      },
      rules: {
        tableList: { required: true, message: '请计算标准重量', trigger: 'change' },
        field1: { required: true, message: '请计算标准重量', trigger: 'change' },
        field2: { required: true, message: '请计算估算货款', trigger: 'change' },
        field3: { required: true, message: '请选择', trigger: 'change' },
      },
      currentPage: 1, //初始页码
      pageSize: 10,//每页条数
      pageSizeList: [10, 20, 50, 100],
      exportLoading: false
    }
  },
  computed: {
    deliverUnitHand() {
      return this.varietyTbInfo.delivery_unit_hand
    },
    renderList() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = this.currentPage * this.pageSize;
      return this.form.tableList.slice(startIndex, endIndex);
    },
    lastSettlePrice() {
      return this.instInfo.last_settle_price
    }
  },
  methods: {
    validateWhRcpNo(rule, value, callback) {
      // 对应品种代码(大小写均可)+13位数字
      const regex = new RegExp('^' + this.baseInfo.variety_code + '[0-9]{13}$', 'gi')
      if (!value || !regex.test(value)) {
        callback(new Error('请输入正确仓单编号'))
      } else {
        callback()
      }
    },
    validateDeliveryAmount(rule, value, callback) {
      const regex = /^[1-9]\d*$/
      if (!value) {
        rule.record.qtyz = ''
        callback(new Error('请输入数量'))
      } else if (!regex.test(value)) {
        rule.record.qtyz = ''
        callback(new Error('数量需为正整数'))
      } else if (value % this.deliverUnitHand !== 0) {
        rule.record.qtyz = ''
        callback(new Error(`请输入交割单位:${this.deliverUnitHand} 的整数倍`))
      } else {
        rule.record.qtyz = value / this.deliverUnitHand
        callback()
      }
    },
    handleDownloadTemplate() {
      // startLoading()
      templateFileDownload({
        business_type: 'DELIV_APPLY_CZCE'
      }).then(res => {
        if (res && res.data) {
          downloadFileByBase64(res.data, '郑商所非通用品种卖出交割申请.xlsx')
        } else {
          this.$message.error('模板下载失败,请重新试试')
        }
      }).finally(() => {
        // endLoading()
      })
    },
    handleImportData(result) {
      result = result.map(item => {
        return {
          ...item,
          wh_rcp_no: item.wh_rcp_no || '',
          qty: item.qty || '',
          qtyz: item.qty ? item.qty / this.deliverUnitHand : '',
          uuid: `uuid-${++uuid}`,
        }
      })
      // TODO 容易犯错的地方, 正则不能提出循环外,否则会出问题
      for (const item of result) {
        const whRegex = new RegExp('^' + this.baseInfo.variety_code + '[0-9]{13}$', 'gi')
        if (item.wh_rcp_no && !whRegex.test(item.wh_rcp_no)) {
          return this.$message.error('请输入正确仓单号。')
        }
        if (item.gty && (item.qty % this.deliverUnitHand !== 0)) {
          return this.$message.error(`请输入交割单位:${this.deliverUnitHand}的整数倍。`)
        }
      }

      if (this.form.tableList.length > 0) {
        // 校验通过则判断当前是否已有添加行,若有则弹框提示“请选择追加或覆盖表格内已有数据。
        this.$messageBox.confirm('请选择追加或覆盖表格内已有数据。', '提示', {
          confirmButtonText: '覆盖',
          cancelButtonText: '追加',
          customClass: 'online-web-confirm-box',
          confirmButtonClass: 'space-margin-left',
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.form.tableList = result
        }).catch(() => {
          this.form.tableList.push(...result)
        })
      } else {
        this.form.tableList = result
      }
    },
    handleExport() {
      // this.exportLoading = true
      // const fundAccount = sessionStorage.getItem('fund_account')
      // excelExport({
      //   business_type: 'DELIV_APPLY_CZCE',
      //   data: this.form.tableList
      // }).then(res => {
      //   if (res && res.data) {
      //     downloadFileByBase64(res.data, `${fundAccount}-郑商所非通用品种卖出.xlsx`)
      //   } else {
      //     this.$message.error('到出失败,请重新试试')
      //   }
      // }).finally(() => {
      //   this.exportLoading = false
      // })
    },
    handleAdd() {
      this.form.tableList.push({
        uuid: `uuid-${++uuid}`,
        wh_rcp_no: '',
        qty: '',
        qtyz: ''
      })
    },
    handleDel(record) {
      if (this.form.tableList.length === 1) {
        this.$message.error('至少上传一条数据')
        return
      }
      this.form.tableList = this.form.tableList.filter(v => v.uuid !== record.uuid)
    },
    handlePageNumChange(val) {
      this.currentPage = val
    },
    handleSizeChange(val) {
      this.currentPage = 1
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
        if (['wh_rcp_no'].includes(column.property)) {
          sums[index] = '--/--'
          return
        }
        if (column.property === 'opt') {
          sums[index] = ''
          return
        }
        if (this.form.tableList.length) {
          sums[index] = this.form.tableList.reduce((prev, curr) => {
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
      sums.forEach((item, index) => {
        if (item && !isNaN(Number(item))) {
          this.form.field1 = sums[index] * this.deliverUnitHand
          this.form.field2 = sums[index] * this.deliverUnitHand * this.lastSettlePrice // 标准重量*交割月合约最新结算价
          sums[index] = commafy(sums[index]) // 千位符展示
        }
      })
      return sums
    },
    handleRadioChange() {
      if (this.form.field3 === '是') {
        this.$messageBox.alert('请确定意向仓单无权利瑕疵,如申报冻结仓单处于折抵状态,请提交交割解折申请,如处于作为保证金状态,请提交解除作为保证金申请。', '提示', {
          confirmButtonText: '确认',
          showClose: false,
          customClass: 'online-web-confirm-box',
          confirmButtonClass: 'space-margin-left'
        }).then(() => {
        })
      } else {
        this.form.field4 = ''
      }
    },
    resetForm() {
      this.$refs.formRef.resetFields()
    },
    validateForm(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (hasDuplicateField(this.form.tableList, 'wh_rcp_no')) {
            this.$message.error('表格内容有重复,请确认调整后重新录入。')
            return
          }
          callback({ ...this.form })
        } else {
          this.$message.error('请完整填写申请内容。')
          callback()
        }
      })
    }
  }
}
</script>