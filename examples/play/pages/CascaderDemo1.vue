<template>
  <div ref="comp" style="padding: 20px 0">
    <el-form :model="searchForm" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="searchForm.effect_date"
              type="daterange"
              range-separator="~"
              start-placeholder="开始曰期"
              end-placeholder="结束日期"
              format="yyyyMMdd"
              value-format="yyyyMMdd"
              :pickerOptions="startPickerOptions"
              :append-to-body="true"
              :offset="-100"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="过期时间">
            <el-date-picker
              v-model="searchForm.expire_date"
              type="daterange"
              range-separator="~"
              start-placeholder="开始曰期"
              end-placeholder="结束日期"
              format="yyyyMMdd"
              value-format="yyyyMMdd"
              :pickerOptions="endPickerOptions"
              :append-to-body="true"
              :offset="0"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="级联选项">
            <!-- placement="bottom-end" :offset="210" align="right" :arrowOffset="400" :append-to-body="false" popper-class="custom-popper-class"-->
            <el-cascader
              ref="cascaderRef"
              v-model="searchForm.value"
              :props="props"
              :options="options"
              style="width: 100%"
              @change="handleChange">
            </el-cascader>
            <!-- <el-cascader :options="options">
              <template slot-scope="{ node, data }">
                <span>{{ data.label }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      props: {
        // multiple: true
        multiple: false
      },
      searchForm: {
        value: [],
        effect_date: [],
        expire_date: []
      },
      startPickerOptions: {
        disabledDate(time) {
          // return that.$moment(time).format('YYYYMMDD') < that.$moment().subtract(1, 'years').format('YYYYMMDD')
        }
      },
      endPickerOptions: {
        disabledDate(time) {
          // return that.$moment(time).format('YYYYMMDD') > that.$moment().add(1, 'years').format('YYYYMMDD')
        }
      },
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                }, 
                {
                  value: 'fankui',
                  label: '反馈'
                }
              ]
            }
          ]
        }
      ],
      popperOptions: { gpuAcceleration: true, removeOnDestroy: true },
    }
  },
  mounted() {
    this.popperOptions = { ...this.popperOptions, boundariesElement: this.$refs.comp };
    // this.$nextTick(()=>{
    //   this.$refs.cascaderRef.updatePopper()
    // })
  },
  methods: {
    handleChange(val) {
      console.log('val===', val)
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  position: relative;
  margin: 0;
  padding: 0;
}
.custom_poper_class {
  position: absolute !important;
  left: 0 !important;
}
.el-cascader-menu__hover-zone {
  display: none; // 级联hover选择卡顿问题
}
</style>