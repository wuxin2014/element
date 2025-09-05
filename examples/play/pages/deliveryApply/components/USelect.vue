<template>
  <el-select
    ref="select"
    v-model="selectVal"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :popper-append-to-body="false"
    popper-class="custom_poper class"
    style="width: 100%"
    @visible-change="visibleChange"
    @change="handleSelectChange">
    <slot>
      <el-option
        v-for="item in options"
        :key="item[fields.value]"
        :label="item[fields.label]"
        :value="item[fields.value]">
      </el-option>
    </slot>
  </el-select>
</template>

<script>
export default {
  props: {
    filterable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    fields: {
      type: Object,
      default: () => ({label: 'label', value:'value'})
    },
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectVal: ''
    }
  },
  watch:{
    value(newVal) {
      this.selectVal = newVal
    }
  },
  mounted() {
    this.selectVal= this.value
  },
  methods: {
    visibleChange(visible) {
      if (!this.filterable) return
      if (visible) {
        this.$refs.select.focus()
      } else {
        this.$refs.select.blur()
      }
      this.$emit('visible-change',visible)
    },
    handleSelectChange() {
      this.$emit('input', this.selectVal)
      this.$nextTick(() => {
        this.$emit('change', this.selectVal)
      })
    }
  }
}
</script>
