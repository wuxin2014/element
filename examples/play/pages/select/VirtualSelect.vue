<template>
  <el-select
    ref="selectRef"
    v-model="selectValue"
    filterable
    :filter-method="filterMethod"
    @visible-change="visibleChange"
    @change="handleSelectChange">
    <virtual-list
      ref="virtualList"
      class="virtualselect-list"
      :data-key="field.value"
      :data-sources="filterOptions"
      :data-component="itemComponent"
      :keeps="20"
      :estimate-size="34"
      :extra-props="{
        labelKey: field.label,
        valueKey: field.value
      }">
    </virtual-list>
  </el-select>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import VirtualOption from './VirtualOption.vue'

export default {
  name: 'VirtualSelect',
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
      itemComponent: VirtualOption,
      selectValue: this.value,
      filterOptions: this.optionList,
    }
  },
  watch: {
    value(newVal) {
      this.selectValue = newVal
    },
    optionList: {
      handler(newVal) {
        this.filterOptions = newVal
      },
    },
  },
  methods: {
    resetVirtualList() {
      this.filterOptions = this.optionList
      if (this.$refs.virtualList) {
        this.$refs.virtualList.reset()
        this.$refs.virtualList.scrollToOffset(0)
      }
    },
    filterMethod(query) {
      if (!query) {
        this.resetVirtualList()
        return
      }
      this.filterOptions = this.optionList.filter(item => item[this.field.value].toLowerCase().includes(query.toLowerCase()))
    },
    // el-select下拉组件增加filterable会出现点击收回图标下拉选项收不回的bug
    // filterable属性下，点击一次select选择框之后会导致select组件获得焦点,并且如果后续在页面中没有其他操作,select组件不会失去焦点,点击其他地方下拉框展开了
    visibleChange (visible) {
      if (visible) {
        this.$refs.selectRef.focus();
        // const idx = this.filterOptions.findIndex(item => item[this.field] === this.selectValue)
        // if (idx > -1 && this.$refs.virtualList) {
        //   this.$refs.virtualList.scrollToIndex(idx)
        // }
      } else {
        this.$refs.selectRef.blur();
        this.resetVirtualList()
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
.virtualselect {
  // 设置最大高度
  &-list {
    max-height:245px;
    overflow-y:auto;
  }
  .el-scrollbar .el-scrollbar__bar.is-vertical {
    width: 0;
  }
}
</style>