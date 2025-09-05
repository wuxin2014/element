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
          prop="numberOfHands"
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
        :data="form.manuallyList"
        row-key="categoryUUid"
        :header-cell-style="{background: '#F5F6F9'}"
        style="margin-top: 10px">
        <el-table-column
          prop="deliverType"
          label="交割库/车板场所"
          align="center"
          width="180">
          <template slot-scope="scope">
            <div v-if="deliverType.length === 1">{{ deliverType[0] === 'A' ? '交割库':'车板场所' }}</div>
            <el-form-item
              :prop="'manuallyList.' + scope.$index + '.deliverType'"
              :rules="{ required: true, message: '请选择', trigger: 'change'}">
              <el-select
                v-model="scope.row.deliverType"
                :disabled="isDetail"
                style="width: 100%"
                @change="handleTypeChange(scope.row)">
                <el-option
                  v-for="item in [{ lable: '交割库', value: 'A' }, { lable: '车板场所', value: 'C' }]"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          prop="table"
          label="子表"
          class-name="has-child">
          <!-- :render-header="renderHeader" -->
          <template slot="header">
            <div style="width: 100%; display: flex">
              <div style="width: 300px; text-align: center; flex-shrink: 0; flex-grow: 0">仓库</div>
              <div style="width: 230px; text-align: center; flex-shrink: 0; flex-grow: 0">交割数量(手)</div>
              <div style="width: 200px; text-align: center; flex-shrink: 0; flex-grow: 0">操作</div>
            </div>
          </template>
          <template slot-scope="scope">
            <el-table
              :data="scope.row.details"
              class="child-table"
              row-key="uuid"
              :show-header="false">
              <el-table-column
                prop="warehouse"
                label="仓库"
                align="center"
                width="300">
                <template slot-scope="{row: childRow, $index}">
                  <el-form-item
                    :prop="'manuallyList.' + scope.$index + '.details.' + $index + '.warehouse'"
                    :rules="{ required: true,validator:validateWarehouse, record: childRow, trigger: 'change'}">
                    <el-select
                      v-model="childRow.warehouse"
                      filterable
                      :disabled="isDetail"
                      style="width: 100%"
                      @change="handleSelectChange(scope.row, childRow)">
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
                align="center"
                width="230px">
                <template slot-scope="{row: childRow, $index}">
                  <el-form-item
                    :prop="'manuallyList.' + scope.$index + '.details.' + $index + '.numberOfHands'"
                    :rules="{ required: true,validator:validateNumberOfHands, record: childRow, trigger: ['change','blur']}">
                    <el-input
                      v-model="childRow.numberOfHands"
                      :disabled="isDetail"
                      style="width: 100%" />
                  </el-form-item>
                </template>
              </el-table-column> 
              <el-table-column label="操作" align="center" width="100px">
                <template slot-scope="{row: childRow, $index}">
                  <el-button type="text" @click="handleChildAdd(scope.row)">新增</el-button>
                  <el-button type="text" @click="handleChildDelete(scope.row, childRow)">删除</el-button>
                </template>
              </el-table-column> 
            </el-table>
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
import { hasDuplicateField } from '../../utils'
let uuid = 0
let queryUUid = 0
let categoryUUid = 0
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
    deliveryType: {
      type: Array,
      default: () => []
    }
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
      warehouseList: [],
      childColumn: [
        {
          label:'仓库',
          key: 'warehouse',
          width:'300px'
        },
        {
          label:'交割数量(手)',
          key: 'numberOfHands',
          width:'200px'
        },
        {
          label:'操作',
          key: 'optBtn',
          width: '120px',
        }
      ]
    }
  },
  computed: {
    renderList() {
      const startIndex = (this.pageNum - 1) * this.pageSize;
      const endIndex = this.pageNum * this.pageSize;
      return this.form.list.slice(startIndex, endIndex);
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
        uuid = 0
        categoryUUid = 0
        this.fetchList()
        const userAddList = this.listData.filter(v => v.inputType !== '0')
        const groupList = []
        userAddList.forEach(item => {
          const findItem = groupList.find(v => v.deliveryType === item.deliveryType)
          if (findItem) {
            findItem.details.push({
              uuid:`uuid-${++uuid}`,
              warehouse: item.warehouse || '',
              numberOfHands: item.numberOfHands || ''
            })
          } else {
            groupList.push({
              categoryUUid:`categoryUUid-${++categoryUUid}`,
              deliverType: item.deliverType || '',
              inputType: '1',
              details: [{
                uuid:`uuid-${++uuid}`,
                warehouse: item.warehouse || '',
                numberOfHands: item.numberOfHands || ''
              }]
            })
          }
        })
        this.form.manuallyList = groupList
      }
    }
  },
  created( ) {
    this.fetchList()
    this.fetchDeliveryWh()
  },
  methods: {
    renderHeader(h) {
      const childTable = this.childColumn.map((item) => {
        return h('div',
          {
            style: {
              width: item.width,
              padding: "0 10px",
              textAlign: "center",
              flexShrink: 0,
              flexGrow: 0,
            },
          },
          item.label
        );
      });
      return h('div',
        {
          style: {
            display: 'flex'
          },
        },
        childTable
      );
    },
    async fetchList() {
      queryUUid = 0
      const res = await warehouseQuery({ variety_id: this.deliveryVariety,trade_code: this.baseInfo.tranCode })
      this.form.list = (res.data || []).map(item => {
        return {
          inputType: '0',
          deliveryType: 'A',
          cur_qty: item.cur_qty,
          warehouse: item.wh_name || '',
          numberOfHands: '',
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
    handleTypeChange(record) {
      const filterList = this.form.manuallyList.filter(v => record.categoryUUid !== record.categoryUUid)
      if (filterList.some(v => v.deliverType === record.deliverType)) {
        record.deliverType = ''
        this.$Message.error('当前交割库/车板场所已存在，若要添加多个仓库，可通过【操作】列进行【新增】操作')
      }
    },
    handleSelectChange(record, childRecord) {
      let isExistList = false
      if (record.deliverType === 'A') {
        isExistList = this.form.list.filter(v => v.warehouse && v.numberOfHands).some(v => v.warehouse === childRecord.warehouse)
      }
      // 校验仓库/分库是否和查询结果或已选择内容重复
      const isExistList2 = this.form.manuallyList.filter(v => v.uuid !== record.uuid).some(v => v.warehouse === childRecord.warehouse)
      const isExist = isExistList || isExistList2
      if (isExist) {
        this.$Message.error('存在重复仓库,添加不成功。')
        childRecord.warehouse = ''
        return
      }
    },
    handleDeliveryNumBlur(record) {
      if (!record.numberOfHands) {
        return
      }
      const regex = /^[1-9]\d*$/
      if (!regex.test(record.numberOfHands)) {
        this.$Message.error('交割数量需为正整数')
        record.numberOfHands = ''
        return
      }
      // 是否为交割单位的整数倍,非整数倍则toast提示“请输入交割单位:x的整数倍。”并清空填写内容
      if (record.numberOfHands % this.deliveryUnitHand !== 0){
        this.$Message.error(`请输入交割单位:${this.deliveryUnitHand}的整数倍。`)
        record.numberOfHands = ''
        return
      }
      // 需判断客户填写交割数量是否小于等于当前仓库/分库的流通数量,若大于则toast提示“交割数量需小于流通数量。”并清空填写内容。;
      if (record.numberOfHands > Number(record.cur_qty)) {
        this.$Message.error('交割数量需小于流通数量')
        record.numberOfHands = ''
        return
      }
    },
    handleAdd() {
      if ((this.deliveryType.length === 1 && this.manuallyList.length === 1) || this.manuallyList.length >= 2) {
        this.$Message.error('当前仅支持新增单个交割库/车板场所。')
        return
      }
      this.form.manuallyList.push({
        categoryUUid:`categoryUUid-${++categoryUUid}`,
        deliverType: this.deliveryType.length === 1 ? this.deliveryType[0] : '', // ,
        inputType: '1',
        details: [{
          uuid:`uuid-${++uuid}`,
          warehouse:'',
          numberOfHands: ''
        }]
      })
    },
    handleChildAdd(row) {
      row.details.push({
        uuid:`uuid-${++uuid}`,
        warehouse:'',
        numberOfHands:''
      })
    },
    handleChildDelete(row, childRow) {
      if (row.details.length === 1) {
        this.form.manuallyList = this.form.manuallyList.filter(item => item.categoryUUid !== row.categoryUUid)
      } else {
        row.details = row.details.filter(item => item.uuid !== childRow.uuid)
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
          if (this.form.manuallyList.some(item => (!item.warehouse || !item.numberOfHands))){
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