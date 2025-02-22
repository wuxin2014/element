<template>
  <el-dialog
    width="720px"
    :title="title"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="88px"
      @submit.native.prevent>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item
            label="交易所："
            prop="exchange_code">
            <el-select
              v-model="form.exchange_code"
              placeholder="请选择"
              style="width: 100%;"
              :disabled="modalType === 'update'"
              @change="handleExchangeChange">
              <el-option
                v-for="item in exchangeList"
                :key="item.exchange_code"
                :label="item.exchange_name"
                :value="item.exchange_code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="品种"
            prop="variety_code">
            <el-select
              v-model="form.variety_code"
              placeholder="请选择"
              style="width: 100%;"
              :disabled="modalType === 'update'"
              @change="handleVarietyChange">
              <el-option
                v-for="item in varietyList"
                :key="item.variety_code"
                :label="item.variety_name"
                :value="item.variety_code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-for="(item, index) in form.list"
        :key="index"
        :gutter="24">
        <el-col :span="12">
          <el-form-item
            :label="`预警值${onlyOne ? '' : index + 1}:`"
            :prop="'list.' + index + '.warningVal'"
            :rules="[
              { required: onlyOne, message: '请输入预警值', trigger: 'blur' },
              { validator: validateWarningVal, originVal: item.originVal, trigger: 'blur' },
            ]">
            <el-input v-model="item.warningVal" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="`合约${onlyOne ? '' : index + 1}:`"
            :prop="'list.' + index + '.inst_id'"
            :rules="{
              required: onlyOne, message: '请选择合约', trigger: 'change'
            }">
            <el-select
              v-model="item.inst_id"
              multiple
              clearable
              placeholder="请选择合约"
              style="width: 100%;">
              <el-option
                v-for="inst in item.instList"
                :key="inst"
                :label="inst"
                :value="inst">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      slot="footer"
      style="text-align: center; padding-top: 20px">
        <el-button
          type="primary"
          @click="handleOK">确认</el-button>
        <el-button
          style="margin-left: 40px"
          @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modalType: {
      type: String,
      default: 'create'
    },
    editItem: {
      type: Object,
      default: () => ({})
    },
    selectedList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        checked: false,
        exchange_code: '',
        exchange_name: '',
        variety_code: '',
        variety_name: '',
        list: []
      },
      rules: {
        exchange_code: { required: true, message: '请选择交易所', trigger: 'blur' },
        variety_code: { required: true, message: '请选择品种', trigger: 'blur' },
      },
      exchangeList: [
        { exchange_code: 'CFFEX', exchange_name: '中金所' },
        { exchange_code: 'CZCE', exchange_name: '郑商所' },
        { exchange_code: 'DCE', exchange_name: '大商所' },
        { exchange_code: 'GFEX', exchange_name: '广期所' },
        { exchange_code: 'INE', exchange_name: '能源所' },
        { exchange_code: 'SHEF', exchange_name: '上期所' }
      ],
      varietyList: []
    }
  },
  computed: {
    title() {
      return this.modalType === 'update' ? '修改' : '添加'
    },
    onlyOne() {
      return this.form.list.length === 1
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.handleReset()
        return;
      }
      if (this.modalType === 'update') {
        this.form = this.editItem
      }
    }
  },
  methods: {
    validateWarningVal(rule, value, callback) {
      if (!value || !/^[1-9]\d*$/.test(value)) {
        callback(new Error('请输入正整数'))
      } else if (Number(value) > Number(rule.originVal)) {
        callback(new Error('输入值不能大于原始值'))
      } else {
        callback()
      }
    },
    handleReset() {
      this.form = {
        checked: false,
        exchange_code: '',
        exchange_name: '',
        variety_code: '',
        variety_name: '',
        list: []
      }
      setTimeout(() => {
        this.$refs.ruleForm.clearValidate()
      }, 0)
    },
    handleClose() {
      this.$emit('close')
    },
    handleExchangeChange() {
      this.form.exchange_name = this.exchangeList.find(item => item.exchange_code === this.form.exchange_code).exchange_name
      this.form.variety_code = ''
      this.form.list = []
      if (this.form.exchange_code === 'CFFEX') {
        this.varietyList = [
          { variety_code: 'MA', variety_name: '乙醇MA' },
          { variety_code: 'HA', variety_name: '哈HA' }
        ]
      } else {
        this.varietyList = [{ variety_code: 'SA', variety_name: '甲醇SA' }]
      }
    },
    handleVarietyChange() {
      this.form.variety_name = this.varietyList.find(item => item.variety_code === this.form.variety_code).variety_name
      if (this.form.variety_code === 'MA') {
        this.form.list = [
          { id: '12', originVal: '10', warningVal: '10', inst_id: [], instList: ['123', '121', '122'] },
          { id: '1', originVal: '6', warningVal: '6', inst_id: [], instList: ['135', '114', '127'] },
          { id: '14', originVal: '3', warningVal: '3', inst_id: [], instList: ['151', '142', '128'] }
        ]
      } else {
        this.form.list = [
          { id: '19', originVal: '10', warningVal: '10', inst_id: [], instList: ['123', '121', '122'] },
        ]
      }
    },
    handleOK() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const flag = this.form.list.some(item => item.warningVal && item.inst_id.length > 0)
          if (!flag) {
            return this.$message.error('至少一条12222')
          }
          let warningList = this.form.list.filter(item => item.warningVal && item.inst_id.length > 0)
          warningList.forEach(item => {
            item.inst_id.sort((a, b) => a - b)
          })

          let isExist = false;
          const findItem = this.selectedList.find(item => item.exchange_code === this.form.exchange_code && item.variety_code === this.form.variety_code)
          if (findItem) {
            for(let wItem of warningList) {
              const findA = findItem.list.find(item => item.id === wItem.id)
              if (findA && wItem.inst_id.some(id => findA.inst_id.includes(id))) {
                isExist = true;
                break;
              }
            }
          }

          if (isExist) {
            return this.$message({
              type: 'error',
              message: '已添加过，会保留最新数据',
              onClose: () => {
                this.$emit('ok', { ...this.form, list: warningList })
              }
            })
          }

          this.$emit('ok', { ...this.form, list: warningList })
        } else {
          return false;
        }
      });
    }
  }
}
</script>