<template>
  <div
    v-show="ready"
    class="el-carousel__item"
    :class="{
      'is-active': active,
      'el-carousel__item--card': $parent.type === 'card',
      'is-in-stage': inStage,
      'specialIndex': specialIndex,
      'is-hover': hover,
      'is-animating': animating
    }"
    @click="handleItemClick"
    :style="itemStyle">
    <div
      v-if="$parent.type === 'card'"
      v-show="!active"
      class="el-carousel__mask">
    </div>
    <slot></slot>
  </div>
</template>
 
<script>
  import { autoprefixer } from 'element-ui/src/utils/util';
  //const CARD_SCALE = 0.83;
  export default {
    name: 'ElCarouselItem',
    props: {
      name: String,
      label: {
        type: [String, Number],
        default: ''
      },
    },
 
    data() {
      return {
        hover: false,
        translate: 0,
        scale: 1,
        active: false,
        ready: false,
        inStage: false,
        specialIndex: false,
        animating: false
      };
    },
 
    methods: {
      processIndex(index, activeIndex, length) {
        let index_ = -10;
        if (activeIndex == 0) {
          switch(index) {
            case length - 2:
              index_ =-2;
              break;
            case length - 1:
              index_ = -1;
              break;
            case activeIndex:
              index_ = 0;
              break;
            case 1:
              index_ = 1;
              break;
            case 2:
              index_ = 2;
              break;
            default:
              index_ = -10;
          }
          return index_;
        } 
        if(activeIndex == 1) {
          switch(index){
            case length-1: index_=-2; break;
            case 0: index_=-1; break;
            case activeIndex: index_=0; break;
            case 2: index_=1; break;
            case 3: index_=2; break;
            default:
              index_=-10;
          }
          return index_;
        } else if(activeIndex == length-2){
          switch(index){
            case length-4: index_=-2; break;
            case length-3: index_=-1; break;
            case activeIndex: index_=0; break;
            case length-1: index_=1; break;
            case 0: index_=2; break;
            default:
              index_=-10;
          }
         return index_;
        }else if(activeIndex == length-1){
          switch(index){
            case length-3: index_=-2; break;
            case length-2: index_=-1; break;
            case activeIndex: index_=0; break;
            case 0: index_=1; break;
            case 1: index_=2; break;
            default:
              index_=-10;
          }
          return index_;
        }else if(activeIndex >= 2) {
          switch(index){
            case activeIndex-2: index_=-2; break;
            case activeIndex-1: index_=-1; break;
            case activeIndex: index_=0; break;
            case activeIndex+1: index_=1; break;
            case activeIndex+2: index_=2; break;
            default:
              index_=-10;
          }
          return index_;
        }
      },
 
      calcCardTranslate(index, activeIndex) {
        const parentWidth = this.$parent.$el.offsetWidth;
        if(index == 0){
          return parentWidth*(0.5-0.22/2)
        }else if(Math.abs(index) == 1){
          return index>0?parentWidth*(0.5+0.22/2-0.08):parentWidth*(0.5-(0.28-0.08+0.22/2));
        }else{
          return index>0?parentWidth*(0.5+0.22/2+0.28-0.08-0.13):parentWidth*(0.5-(0.28-0.08+0.22/2)-(0.28-0.13));
        }
      },
 
      calcTranslate(index, activeIndex, isVertical) {
        const distance = this.$parent.$el[isVertical ? 'offsetHeight' : 'offsetWidth'];
        return distance * (index - activeIndex);
      },
 
      translateItem(index, activeIndex, oldIndex) {
        const parentType = this.$parent.type;
        const parentDirection = this.parentDirection;
        const length = this.$parent.items.length;
        if (parentType !== 'card' && oldIndex !== undefined) {
          this.animating = index === activeIndex || index === oldIndex;
        }
        index = this.processIndex(index, activeIndex, length);
        if (parentType === 'card') {
          if (parentDirection === 'vertical') {
            console.warn('[Element Warn][Carousel]vertical direction is not supported in card mode');
          }
          this.inStage = Math.round(Math.abs(index)) <= 1;
          this.specialIndex = Math.round(Math.abs(index)) >= 3;
          this.active = index === 0;
          this.translate = this.calcCardTranslate(index, activeIndex);
          this.scale = Math.abs(index)==0 ? 1 : Math.abs(index)==1? 0.9 : Math.abs(index)==2? 0.8 : 0.7;
        } else {
          this.active = index === activeIndex;
          const isVertical = parentDirection === 'vertical';
          this.translate = this.calcTranslate(index, activeIndex, isVertical);
        }
        this.ready = true;
      },
 
      handleItemClick() {
        const parent = this.$parent;
        if (parent && parent.type === 'card') {
          const index = parent.items.indexOf(this);
          parent.setActiveItem(index);
        }
      }
    },
 
    computed: {
      parentDirection() {
        return this.$parent.direction;
      },
 
      itemStyle() {
        const translateType = this.parentDirection === 'vertical' ? 'translateY' : 'translateX';
        const value = `${translateType}(${ this.translate }px) scale(${ this.scale })`;
        const style = {
          transform: value
        };
        return autoprefixer(style);
      }
    },
 
    created() {
      this.$parent && this.$parent.updateItems();
    },
 
    destroyed() {
      this.$parent && this.$parent.updateItems();
    }
  };
</script>
<style lang="scss">
  .el-carousel__item--card {
      width: 28%;
  }
  .el-carousel__arrow--left {
    left: 15px;
  }
  .el-carousel__arrow--right {
    right: 15px;
  }
  .el-carousel__item {
    cursor: pointer;
    z-index: 1;
  }
  .el-carousel__item--card.is-in-stage {
    z-index: 2;
    .el-carousel__mask{
      display: none;
    }
  }
  .el-carousel__item--card.is-active {
    z-index: 3;
    width: 22%;
  }
  .specialIndex{
    z-index: 0
  }
</style>
