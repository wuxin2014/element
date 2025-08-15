<template>
  <div>
    <input ref="fileInput" type="file" style="display:none" accept=".xls,.xlsx" @change="handleFileChange" />
    <el-button :size="size" :loading="importLoading" @click="handleFileUpload">
      <i class="el-icon-upload"></i>
      附件上传
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    businessType: {
      type: String,
      default: ''
    },
    sheet: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'mini'
    },
  },
  data() {
    return {
      importLoading: false
    }
  },
  methods: {
    // 点击上传附件
    handleFileUpload() {
      this.$refs.fileInput.value = null
      this.$refs.fileInput.click()
    },
    handleFileChange(e) {
      if (e.target.files.length === 0) return
      const file = e.target.files[0]
      console.log('file', file)
      if (!file) {
        this.$Message.error('请上传附件!')
        return
      }
      const suffixName = file.name.split('.').pop()
      if (!suffixName || !['xlsx', 'xls'].includes(suffixName)) {
        this.$Message.error('附件格式错误，请重新上传!')
        return
      }
      this.handleExcelImport(file);
    },
    handleExcelImport(file) {
      this.importLoading = true
      let param = new FormData();
      param.append('business_type', this.businessType)
      param.append('sheet', this.sheet)
      param.append('file', file)
      excelImport(param).then(res => {
        const result = res.data || []
        this.$emit('success', result)
      }).finally(() => {
        this.importLoading = false
      })
    }
  }
}
</script>