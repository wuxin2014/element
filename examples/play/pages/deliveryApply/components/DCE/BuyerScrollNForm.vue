<template>
  <div class="form-container">
    <div class="columnTitle">买方意向信息</div>
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
      <el-row v-if="isOptionalIntentionWarehouse" :gutter="48">
        <el-col :span="8">
          <el-form-item
            label="第一意向仓库/分库"
            prop="oneWarehouse">
            <el-input
              v-model="form.oneWarehouse"
              placeholder="请输入"
              style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="第二意向仓库/分库"
            prop="twoWarehouse">
            <el-input
              v-model="form.twoWarehouse"
              placeholder="请输入"
              style="width: 100%" />
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
        oneWarehouse: '',
        twoWarehouse: '',
      },
      rules: {
        deliveryQuantity: { required: true, message: '请输入交割数量', trigger: 'blur' },
        standardWeight: { required: true, message: '请先输入交割数量', trigger: 'change' },
        payment: { required: true, message: '请先输入交割数量', trigger: 'change' },
      },
    }
  },
  computed: {
    // 可选择意向库
    isOptionalIntentionWarehouse() {
      return this.varietyTbInfo.optional_intention_warehouse === 'Y'
    }
  },
  mounted() {
    if (this.$route.query.missionCode) {
      // eslint-disable-next-line no-unused-vars
      const { remarks,...rest } = this.$parent.$parent.getFormDetailInfo() || {}
      this.form = { ...this.form,...rest}
    }
  },
  methods: {
    handleCompare(curField, compareField) {
      if (this.form[curField] && this.form[compareField] && this.form[curField] === this.form[compareField]) {
        this.form[curField] = ''
        this .$Message.error('已存在该意向仓库/分库，请重新填写')
      }
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