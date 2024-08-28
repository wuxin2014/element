<template>
  <div style="padding: 10px">
    <el-form :model="form" :rules="rules" label-width="100px" ref="formRef">
      <el-row>
        <el-col :span="8">
          <el-form-item label="科目" prop="subject">
            <multiple-select
              v-model="form.subject"
              :option-list="options"
              :field="{label: 'label', value: 'code'}">
            </multiple-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标签" prop="tag">
            <el-select
              v-model="form.tag"
              value-key="code">
              <el-option
                v-for="item in options"
                :key="item.code"
                :label="item.label"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="40px">
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import MultipleSelect from './components/CustomMultipleSelect.vue'
export default {
  components: {
    MultipleSelect
  },
  data() {
    return {
      options: [
        { code: 'HTML', label: 'HTML', name: 'HTML' }, 
        { code: 'CSS', label: 'CSS', name: 'HTML' }, 
        { code: 'JavaScript', label: 'JavaScript', name: 'HTML' },
        { code: 'HTML2', label: 'HTML2', name: 'HTML' }, 
        { code: 'CSS2', label: 'CSS2', name: 'HTML' }, 
        { code: 'JavaScript2', label: 'JavaScript2', name: 'HTML' },
        { code: 'HTML3', label: 'HTML3', name: 'HTML' }, 
        { code: 'CSS3', label: 'CSS3', name: 'HTML' }, 
        { code: 'JavaScript3', label: 'JavaScript3', name: 'HTML' }
      ],
      form: {
        subject: ['all'],
        tag: null
      },
      rules: {
        subject: [{ type: 'array', required: true, message: '请至少选择一个科目', trigger: 'change' }],
        tag: [{ type: 'object', required: true, message: '请选择文章标签', trigger: 'change' }]
      }
    }
  },
  mounted() {
  },
  methods: {
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log(this.form)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
body {
    position: relative;
    margin: 0;
    padding: 0;
}
</style>