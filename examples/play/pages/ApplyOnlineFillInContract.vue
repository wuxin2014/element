<template>
  <el-dialog
    width="70%"
    :visible="visible"
    :close-on-click-modal="true"
    :before-close="handleClose"
    :append-to-body="true"
    class="custom_dialog_wrap online-fill-apply-contract-czce-dialog"
  >
    <div
      slot="title"
      class="dialog-title-text">
      线上填写
    </div>
    <div style="padding-bottom: 30px">
      <el-form
        ref="onlineFillForm"
        :model="form"
        :rules="rules"
        label-width="100px">
        <div style="padding-left: 30px">
          <el-row :gutter="48">
            <el-col :span="12">
              <el-form-item
                label="申请日期"
                prop="apply_date">
                <el-date-picker
                  v-model="form.apply_date"
                  type="date"
                  format="yyyy年MM月dd日"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择申请日期"
                  :disabled="isDetail"
                  style="width: 100%;"
                  :append-to-body="false"
                  popper-class="custom_poper_class"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="12">
              <el-form-item
                label="联系人"
                prop="contact">
                <el-autocomplete
                  v-model.trim="form.contact"
                  placeholder="请填写"
                  :disabled="isDetail"
                  style="width: 100%"
                  :fetch-suggestions="querySearchName"
                  :popper-append-to-body="false"
                  popper-class="custom_poper_class"
                  @select="selectContactChange">
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <!-- @blur="handlePhoneBlur" -->
            <el-col :span="12">
              <el-form-item
                label="联系人电话"
                prop="contact_num">
                <el-input
                  v-model.trim="form.contact_num"
                  :disabled="isDetail"
                  style="width: 100%"
                  onkeyup="value=value.replace(/[^0-9-()]+/,'')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div
            class="title-box"
            style="padding: 10px 0"><span class="circle"></span>额度申请明细</div>
          <div
            v-if="!isDetail"
            style="text-align: right; margin-bottom: 14px;"><el-button
            size="mini"
            icon="el-icon-plus"
            @click="handleAdd"></el-button></div>
          <el-form-item
            label-width="0px"
            prop="apply_details">
            <div style="padding-bottom: 16px">
              <el-table
                border
                size="mini"
                :data="tableList"
                :header-cell-style="{background: '#f5f7fa'}"
                :header-cell-class-name="handleHeaderCellClass"
                :summary-method="getSummaries"
                show-summary
                class="table-show-summary-wrapper"
                @sort-change="sortChange"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="70">
                  <template slot-scope="scope">
                    <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contract_code"
                  label="合约代码"
                  sortable="custom"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="direction"
                  label="买卖方向"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="quantity"
                  label="申请数量（手）"
                  align="center">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'apply_details.' + scope.$index + '.quantity'"
                      :rules="{ required: true, message: '请输入申请数量', trigger: ['blur', 'change'] }">
                      <el-input
                        v-model="scope.row.quantity"
                        placeholder="请输入" 
                        size="mini"
                        @blur="handleQuantityBlur(scope.row)"
                        @focus="handleQuantityFocus(scope.row)"
                        :disabled="isDetail"
                        style="width: 100%" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="!isDetail"
                  label="操作"
                  width="100px"
                  align="center">
                  <template slot-scope="{row}">
                    <el-button
                      @click="handleDel(row)"
                      type="text">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <div style="display: flex; justify-content: flex-end">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="currentPage"
              :page-size="pageSize" 
              :page-sizes="pageSizeList"
              :total="form.apply_details.length"
              @current-change="handleChangeCurrentPage"
              @size-change="handleSizeChange">    
            </el-pagination>
          </div>
        </div>
      </el-form>
    </div>
    <div
      slot="footer"
      style="text-align: center; padding-top: 20px">
      <template v-if="isDetail">
        <el-button @click="handleClose">返回</el-button>
      </template>
      <template v-else>
        <el-button
          type="primary"
          :loading="finishedLoading"
          @click="handleFinished">填写完成</el-button>
        <el-button
          :loading="previewLoading"
          style="margin-left: 40px"
          @click="handlePreview">申请表预览</el-button>
        <el-button
          style="margin-left: 40px"
          @click="resetConfirmDialogVisible = true">重置</el-button>
        <el-button
          style="margin-left: 40px"
          @click="handleClose">取消</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { RegMap } from '@/utils/validation'
import { commafy, delcommafy, bigNumberAdd } from '@/filter/appFilters'
import { parseSession, toggleBody } from '@/utils/tools'
import { getBusPerson, queryCzceProductInstrument } from '@/server/arbitrage'

let uuid = 0

export default {
  name: 'ApplyOnlineFillInContract',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    finishedLoading: {
      type: Boolean,
      default: false
    },
    previewLoading: {
      type: Boolean,
      default: false
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '合约方式'
    },
    applyFillInfo: {
      type: Object,
      default: () => ({})
    },
    searchInfo: {
      type: Object,
      default: () => ({})
    },
    quotaList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        apply_date: null,
        contact_num: '',
        contact: '',
        apply_details: []
      },
      rules: {
        contact: { required: true, message: '请输入联系人', trigger: ['blur', 'change'] },
        contact_num: { required: true, message: '请输入联系人电话', trigger: ['blur', 'change'] },
        apply_details: { required: true, type: 'array', message: '请添加额度申请明细', trigger: 'change' },
        apply_date: { required: true, message: '请选择申请日期', trigger: 'change' }
      },
      contactList: [], // 联系人数据列表
      contractList: [], // 合约数据列表
      innerVisible: false,
      currentPage: 1, //初始页码
      pageSize: 10, //每页条数
      pageSizeList: [10, 20, 50, 100],
      order: {},
      resetConfirmDialogVisible: false,
    }
  },
  computed: {
    tableList() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = this.currentPage * this.pageSize;
      return this.form.apply_details.slice(startIndex, endIndex);
    },
    fileType() {
      return this.searchInfo.business_type === 'HEDGE_CZCE_GEN_APPLY' ? 'HEDGE_CZCE_APPLY_BREED' : 'HEDGE_CZCE_APPLY'
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        toggleBody(true)
        if (!this.isDetail) {
          this.queryContactList()
          this.queryContractList()
        }
        this.order = {}
        this.currentPage = 1
        this.pageSize = 10
        const { apply_date, contact_num, contact, apply_details = [] } = this.applyFillInfo
        this.form.apply_date = apply_date || this.getNowDate()
        this.form.contact = contact || ''
        this.form.contact_num = contact_num || ''
        uuid = 0
        this.form.apply_details = apply_details.map(item => {
          uuid++
          return { ...item, uuid }
        })
        this.clearFormValidate()
      } else {
        toggleBody()
      }
    }
  },
  methods: {
    clearFormValidate() {
      this.$nextTick(() => {
        this.$refs.onlineFillForm && this.$refs.onlineFillForm.clearValidate()
      })
    },
    queryContractList() {
      this.contractList = []
      queryCzceProductInstrument({
        prod_code: this.searchInfo.varietyItem.variety_code,
        business_type: this.searchInfo.business_type
      }).then(res => {
        if (res.code === '000000') {
          this.contractList = res.data || []
        }
      })
    },
    queryContactList() {
      const storageData = parseSession('storageData') || {}
      const params = {
        business_type: 'HEDGE_ARBITRAGE_CONTACT_CZCE',
        exchange_code: this.searchInfo.exchange_code,
        client_id: storageData.client_id
      }
      getBusPerson({ params }).then(res => {
        if (res.code === '000000') {
          this.contactList = res.data || []
        }
      })
    },
    querySearchName(queryString, callback) {
      const arr = queryString ? this.contactList.filter(item => {
        return item.name && item.name.indexOf(queryString) > -1
      }) : this.contactList;
      const result = arr.map(item => ({ value: item.name, id: item.id }))
      callback(result)
    },
    selectContactChange(item) {
      this.contactList.forEach(element => {
        if (item.id === element.id) {
          this.form.contact_num = element.phone_number
        }
      });
    },
    handleAQuotaOK(data = []) {
      let newArr = []
      data.forEach(item => {
        const isExsit = this.form.apply_details.some(applyItem => applyItem.contract_code === item.contract_code && applyItem.direction === item.direction)
        if (isExsit) {
          this.form.apply_details.filter(applyItem => applyItem.contract_code === item.contract_code && applyItem.direction === item.direction)[0].quantity = item.quantity
        } else {
          uuid++;
          newArr.push({
            ...item,
            uuid
          })
        }
      })
      this.form.apply_details = this.form.apply_details.concat(newArr);
      // 移除表单项的校验结果, 针对某个字段
      this.$refs.onlineFillForm.clearValidate('apply_details');
    },
    handleClose() {
      this.handleReset()
      toggleBody()
      this.$emit('close')
    },
    handleReset() {
      this.resetConfirmDialogVisible = false
      this.form.apply_date = this.getNowDate()
      this.form.contact_num = ''
      this.form.contact = ''
      this.form.apply_details = []
      this.currentPage = 1
      this.pageSize = 10
      this.order = {}
      this.clearFormValidate()
    },
    //改变当前页码
    handleChangeCurrentPage(val) {
      this.currentPage = val;
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleHeaderCellClass({ column }) {  
      const { order, prop } = this.order;
      if (prop === column.property) {
        column.order = order
      } else {
        column.order = ''
      }
    },
    sortChange(column) { 
      this.currentPage = 1
      // 自定义排序
      this.form.apply_details = this.form.apply_details.sort(this.sortFun(column.prop, column.order === 'ascending'));
      this.order = {
        order: column.order,
        prop: column.prop
      }
    },
    sortFun(attr, rev) {
      console.log(attr, rev)
      if (rev == undefined) {
        rev = 1;
      } else {
        rev = (rev) ? 1 : -1;
      }
      return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 0;
      }
    },
    // 聚焦时恢复数字
    handleQuantityFocus(row) {
      if (row.quantity) {
        row.quantity = delcommafy(row.quantity)
      }
    },
    // 数字千位符处理
    handleQuantityBlur(row) {
      if (!row.quantity) {
        return;
      }

      if (!RegMap.positiveInteger.test(row.quantity)) {
        row.quantity = '';
        this.$Message.error('申请数量请填写正整数');
        return;
      }

      // 申请数量输入完成后需要校验是否小于前期获批额度,若小于则提示：该额度小于前期获批额度，请确认申请的额度数量并及时调整持仓避免超仓
      if (row.direction && row.quantity) {
        let directionText = row.direction === '买入' ? 'B' : 'S'
        // quotaList : 买卖方向（B-买；S-卖)
        const filterArr = this.quotaList.filter(item => item.buy_sell_drc === directionText && item.ar_id === row.contract_code)
        if (filterArr.length > 0 && row.quantity < Number(filterArr[0].aprvl_num)) {
          this.$Message.error('该额度小于前期获批额度，请确认申请的额度数量并及时调整持仓避免超仓');
        }
      }
      row.quantity = commafy(row.quantity)
    },
    getNowDate() {
      const date = new Date()
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      month = month.toString().padStart(2, '0')
      day = day.toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    handlePhoneBlur() {
      if (this.form.contact_num && !RegMap.handlerTel.test(this.form.contact_num) && !RegMap.mobile.test(this.form.contact_num)) {
        this.form.contact_num = ''
        this.$Message.error('联系人电话有误')
      }
    },
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        if (index === 1 || index === 2 || index === 4) {
          sums[index] = index === 4 ? '' : '-';
          return;
        }

        if (column.property === 'quantity' && this.form.apply_details.length) {
          sums[index] = this.form.apply_details.reduce((prev, curr) => {
            const value = curr[column.property] ? Number(delcommafy(curr[column.property])) : '-'
            if (!isNaN(value)) {
              return bigNumberAdd(prev, delcommafy(curr[column.property]))
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index] || '-';
        } else {
          sums[index] = '-';
        }
      });
      sums.forEach((item, index) => {
        if (!isNaN(Number(item))) {
          sums[index] = commafy(sums[index]) // 千位符展示
        }
      });
      return sums;
    },
    handleAdd() {
      this.innerVisible = true
    },
    handleDel(row) {
      this.form.apply_details = this.form.apply_details.filter(item => item.uuid !== row.uuid)
    },
    // 乱序数组比较相等
    equalsIgnoreOrder(a, b) {
      console.log('=equalsIgnoreOrder=', a, b)
      if(a.length !== b.length) return false
      const newA = a.sort((x, y) => x.contract_code - y.contract_code)
      const newB = b.sort((x, y) => x.contract_code - y.contract_code)
      console.log('=equalsIgnoreOrder-sort=', newA, newB)
      return newA.every((v, i) => v.contract_code === newB[i].contract_code && v.direction === newB[i].direction && v.quantity === newB[i].quantity)
    },
    getParamsData() {
      const oldApplyDetails = this.applyFillInfo.apply_details || []
      let { apply_details, ...rest } = this.form;
      const newList = apply_details.map((item, index) => {
        return {
          ...item,
          order_num: index + 1
        }
      })
      // 判断额度申请数据是否变动了
      let isHasChange = false
      if (oldApplyDetails.length > 0) {
        isHasChange = !this.equalsIgnoreOrder(oldApplyDetails, apply_details)
      }
      return { ...rest, apply_details: newList, file_type: this.fileType, isHasChange }
    },
    handlePreview() {
      const params = this.getParamsData()
      this.$emit('preview', params)
    },
    handleFinished() {
      this.$refs.onlineFillForm.validate((valid) => {
        if (valid) {
          const params = this.getParamsData()
          this.$emit('finished', params)
        } else {
          this.$Message.error('请完整填写申请内容');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss">
.online-fill-apply-contract-czce-dialog {
  // .el-date-picker {
  //   position: absolute !important;
  //   left: 0 !important;
  // }

  .el-table {
    .el-form-item {
      margin-bottom: 4px;
    }

    .el-form-item.is-error {
      margin-bottom: 22px
    }
  }

  .table-show-summary-wrapper {
    .el-table__empty-block {
      display: none;
    }
    .el-table__footer-wrapper {
      display: block !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.online-fill-apply-contract-czce-dialog {
  .dialog-title-text {
    color: transparent;
  }
}
</style>