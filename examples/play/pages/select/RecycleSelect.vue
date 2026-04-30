<template>
  <el-select
    v-model="value"
    filterable
    :filter-method="handleFilter"
    @visible-change="handleVisibleChange"
  >
    <el-option label=" " value=" ">
      <RecycleScroller
        class="scroller"
        :items="showOptions"
        :item-size="44"
        key-field="value"
      >
        <template #default="{ item }">
          <div class="list-item">{{ item.label }}</div>
        </template>
      </RecycleScroller>
    </el-option>
  </el-select>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default {
  components: {
    RecycleScroller
  },
  data() {
    return {
      value: '',
      allOptions: [],
      showOptions: []
    }
  },
  created() {
    // 模拟大数据
    this.allOptions = Array.from({length: 5000}, (_, i) => ({
      id: i,
      label: `选项 ${i + 1}`
    }))
    this.showOptions = [...this.allOptions]
  },
  methods: {
    // 搜索过滤
    handleFilter(query) {
      if (!query) {
        this.showOptions = [...this.allOptions]
        return
      }
      this.showOptions = this.allOptions.filter(item => item.label.includes(query))
    },
    // 下拉展开自动定位选中项
    handleVisibleChange(visible) {
      if (!visible) return
      // 找到当前选中在筛选后列表里的索引
      const idx = this.showOptions.findIndex(item => item.id === this.value)
      if (idx === -1) return
      // 直接精准滚动，库原生支持首次定位
      this.$nextTick(() => {
        this.$refs.scroller.scrollToIndex(idx)
      })
    }
  }
}
</script>

<style scoped>
.scroller {
  height: 300px;
}
.list-item {
  height: 44px;
  line-height: 44px;
  padding: 0 12px;
}
</style>