<template>
  <div style="position: relative" @click.stop v-clickoutside="handleClose">
    <div class="wrap" @click="visible = !visible">
      <div class="label-wrap">
        请选择
      </div>
      <i class="el-icon-arrow-down" style="font-size: 14px; color: #c0c4cc;"></i>
    </div>
    <div v-if="visible" class="popper">
      <el-tree
        ref="tree"
        show-checkbox
        node-key="id"
        :data="treeList"
        :props="defaultProps"
        :default-checked-keys="checkedKeys">
      </el-tree>
      <div class="btn-wrap">
        <el-button type="primary" @click="handleOK">确定</el-button>
        <el-button @click="visible = false" style="margin-left: 24px;">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside';
const handleData = (arrayTree, result = []) => {
  if (!arrayTree) return;
  arrayTree.forEach((item) => {
    item.children && handleData(item.children, result)
    result.push(item);
  });
  return result
}
export default {
  props: {
    treeList: {
      type: Array,
      default: []
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
      checkedKeys: []
    }
  },
  mounted() {
    const list = handleData(this.treeList, [])
    this.checkedKeys = list.map(item => item.id)
  },
  methods: {
    handleOK() {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      console.log(checkedNodes, checkedKeys);
      if (checkedKeys.length > 0) {
        // this.$emit()
      }
    },
    handleClose() {
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
}
</style>