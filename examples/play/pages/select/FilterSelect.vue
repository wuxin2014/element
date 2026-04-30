<template>
  <el-select
    ref="selectRef"
    v-model="selectValue"
    filterable
    :filter-method="filterMethod"
    @visible-change="visibleChange"
    @change="handleSelectChange">
    <el-option
      v-for="(item) in filterOptions"
      :value="item[field.value]"
      :label="item[field.label]"
      :key="item[field.value]">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'FilterSelect',
  props: {
    value: {
      type: String,
      default: ''
    },
    optionList: {
      type: Array,
      default: () => []
    },
    field: {
      type: Object,
      default: () => ({ label: 'label', value: 'value' })
    },
    filterable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sliceSize: 500,
      selectValue: this.value,
      filterOptions: this.optionList.slice(0, this.sliceSize),
    }
  },
  watch: {
    value(newVal) {
      this.selectValue = newVal
    },
    optionList: {
      handler(newVal) {
        console.log(newVal)
        this.filterOptions = newVal.slice(0, this.sliceSize)
      },
    },
  },
  methods: {
    filterMethod(query) {
      if (!query) {
        this.filterOptions = this.optionList.slice(0, this.sliceSize)
        return
      }
      const filterList = this.optionList.filter(item => item[this.field.value].toLowerCase().includes(query.toLowerCase()))
      this.filterOptions = filterList.slice(0, this.sliceSize)
    },
    // el-select下拉组件增加filterable会出现点击收回图标下拉选项收不回的bug
    // filterable属性下，点击一次select选择框之后会导致select组件获得焦点,并且如果后续在页面中没有其他操作,select组件不会失去焦点,点击其他地方下拉框展开了
    visibleChange (visible) {
      if (visible) {
        this.$refs.selectRef.focus();
      } else {
        this.$refs.selectRef.blur();
      }
      this.$emit('visible-change', visible)
    },
    handleSelectChange() {
      this.$emit('input', this.selectValue)
      this.$nextTick(() => {
        this.$emit('change', this.selectValue)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>