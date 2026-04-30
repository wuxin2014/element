<template>
  <el-dialog
    title="线上填写"
    width="70%"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="handleClose"
    class="custom_dialog_wrap online-fill-cancel-quota-dialog"
  >
    <div>
      <div style="margin-bottom: 20px">
        中国金融期货交易所取
      </div>
      <el-form
        ref="onlineFillForm"
        :model="form"
        :rules="rules"
      >
        <div style="padding-left: 30px">
          <div class="title-box"><span class="circle"></span>取消额度原因</div>
          <el-form-item
            prop="cancel_reason"
            style="height: 100%">
            <el-input
              type="textarea"
              v-model.trim="form.cancel_reason"
              :disabled="isDetail"
              :autosize="{ minRows: 3 }"
              maxlength="500"
              placeholder="请输入，限制500字。"
            />
          </el-form-item>
          <div class="title-box"><span class="circle"></span>取消额度明细</div>
          <el-form-item
            prop="cancel_apply_details"
            style="height: 100%">
            <div style="padding-bottom: 10px">
              <el-table
                ref="multipleTable"
                border
                size="mini"
                :data="listData"
                :header-cell-style="{background: '#f5f7fa'}"
                :row-key="getRowKey"
                @select="handleTableSelect"
                @select-all="handleTableAllSelect"
              >
                <el-table-column
                  type="selection"
                  align="center"
                  width="100"
                  :selectable="selectable">
                </el-table-column>
                <el-table-column
                  prop="productName"
                  label="品种"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="directionName"
                  label="买卖方向"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="hedgeQuota"
                  label="额度（手）"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="expireDate"
                  label="额度到期日"
                  align="center">
                  <template slot-scope="{row}">
                    {{ formatDate(row.expireDate) }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
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
          style="margin-left: 40px"
          :loading="previewLoading"
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
export default {
  name: 'OnlineFillIn',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    listData: {
      type: Array,
      default: () => []
    },
    holdSharesList: {
      type: Array,
      default: () => []
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
    selectedList: {
      type: Array,
      default: () => []
    },
    cancelReason: {
      type: String,
      default: ''
    },
    businessType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        cancel_reason: '',
        cancel_apply_details: []
      },
      rules: {
        cancel_reason: { required: true, message: '请输入取消额度原因', trigger: ['blur', 'change'] },
        cancel_apply_details: { required: true, type: 'array', message: '请勾选申请取消的额度明细', trigger: 'change' }
      },
      resetConfirmDialogVisible: false
    }
  },
  computed: {
    businessTypeText() {
      let tipText = ''
      if (this.businessType.indexOf('HEDGE_CFFEX') === 0) {
        tipText = '套保'
      } else if (this.businessType.indexOf('ARBITRAGE_CFFEX') === 0) {
        tipText = '套利'
      }
      return tipText
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.form.cancel_reason = this.cancelReason || ''
        this.form.cancel_apply_details = this.selectedList || []
        this.$nextTick(() => {
          if (this.$refs.onlineFillForm) {
            this.$refs.onlineFillForm.clearValidate()
          }
          this.toggleSelection(this.form.cancel_apply_details)
        })
      }
    }
  },
  methods: {
    formatDate(dateText) {
      return dateText ? dateText.slice(0, 4) + '年' + dateText.slice(4, 6) + '月' + dateText.slice(6) + '日' : ''
    },
    clearSelection() {
      this.$refs.multipleTable.clearSelection()
    },
    getRowKey(row) {
      return row.id
    },
    selectable(row) {
      // false 不可勾选 , true 可勾选
      return this.isDetail ? false : row.hedgeQuota !== 0
    },
    // 选择框全选处理
    handleTableAllSelect(selections) {
      console.log('handleSelectionChange===', selections)
      let newSelectedArr = []
      let noSelectedArr = []
      if (this.holdSharesList.length > 0) {
        selections.forEach((item) => {
          // 若选择品种对应方向的持仓数据也存在，则提示“当前品种有该方向的(套保/套利)持仓，请先调整持仓”
          const filterHoldSharesList = this.holdSharesList.filter(v => item.productId === v.prod_code && ((item.direction === '0' && v.total_buy_amount > 0) || (item.direction === '1' && v.total_sell_amount > 0)))
          if (filterHoldSharesList.length === 0) {
            newSelectedArr.push(item)
          } else {
            noSelectedArr.push(item)
          }
        })
      } else {
        newSelectedArr = selections
      }

      if (noSelectedArr.length > 0) {
        this.toggleSelection(noSelectedArr, false)
        this.$Message.error(`当前品种有该方向的${this.businessTypeText}持仓，请先调整持仓`)
      }

      this.form.cancel_apply_details = newSelectedArr.map(item => ({
        id: `${item.clientId}-${item.productId}-${item.direction}-${item.expireDate}`,
        direction: item.directionName,
        expire_time: this.formatDate(item.expireDate),
        is_cancel: '是',
        quota: item.hedgeQuota,
        variety: item.productName
      }));
    },
    // 选择框单个选择处理
    handleTableSelect(selections, row) {
      console.log('handleTableSelect===', selections, row)
      // 若选择品种对应方向的持仓数据也存在，则提示“当前品种有该方向的(套保/套利)持仓，请先调整持仓”
      const filterHoldSharesList = this.holdSharesList.filter(v => row.productId === v.prod_code && ((row.direction === '0' && v.total_buy_amount > 0) || (row.direction === '1' && v.total_sell_amount > 0)))
      if (filterHoldSharesList.length > 0) {
        this.toggleSelection([row], false)
        this.$Message.error(`当前品种有该方向的${this.businessTypeText}持仓，请先调整持仓`)
        return
      }
      this.form.cancel_apply_details = selections.map(item => ({
        id: `${item.clientId}-${item.productId}-${item.direction}-${item.expireDate}`,
        direction: item.directionName,
        expire_time: this.formatDate(item.expireDate),
        is_cancel: '是',
        quota: item.hedgeQuota,
        variety: item.productName
      }));
    },
    toggleSelection(rows, selected = true) {
      if (rows.length > 0) {
        const ids = rows.map(item => item.id)
        const filterList = this.listData.filter(item => ids.includes(item.id))
        filterList.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, selected);
        });
      }
      if (this.isDetail) {
        this.updateHeaderCheckBoxStyle()
      }
    },
    updateHeaderCheckBoxStyle() {
      this.$nextTick(() => {
        document.querySelectorAll('.el-table__header-wrapper .el-checkbox__original')[0].setAttribute('disabled', true)
        document.querySelectorAll('.el-table__header-wrapper .el-checkbox__input')[0].setAttribute('class', 'el-checkbox__input is-disabled')
      })
    },
    handleClose() {
      this.$refs.onlineFillForm.clearValidate()
      this.handleReset()
      this.$emit('close')
    },
    handleReset() {
      this.resetConfirmDialogVisible = false
      this.form = {
        cancel_reason: '',
        cancel_apply_details: []
      }
      this.clearSelection()
    },
    handlePreview() {
      this.$refs.onlineFillForm.validate((valid) => {
        if (valid) {
          this.$emit('preview', { ...this.form })
        } else {
          let errMsg = ''
          if (!this.form.cancel_reason) {
            errMsg = '请完整填写申请内容'
          } else if (this.form.cancel_apply_details.length === 0) {
            errMsg = '请勾选申请取消的额度明细'
          }
          this.$Message.error(errMsg);
          return false;
        }
      });
    },
    handleFinished() {
      this.$refs.onlineFillForm.validate((valid) => {
        if (valid) {
          this.$emit('finished', { ...this.form })
        } else {
          let errMsg = ''
          if (!this.form.cancel_reason) {
            errMsg = '请完整填写申请内容'
          } else if (this.form.cancel_apply_details.length === 0) {
            errMsg = '请勾选申请取消的额度明细'
          }
          this.$Message.error(errMsg);
          // this.$nextTick(() => {
          //   const isError = document.getElementsByClassName('is-error')
          //   isError[0].scrollIntoView({
          //     block: 'center',
          //     behavior: 'smooth'
          //   })
          // })
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss">
.online-fill-cancel-quota-dialog {
  .el-table__header {
    .el-table-column--selection {
      .cell {
        .el-checkbox {
          &:after {
            color: #333;
            content: "\53d6\6d88";
            font-size: 14px;
            margin-left: 6px;
            font-weight: bold;
          }
        }
      }
    }
  }
  .dialog-title-text {
    color: transparent;
  }
  .title-box {
    text-align: left;
    padding: 6px 0;
    color: #606266;

    .circle {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: none;
      border: 2px solid $btn-red;
      border-radius: 50%;
      margin-right: 10px;
    }
    .star {
      margin-left: 10px;
      &:before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }

}
</style>