<template>
  <div style="position: relative" @click.stop v-clickoutside="handleClose">
    <div class="wrap" @click="visible = !visible">
      <div class="label-wrap">
        {{ showLabel }}
      </div>
      <i class="el-icon-arrow-down" style="font-size: 14px; color: #c0c4cc;"></i>
    </div>
    <transition name="el-fade-in">
      <div v-show="visible" class="popper">
        <!-- indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果 -->
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleAllChange">全部</el-checkbox>
        <el-scrollbar
          tag="div"
          wrap-class="select-tree-dropdown-wrap"
          ref="scrollbar">
          <el-tree
            ref="tree"
            show-checkbox
            node-key="id"
            :data="treeList"
            :props="defaultProps"
            :default-checked-keys="checkedKeys"
            @check="handleTreeChange">
          </el-tree>
        </el-scrollbar>
        <div class="btn-wrap">
          <el-button type="primary" @click="handleOK">确定</el-button>
          <el-button @click="visible = false" style="margin-left: 24px;">取消</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import Clickoutside from 'element-ui/libs/utils/clickoutside';
import Clickoutside from 'element-ui/src/utils/clickoutside';
const handleData = (arrayTree, result = []) => {
  if (!arrayTree) return;
  arrayTree.forEach((item) => {
    const { children, ...rest } = item
    children && handleData(children, result)
    result.push(rest);
  });
  return result
}
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    treeList: {
      type: Array,
      default: () => []
    }
  },
  directives: { Clickoutside },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      visible: false,
      list: [],
      checkedKeys: [],
      checkedAll: false,
      showLabel: '全部',
      isIndeterminate: true
    }
  },
  watch: {
    treeList: {
      handler(newVal) {
        const list = handleData(newVal, [])
        this.list = list
        this.initData()
      },
      immediate: true
    },
    visible(newVal) {
      if (!newVal) return
      if (this.value.length === 0) {
        this.initData()
      } else {
        this.checkedKeys = this.value;
        this.setCheckedKeys(this.checkedKeys)
        this.$nextTick(() => {
          const checkedCount = this.getCheckedNodes().length 
          this.checkedAll = checkedCount === this.list.length
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
        })
      }
    }
  },
  mounted() {
  },
  methods: {
    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys();
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    setCheckedKeys(checkedKeys) {
      this.$refs.tree.setCheckedKeys(checkedKeys);
    },
    initData() {
      this.checkedAll = true
      this.showLabel = '全部'
      this.checkedKeys = this.list.map(item => item.id)
      this.isIndeterminate = false
    },
    handleAllChange() {
      if (this.checkedAll) {
        this.checkedKeys = this.list.map(item => item.id)
      } else {
        this.checkedKeys = []
      }
      this.setCheckedKeys(this.checkedKeys)
      this.isIndeterminate = false;
    },
    handleTreeChange(v1, v2) {
      console.log(v1, v2)
      const checkedCount = v2.checkedNodes.length 
      this.checkedAll = checkedCount === this.list.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
    },
    handleOK() {
      const checkedNodes = this.getCheckedNodes()
      if (checkedNodes.length === 0) {
        this.$message.error('至少选择一项')
        return
      }
      let checkedIds = []
      let labelList = []
      checkedNodes.filter(item => !!item.pid).forEach(item => {
        checkedIds.push(item.id)
        labelList.push(item.label)
      })
      this.showLabel = this.checkedAll ? '全部' : labelList.join(';')
      this.$emit('input', checkedIds)
      this.visible = false
    },
    handleClose() {
      document.querySelector('.select-tree-dropdown-wrap').scrollTo(0, 0)
      this.visible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  padding: 0 12px;
  box-sizing: border-boX;
  height: 32px;
  color: #606266;
  cursor: pointer;
  width: 100%;
  .label-wrap {
    display: flex;
    flex: 1 1 0%;
    overflow: hidden;
    flex-flow: nowrap;
    height: 100%;
  }
}
.popper {
  position: absolute;
  left: 0;
  top: 40px;
  z-index: 1000;
  border: 1px solid #DCDFE6;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;

  .btn-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
  }

  ::v-deep .select-tree-dropdown-wrap {
    max-height: 240px;
  }
}
</style>