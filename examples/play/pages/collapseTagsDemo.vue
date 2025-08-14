<template>
  <div>
    <collapseTagsTooltip :optionList="optionList" :multiple="true" />
  </div>
</template>

<script>
import collapseTagsTooltip from './collapseTagsTooltip.vue'
export default {
  components: {
    collapseTagsTooltip
  },
  data() {
    return {
      optionList: []
    }
  },
  mounted() {
    this.optionList = Array(30).fill(0).map((_, index) => ({ label: `选项${index}`, value: index + 1}))
  },
}
</script>