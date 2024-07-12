<template>
  <div>
    <!-- 方案一 -->
    <div class="step-wrap">
      <div v-for="(step, index) in stepList" :key="index" class="step-item"  :class="{active: index <= active}">
        <div class="desc-wrap">
          <span class="title">{{ index + 1 }}</span>
          <span class="description">{{ step.name }}</span>
        </div>
        <div class="step__line" :class="{active: index < active}"></div>
      </div>
    </div>
    <!-- 方案二 -->
    <div style="width: 500px">
      <step-list :active="active" :stepList="stepList"/>
    </div>
    <el-button @click="handleNext">下一步</el-button>
  </div>
</template>
  
<script>
  import StepList from './components/CustomStep.vue'
  export default {
    name: 'App',
    components: {
      StepList
    },
    data() {
      return {
        active: 0,
        stepList: [
          { id: 1, name: 'Text1hahaha' },
          { id: 2, name: 'Text2' },
          { id: 3, name: 'Text3' },
        ]
      }
    },
    methods: {
      handleNext() {
        if (this.active === this.stepList.length - 1) {
          this.active = 0
        } else {
          this.active++;
        }
      }
    }
  }
</script>
  
<style lang="scss" scoped>
  body {
    padding: 0;
    margin: 0;
    position: relative;
  }
  
  #app {
    padding: 10px;
  }

  .step-wrap {
    display: flex;
    width: 400px;
  }
  .step-item {
    display: flex;
    color: #c0c4cc;
    border-color: #c0c4cc;
    flex: 1;
    &.active {
      color: red;
      border-color: red;
    }

    &:last-of-type {
      .step__line {
        display: none;
      }
    }
    
    .desc-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 16px;
      font-weight: 700;
    }

    .title {
      font-size: 14px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid;
      color: inherit;
    }

    .step__line {
      background-color: #c0c4cc;
      height: 2px;
      width: 100%;
      margin-top: 11px;
      &.active {
        background-color: red;
      }
    }
  }
</style>
  
  