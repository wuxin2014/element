<template>
  <div class="step-list">
    <div v-for="(step, index) in stepList" :key="index" class="step-item"  :class="{active: index <= active}">
      <div class="step-head">
        <span class="step-title">{{ index + 1 }}</span>
        <div class="step__line" :class="{active: index < active}"></div>
      </div>
      <div class="step-description">{{ step.name }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StepList',
  props: {
    stepList: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
}
</script>
<style lang="scss" scoped>
.step-list {
  width: 100%;
  display: flex;
  .step-item {
    flex: 1;
    font-size: 16px;
    font-weight: 700;
    color: #c0c4cc;
    border-color: #c0c4cc;
    &.active {
      color: red;
      border-color: red;
    }
    
    .step-title {
      font-size: 14px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid;
      color: inherit;
      margin: 0 auto;
      background-color: #fff;
    }

    .step-description {
      text-align: center;
    }
    .step-head {
      display: flex;
      width: 100%;
      position: relative;
      .step__line {
        position: absolute;
        background-color: #c0c4cc;
        height: 2px;
        // width: 100%;
        top: 11px;
        left: 70%; // 50%
        right: -30%; // -50%
        z-index: -10;
        &.active {
          background-color: red;
        }
      }
    }

    &:last-of-type {
      .step__line {
        display: none;
      }
    }
  }
}
</style>