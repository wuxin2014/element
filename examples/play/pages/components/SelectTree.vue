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
      type: [Array, String],
      default: ''
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
      checkedKeys: [],
      checkedNames: [],
      list: []
    }
  },
  computed: {
    showLabel() {
      const checkedLen = this.checkedNames.length
      return (checkedLen === 0 || this.list.length === checkedLen) ? '全部' : this.checkedNames.join(';')
    }
  },
  watch: {
    treeList: {
      handler(newVal) {
        this.initData()
      }
    }
  },
  mounted() {
    this.initData()
    this.initCheckedData()
  },
  methods: {
    initData() {
      const list = handleData(this.treeList, [])
      this.list = list
    },
    initCheckedData() {
      let checkedKeys = []
      let checkedNames = []
      this.list.forEach(item => {
        checkedKeys.push(item.id)
        checkedNames.push(item.label)
      })
      this.checkedKeys = checkedKeys
      this.checkedNames = checkedNames
    },
    handleOK() {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      console.log(checkedNodes, checkedKeys);
      if (checkedKeys.length > 0) {
        this.checkedNames = checkedNodes.map(item => item.label)
        this.$emit('input', checkedKeys)
      }
      this.visible = false
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
}
</style>