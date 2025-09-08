<template>
  <div class="form-container">
    <el-form ref="formRef" :model="form" :rules="rules" size="small" label-position="top">
      <el-row :gutter="48">
        <el-col :span="8">
          <el-form-item label="交割数量" prop="deliveryQuantity">
            <div style="display: flex">
              <el-input
                v-model="form.deliveryQuantity"
                :disabled="isDetail"
                style="width: 100%"
                @blur="handleDeliveryNumBlur">
                <template slot="append">手</template>
              </el-input>
              <span
                v-if="form.numberOfSheets"
                style="padding: 0 6px;background:#F5F7FA;margin-left: 4px;">={{form.numberOfSheets}}(张)</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标准重量" prop="standardWeight">
            <el-input v-model="form.standardWeight" disabled>
              <template slot="append">{{ varietyTbInfo.weight_unit }}</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="payment">
            <span slot="label">估算货款<span style="color: red; font-size:12px">(按标准重量及交割月合约最新结算价计算)</span></span>
            <el-input v-model="form.payment" disabled>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="columnTitle">客户联系人信息</div>
      <el-row :gutter="48">
        <el-col :span="8">
          <el-form-item prop="contactPerson">
            <el-input v-model="form.contactPerson" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="phone">
            <el-input v-model="form.phone" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mixins } from '../../util/mixins'
export default {
  mixins: [mixins],
  data() {
    return {
      form: {
        deliveryQuantity: '',
        numberOfSheets: '',
        standardWeight: '',
        payment: '',
        contactPerson: '',
        phone: '',
      },
      rules: {
        deliveryQuantity: { required: true, message: '请输入交割数量', trigger: 'blur' },
        standardWeight: { required: true, message: '请先输入交割数量', trigger: 'change' },
        payment: { required: true, message: '请先输入交割数量', trigger: 'change' },
      },
    }
  },
  mounted() {
    if (this.$route.query.missionCode) {
      const { remarks, ...rest } = this.$parent.$parent.getFormDetailInfo() || {}
      this.form = { ...this.form, ...rest }
    }
  },
  methods: {
    handleRadioChange() {
      if (this.form.finalReturn === '是') {
        this.$messageBox.alert('请确定意向仓单无权利瑕疵,如申报冻结仓单处于折抵状态,请提交交割解折申请,如处于作为保证金状态,请提交解除作为保证金申请。', '提示', {
          confirmButtonText: '确认',
          showClose: false,
          customClass: 'online-web-confirm-box',
          confirmButtonClass: 'space-margin-left'
        }).then(() => {
        })
      } else {
        this.form.declarationFreeze = ''
      }
    },
    getFormData() {
      return { ...this.form }
    },
    resetForm() {
      this.$refs.formRef.resetFields()
    },
    validateForm(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          callback(true)
        } else {
          callback(null)
        }
      })
    }
  }
}
</script>