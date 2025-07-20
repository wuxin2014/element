<template>
  <div class="multiple-select-wrap">
    <el-select
      ref="selectRef"
      :value="selected"
      multiple
      collapse-tags
      @remove-tag="handleRemoveTag"
      @visible-change="visibleSelect">
      <el-option value="all" label="全部" @click.native="handleAllChange">
      </el-option>
      <el-option
        v-for="(item) in optionDataList"
        :value="item[field.value]"
        :label="item[field.label]"
        :key="item[field.value]"
        :class="{selected: checkAll || selectedList.includes(item[field.value])}"
        @click.native="handleOptionItemClick(item)">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'MultipleSelect',
  props: {
    value: {
      type: Array,
      default: () => []
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
      default: false
    }
  },
  data() {
    return {
      optionDataList: [],
      checkAll: false,
      selectedList: [],
    }
  },
  watch: {
    optionList: {
      handler(newVal) {
        console.log(newVal)
        this.optionDataList = newVal.map(item => ({ ...item }))
        // this.selectedList = newVal.map(item => item[this.field.value]) // 若默认选择全部需要打开注释
      },
      immediate: true,
    },
    value: {
      handler(newVal) {
        this.selectedList = newVal.map(item => item[this.field.value])
        this.checkAll = this.optionDataList.length === this.selectedList.length
      },
      immediate: true,
    },
  },
  computed: {
    selected() {
      if (this.selectedList.length === this.optionDataList.length) {
        return ['all']
      } else {
        return this.selectedList
      }
    }
  },
  methods: {
    // el-select下拉组件增加filterable会出现点击收回图标下拉选项收不回的bug
    // filterable属性下，点击一次select选择框之后会导致select组件获得焦点,并且如果后续在页面中没有其他操作,select组件不会失去焦点,点击其他地方下拉框展开了
    visibleSelect (flag) {
      if (flag) {
        this.$refs.selectRef.focus();
      } else {
        this.$refs.selectRef.blur();
      }
    },
    handleAllChange() {
      if (!this.checkAll) {
        this.checkAll = true
        this.selectedList = this.optionDataList.map(item => item[this.field.value])
      } else {
        this.checkAll = false
        this.selectedList = []
      }
      this.$emit('input',this.selectedList)
    },
    handleOptionItemClick(item) {
      console.log(item)
      const isExist = this.selected.includes(item[this.field.value])
      if (isExist) {
        this.selectedList = this.selectedList.filter(code => code !== item[this.field.value])
      } else {
        this.selectedList.push(item[this.field.value])
      }
      this.checkAll = this.selectedList.length === this.optionDataList.length
      this.$emit('input', this.selectedList)
      this.$emit('change', this.selectedList, { value: item[this.field.value] })
    },
    handleRemoveTag(val) {
      this.checkAll = false;
      if (val === 'all') {
        this.selectedList = [];
      } else {
        this.selectedList = this.selectedList.filter(code => code !== val)
      }
      this.$emit('input', this.selectedList);
    },
  }
}
</script>
<style lang="scss" scoped>
.multiple-select-wrap {
  width: 100%;
  ::v-deep .el-select .el-tag__close.el-icon-close {
    display: none;
  }
}
</style>