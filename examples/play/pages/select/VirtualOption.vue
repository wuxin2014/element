<template>
  <el-option
    :key="source[valueKey]"
    :label="source[labelKey]"
    :value="source[valueKey]">
  </el-option>
</template>
<script>
export default {
  name: 'VirtualOption',
  props: {
    index: {
      type: Number
    },
    source: {
      type: Object,
      default () {
        return {}
      }
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    valueKey: {
      type: String,
      default: 'value',
    },
  }
}
</script>