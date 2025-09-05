<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="handleClose"
    width="1000px"
    class="custom_dialog_wrap">
    <div style="padding: 10px 0"><span style="color: red">填写拟提交仓库/分库行对应的数量即可。</span>因交易所查询限制,若本次需提交内容无对应查询结果,可手动添加</div>
    <el-form
      ref="formRef"
      :model="form"
      label-width="0px"
      size="small"
      style="width: 100%;"
      class="table-form-wrapper">
      <el-table
        border
        :data="renderList"
        :header-cell-style="{background: '#F5F6F9'}">
        <el-table-column
          prop="warehouse"
          label="仓库/分库"
          align="center">
        </el-table-column>
        <el-table-column
          prop="cur_qty"
          label="流通数量(手)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="number0fHands"
          label="交割数量(手)"
          align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop=" 'list.'+ scope.$index + '.numberOfHands'">
              <el-input
                v-model="scope.row.numberOfHands"
                placeholder="请输入"
                :disabled="isDetail"
                style="width:100%"
                @blur="handleDeliveryNumBlur(scope.row)" />
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <!-- 超过10条则分页展示 -->
      <div v-if="form.list.length > 10" class="pagination-wrap">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="pageSizeList"
          :total="form.list.length"
          @current-change="handlePageNumChange"
          @size-change="handleSizeChange">
        </el-pagination>
      </div>
      <div class="section-separtor">手动添加部分</div>
      <el-button
        type="primary"
        size="mini"
        @click="handleAdd">新增</el-button>
      <el-table
        border
        :data="renderManuallyList"
        row-key="uuid"
        :header-cell-style="{background: '#F5F6F9'}"
        style="margin-top: 10px">
        <el-table-column
          prop="warehouse"
          label="仓库/分库"
          align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="'manuallyList.' + scope.$index + '.warehouse'"
              :rules="{ required: true,validator:validateWarehouse, record: scope.row, trigger: 'change'}">
              <el-select
                v-model="childRow.warehouse"
                filterable
                :disabled="isDetail"
                style="width: 100%"
                @change="handleSelectChange(scope.row)">
                <el-option
                  v-for="item in warehouseList"
                  :key="item.wh_name"
                  :label="item.wh_name"
                  :value="item.wh_name">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="numberOfHands"
          label="交割数量(手)"
          align="center">
          <template slot-scope="scope">
            <el-form-item
              :prop="'manuallyList.' + scope.$index + '.numberOfHands'"
              :rules="{ required: true,validator:validateNumberOfHands, record: scope.row, trigger: ['change','blur']}">
              <el-input
                v-model="childRow.numberOfHands"
                :disabled="isDetail"
                style="width: 100%" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="opt"
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="form.manuallyList.length>10"
        class="pagination-wrap">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="pageNum2"
          :page-size="pageSize2"
          :page-sizes="pageSizeList"
          :total="form.manuallyList.length"
          @current-change="handlePageNumChange2"
          @size-change="handleSizeChange2">
        </el-pagination>
      </div>
    </el-form>
    <div
      slot="footer"
      style="text-align: center">
      <el-button
        type="primary"
        @click="handleOk">确认</el-button>
      <el-button
        style="margin-left: 36px"
        @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { warehouseQuery,dceDeliveryWhQuery } from '@/server/deliveryApply'
import { hasDuplicateField } from '../../util'
let uuid = 0
let queryUUid = 0
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    listData: {
      type: Array,
      default: () => []
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    baseInfo: {
      type:Object,
      default: () => ({})
    },
    varietyTbInfo:{
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      form: {
        list: [],
        manuallyList: []
      },
      pageNum: 1,
      pageSize: 10,
      pageSizeList: [10,20,50,100],
      pageNum2: 1,
      pageSize2: 10,
      warehouseList: [],
    }
  },
  computed: {
    renderList() {
      const startIndex = (this.pageNum - 1) * this.pageSize;
      const endIndex = this.pageNum * this.pageSize;
      return this.form.list.slice(startIndex, endIndex);
    },
    renderManuallyList() {
      const startIndex = (this.pageNum2 - 1) * this.pageSize2;
      const endIndex = this.pageNum2 * this.pageSize2;
      return this.form.manuallyList.slice(startIndex,endIndex);
    },
    deliveryVariety() {
      return this.baseInfo.deliveryVariety
    },
    deliveryUnitHand() {
      return this.varietyTbInfo.delivery_unit_hand
    },
  },
  watch: {
    visible(newVal){
      if (newVal) {
        this.pageNum = 1
        this.pageSize = 10
        this.pageNum2 = 1
        this.pageSize2 = 10
        uuid = 0
        this.fetchList()
        this.form.manuallyList = this.listData.filter(v => v.inputType !== '0').map(item => ({ ...item, uuid: `uuid-${++uuid}`}))
      }
    }
  },
  created( ) {
    this.fetchList()
    this.fetchDeliveryWh()
  },
  methods: {
    async fetchList() {
      queryUUid = 0
      const res = await warehouseQuery({ variety_id: this.deliveryVariety,trade_code: this.baseInfo.tranCode })
      this.form.list = (res.data || []).map(item => {
        return {
          inputType: '0',
          cur_qty: item.cur_qty,
          warehouse: item.wh_name || '',
          number0fHands: '',
          uuid:`query-uuid-${++queryUUid}`
        }
      })
    },
    async fetchDeliveryWh() {
      const res = await dceDeliveryWhQuery({
        variety_id: this.deliveryVariety
      })
      this.warehouseList = res.data || []
    },
    validateWarehouse(rule, value, callback) {
      value = rule.record.warehouse
      if (!value) {
        callback(new Error('请选择仓库'))
      } else {
        callback()
      }
    },
    validateNumberOfSheets(rule, value, callback) {
      value = rule.record.numberOfHands
      const regex = /^[1-9]\d*$/
      if (!value) {
        callback(new Error('请输入交割数量'))
      } else if (!regex.test(value)) {
        callback(new Error('交割数量需为正整数'))
      } else if (value % this.deliveryUnitHand !== 0){
        rule.record.number0fSheets = ''
        callback(new Error(`请输入交割单位:${this.deliveryUnitHand}的整数倍`))
      } else {
        callback( )
      }
    },
    handleSelectChange(record) {
      // 校验仓库/分库是否和查询结果或已选择内容重复
      const isExistList = this.form.list.filter(v => v.warehouse &&v.numberOfHands).some(v => v.warehouse === record.warehouse)
      const isExistList2 = this.form.manuallyList.filter(v => v.uuid !== record.uuid).some(v => v.warehouse === record.warehouse)
      const isExist = isExistList || isExistList2
      if (isExist) {
        this.$Message.error('存在重复仓库,添加不成功。')
        record.warehouse = ''
        return
      }
    },
    handleDeliveryNumBlur(record) {
      if (!record.number0fHands) {
        return
      }
      const regex = /^[1-9]\d*$/
      if (!regex.test(record.number0fHands)) {
        this.$Message.error('交割数量需为正整数')
        record.numberOfHands = ''
        return
      }
      // 是否为交割单位的整数倍,非整数倍则toast提示“请输入交割单位:x的整数倍。”并清空填写内容
      if (record.number0fHands % this.deliveryUnitHand !== 0){
        this.$Message.error(`请输入交割单位:${this.deliveryUnitHand}的整数倍。`)
        record.numberOfHands = ''
        return
      }
      // 需判断客户填写交割数量是否小于等于当前仓库/分库的流通数量,若大于则toast提示“交割数量需小于流通数量。”并清空填写内容。;
      if (record.number0fHands > Number(record.cur_qty)) {
        this.$Message.error('交割数量需小于流通数量')
        record.numberOfHands = ''
        return
      }
    },
    handleAdd() {
      this.form.manuallyList.push({
        inputType: '1',
        uuid:`uuid-${++uuid}`,
        warehouse:'',
        numberOfHands: ''
      })
    },
    handleDeleteRow(row) {
      this .form.manuallyList = this.form.manuallyList.filter(v => v.uuid !== row.uuid)
      if (this.form.manuallyList.length % this.pageSize2 === 0 && this.pageNum2 >1) {
        this.pageNum2 -= 1
      }
    },
    // 改变当前页码
    handlePageNumChange(val) {
      this.pageNum = val;
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
    },
    handlePageNumChange2(val) {
      this.pageNum2 = val;
    },
    handleSizeChange2(val) {
      this.pageNum2 = 1;
      this.pageSize2 = val;
    },
    handle0k(){
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.form.manuallyList.some(item => (!item.warehouse || !item.number0fHands))){
            this.$Message.error('请完整填写手动添加内容。')
            return
          }
          if (this.form.list.every(item => !item.numberOfHands) && this.form.manuallyList.length === 0){
            this.$Message.error('请输入至少一项交割数量。')
            return
          }

          const filterList = this.form.list.filter(item => item.warehouse && item.numberOfHands)
          const listData = filterList.concat(this.form.manuallyList)
          if (hasDuplicateField(listData, 'warehouse')) {
            this.$Message.error('存在重复仓库，请删除重复项。')
            return
          }
          this.$emit('ok', listData)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.section-separtor {
  padding: 10px 0;
  position: relative;
  text-align: center;
  overflow: hidden;
  color:black;
  &::before{
    content:'';
    position: absolute;
    top: 50%;
    left: 0px;
    width: 43%;
    height: 1px;
    border-top: 1px dashed■#DCDFE6;
  }
  &::after {
    content:'';
    position: absolute;
    top: 50%;
    right: 0;
    width: 43%;
    height: 1px;
    border-top: 1px dashed■#DCDFE6;
  }
}
</style>