scss: 为了少打点字，下面就简称 block: b | element: e | modifier: m

carousel走马灯一次轮播(显示)5张图片
https://blog.csdn.net/weixin_58860430/article/details/126781582

显示三张卡片。
三张卡片高度跟随容器，宽度为容器的 50%。
左右两张卡片缩放了 83% 大小。
左右两张卡片 z-index 为 1；中间卡片 z-index 为 2。

### 子项 使用绝对定位，position: absolute; left: 0; top: 0; height: 100%; width为父容器的50%；


Monorepo 的全称是 monolithic repository，即单体式仓库，与之对应的是 Multirepo(multiple repository
Monorep 是把所有相关的 package 都放在一个仓库里进行管理，每个 package 独立发布

堆叠式 & 卡片式
```
<script>
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
  const CARD_SCALE = 0.83;
  export default {
    name: 'ElCarouselItem',
 
    props: {
      name: String,
      label: {
        type: [String, Number],
        default: ''
      }
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
        if(activeIndex == 0) {
          return index==1?1:index==2?2:index==3?-3:index==4?-2:index==5?-1:0
        }
        if(activeIndex == 1) {
          return index==2?1:index==3?2:index==4?-3:index==5?-2:index==0?-1:0
        }
        if(activeIndex == 2) {
          return index==3?1:index==4?2:index==5?-3:index==0?-2:index==1?-1:0
        }
        if(activeIndex == 3) {
          return index==4?1:index==5?2:index==0?-3:index==1?-2:index==2?-1:0
        }
        if(activeIndex == 4) {
          return index==5?1:index==0?2:index==1?-3:index==2?-2:index==3?-1:0
        }
        if(activeIndex == 5) {
          return index==0?1:index==1?2:index==2?-3:index==3?-2:index==4?-1:0
        }
      },

      processIndex2(index, activeIndex) {
        // console.log('activeIndex', activeIndex, index)
        // console.log('index', index)
        if (activeIndex == 0) {
            return index == 1 ? 1 : index == 2 ? 2 : index == 3 ? -2 : index == 4 ? -1 : 0
        }
        if (activeIndex == 1) {
            return index == 2 ? 1 : index == 3 ? 2 : index == 4 ? -2 : index == 0 ? -1 : 0
        }
        if (activeIndex == 2) {
            return index == 3 ? 1 : index == 4 ? 2 : index == 0 ? -2 : index == 1 ? -1 : 0
        }
        if (activeIndex == 3) {
            return index == 4 ? 1 : index == 0 ? 2 : index == 1 ? -2 : index == 2 ? -1 : 0
        }
        if (activeIndex == 4) {
            return index == 0 ? 1 : index == 1 ? 2 : index == 2 ? -2 : index == 3 ? -1 : 0
        }
      },
 
      calcCardTranslate(index, activeIndex) {
        return index * 80 * 2
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
          this.scale = Math.abs(index)==0 ? 1 : Math.abs(index)==1? 0.83 : Math.abs(index)==2? 0.73 : Math.abs(index)==3? 0.65 : 0.58;
        } else {
          this.active = index === activeIndex;
          const isVertical = parentDirection === 'vertical';
          this.translate = this.calcTranslate(index, activeIndex, isVertical);
        }
        this.ready = true;
      },

      translateItem2 (index, activeIndex, oldIndex) {
        const parentType = this.$parent.type
        const parentDirection = this.parentDirection
        const length = this.$parent.items.length
        if (parentType !== 'card' && oldIndex !== undefined) {
            this.animating = index === activeIndex || index === oldIndex
        }
        index = this.processIndex(index, activeIndex, length)
        if (parentType === 'card') {
            if (parentDirection === 'vertical') {
            console.warn('[Element Warn][Carousel]vertical direction is not supported in card mode')
            }
            this.inStage = Math.round(Math.abs(index)) <= 1
            this.specialIndex = Math.round(Math.abs(index)) >= 3
            this.active = index === 0
            this.translate = this.calcCardTranslate(index, activeIndex)
            this.scale = Math.abs(index) == 0 ? 1 : Math.abs(index) == 1 ? 0.9 : Math.abs(index) == 2 ? 0.76 : 0.62
        } else {
            this.active = index === activeIndex
            const isVertical = parentDirection === 'vertical'
            this.translate = this.calcTranslate(index, activeIndex, isVertical)
        }
        this.ready = true
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
<style>
  .el-carousel__arrow--left {
    left: -426px
  }
  .el-carousel__arrow--right {
    right: -25px;
  }
  .el-carousel__item {
    cursor: pointer;
    z-index: 1;
  }
  .el-carousel__item--card.is-in-stage {
    z-index: 2;
  }
  .el-carousel__item--card.is-active {
    z-index: 3;
  }
  .specialIndex{
    z-index: 0
  }
</style>
```