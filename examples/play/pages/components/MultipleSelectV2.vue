<template>
  <div class="multiple-select-wrap">
    <el-select
      ref="selectRef"
      :value="selected"
      multiple
      collapse-tags
      @remove-tag="handleRemoveTag"
      @visible-change="visibleSelect">
      <el-option value="all" label="全部">
        <el-checkbox v-model="optionsAll" @change="handleOptionAllChange">
          全部
        </el-checkbox>
      </el-option>
      <el-option
        v-for="(item) in optionsData"
        :value="item[field.value]"
        :label="item[field.label]"
        :key="item[field.value]"
        :class="{selected: optionsAll || selectedOptions.includes(item[field.value])}"
      >
        <el-checkbox
          :value="item.check"
          @change="(checked) => handleOptionItemChange(checked, item)">
          {{ item[field.label] }}
        </el-checkbox>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'MultipleSelectV2',
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
      optionsData: [],
      optionsAll: true,
      selectedOptions: [],
    }
  },
  watch: {
    optionList: {
      handler(newVal) {
        console.log(newVal)
        this.optionsData = newVal.map(item => ({...item, check: true}))
        this.selectedOptions = newVal.map(item => item[this.field.value])
      },
      immediate: true,
      // deep: true, // deep 深度
    },
  },
  computed: {
    selected() {
      if (this.selectedOptions.length === this.optionsData.length) {
        return ['all']
      } else {
        return this.selectedOptions
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
    handleOptionAllChange(isAll) {
      if (isAll) {
        this.optionsData.forEach((elm) => {
          elm.check = true
          this.selectedOptions.push(elm[this.field.value])
        })
      } else {
        this.optionsData.forEach((elm) => {
          elm.check = false
        })
        this.selectedOptions = []
      }
      this.$emit('input',this.selectedOptions)
    },
    handleOptionItemChange(checked, item) {
      console.log(item)
      item.check = checked
      if (!checked) {
        this.selectedOptions = this.selectedOptions.filter(v => v !== item[this.field.value])
      } else {
        this.selectedOptions.push(item[this.field.value])
      }
      this.optionsAll = this.selectedOptions.length === this.optionsData.length
      this.$emit('input', this.selectedOptions)
    },
    handleRemoveTag(val) {
      console.log(val)
      if (val === 'all') {
        this.selectedOptions = [];
        this.optionsData.forEach((elm) => {
          elm.check = false
        })
      } else {
        this.selectedOptions = this.selectedOptions.filter(v => v !== val)
        this.optionsData.forEach((elm) => {
          if (elm[this.field.value] === val) {
            elm.check = false
          }
        })
      }
      this.$emit('input', this.selectedOptions);
    },
  }
}
</script>
<style lang="scss" scoped>
.multiple-select-wrap {
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
    content: '';
  }
  .el-checkbox {
    width: 100%;
    padding: 0 30px;
    .el-checkbox__label {
      margin-left: 20px;
    }
  }
  
  .el-select-dropdown__item {
    padding: 0;
  }

  ::v-deep .el-select .el-tag__close.el-icon-close {
    display: none;
  }

  .el-tag.el-tag--info {
    background: transparent;
    border: 0;
  }
 
  .el-select {
    .el-select__tags {
      flex-wrap: nowrap;
      overflow: hidden;
    }
    .el-tag {
      background-color: #fff;
      border: none;
      color: #606266;
      font-size: 13px;
      padding-right: 0;
      & ~ .el-tag {
        margin-left: 0;
      }
      &:not(:last-child)::after {
        content: ',';
      }
    }
  }
}
</style>