<template>
  <div class="multiple-select-wrap">
    <el-select
      ref="selectRef"
      v-model="selectVal"
      multiple
      collapse-tags 
      clearable
      @visible-change="visibleSelect"
      @remove-tag="handleRemoveTag"
      @clear="handleClear">
      <li class="search_input" v-if="optionList.length > 0">
        <el-input ref="searchInput" v-model.trim="searchText" @input="handleSearch" placeholder="搜索" size="small"></el-input>
      </li>
      <el-option v-if="optionList.length > 0" label="全部" value="all" @click.native="handleItemClick({ value: 'all' })"></el-option>
      <el-option
        v-for="item in optionList"
        :key="item[field.value]"
        :label="item[field.label]"
        :value="item[field.value]" 
        @click.native="handleItemClick(item)">
      </el-option>
      <li v-if="showEmpty" class="el-select-dropdown__empty">无匹配数据</li>
    </el-select>
  </div>
</template>

<script>
// import Clickoutside from 'element-ui/libs/mixins/emitter';
import Emitter from 'element-ui/src/mixins/emitter';
export default {
  name: 'MultipleSelect',
  props: {
    value: {
      type: Array,
      default: []
    },
    optionList: {
      type: Array,
      default: []
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
  mixins: [Emitter],
  data() {
    return {
      searchText: '',
      selectVal: []
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.selectVal = newVal.map(item => item);
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    showEmpty() {
      return this.searchText && this.$refs.selectRef.filteredOptionsCount === 0
    }
  },
  methods: {
    // handleSearch: debounce(function() {
    //   this.broadcast('ElOption', 'queryChange', this.searchText);
    // }, 200),
    handleSearch() {
      this.$refs.selectRef.handleQueryChange(this.searchText);
      // this.broadcast('ElOption', 'queryChange', this.searchText);
    },
    // el-select下拉组件增加filterable会出现点击收回图标下拉选项收不回的bug
    // filterable属性下，点击一次select选择框之后会导致select组件获得焦点,并且如果后续在页面中没有其他操作,select组件不会失去焦点,点击其他地方下拉框展开了
    visibleSelect (flag) {
      if (!this.filterable) {
        this.searchText = ''
        this.broadcast('ElOption', 'queryChange', this.searchText);
        return
      };
      if (flag) {
        this.$refs.selectRef.focus();
      } else {
        this.$refs.selectRef.blur();
      }
    },
    handleItemClick(data) {
      if (this.searchText) {
        this.$refs.searchInput.focus()
        this.searchText = ''
        this.broadcast('ElOption', 'queryChange', this.searchText);
      }
      const isExistAll = this.selectVal.includes('all');
      if (data.value && data.value === 'all') {
        if (!isExistAll && this.selectVal.length !== 0) {
          this.selectVal = [];
        } else {
          this.selectVal = this.optionList.map(item => item[this.field.value]);
          this.selectVal.unshift('all');
        }
        this.$emit('input', this.selectVal);
        return;
      }

      if (isExistAll) {
        this.selectVal = this.selectVal.filter(code => code !== 'all');
      } else if (this.selectVal.length === this.optionList.length) {
        this.selectVal.unshift('all');
      }
      this.$emit('input', this.selectVal);
    },
    handleRemoveTag(val) {
      if (val === 'all') {
        this.selectVal = [];
      }
      this.$emit('input', this.selectVal);
    },
    handleClear() {
      this.$emit('input', this.selectVal);
    }
  }
}
</script>
<style lang="scss" scoped>
.search_input {
  width: 100%;
  padding: 6px 10px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
  background-color: #fff;
  box-sizing: border-box;
}
// 当前项目例子不生效
::v-deep .el-select-dropdown__list {
  padding-top: 44px;
}
</style>
<style>
.el-select-dropdown__list {
  padding-top: 44px;
}
</style>