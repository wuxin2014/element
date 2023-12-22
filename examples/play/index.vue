<template>
  <div style="padding: 18px;">
    <h2>Element-UI调试</h2>
    <el-select v-model="tag">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div v-if="tag" style="margin-top: 20px; border: 1px solid royalblue; padding: 10px;">
      <component :is="tag"></component>
    </div>
  </div>
</template>

<script>
import FormDemo from './pages/FormDemo'
import DialogDemo from './pages/DialogDemo'
import TableSortDemo from './pages/TableSortDemo'
import CarouselDemo from './pages/CarouselDemo'
import TooltipDemo from './pages/TooltipDemo.vue'
export default {
  components: {
    FormDemo,
    DialogDemo,
    TableSortDemo,
    CarouselDemo,
    TooltipDemo
  },
  data() {
    return {
      tag: 'FormDemo',
      options: [
        {
          value: 'FormDemo',
          label: '基础表单'
        }, 
        {
          value: 'CarouselDemo',
          label: '轮播图'
        },
        {
          value: 'TableSortDemo',
          label: '表格排序'
        },
        {
          value: 'DialogDemo',
          label: '弹窗'
        },
        {
          value: 'TooltipDemo',
          label: 'TooltipDemo'
        }
      ]
    };
  },
  methods: {}
};
</script>

<style>
.custom-popper-class {
  position: absolute !important;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
