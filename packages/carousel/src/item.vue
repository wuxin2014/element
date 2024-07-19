<template>
  <div
    v-show="ready"
    class="el-carousel__item"
    :class="{
      'is-active': active,
      'el-carousel__item--card': $parent.type === 'card',
      'is-in-stage': inStage,
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
        animating: false
      };
    },

    methods: {
      processIndex(index, activeIndex, length) {
        if (activeIndex === 0 && index === length - 1) {
          return -1; // 放置到最左侧
        } else if (activeIndex === length - 1 && index === 0) {
          return length; // 放置到最右侧
        } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
          return length + 1; // 放置到右侧+1
        } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
          return -2; // 放置到左侧-1
        }
        return index;
      },
      /**
       * 什么规律，看不出来，
       * 一开始el-carousel-item 都是绝对定位元素width: 50%，left: 0,top: 0,z-index: 0
       * 假设容器宽度980，item的宽度样式设置为50%，也就是容器宽度的一半即980/2 = 490
       * 1. 若在容器正中央，需水平偏移(980-490)/2 = 980/4
       * 2. 若在容器右侧，需水平偏移490 + (490 - 490 * 0.83)/2 = 980/4 * 2 + 980/4 * (1-0.83)
       * 3. 若在容器左侧，需水平偏移(490*0.83 - 490) / 2 = 980/4 * (0.83 - 1) = -41.65
       * 
       * 右侧加1项： 980 - (490*0.83 - 490) / 2 = 938.35
       * 左侧加1项： -490 + (490*0.83 - 490) / 2 = -448.35
       *
       */
      calcCardTranslate(index, activeIndex) {
        const parentWidth = this.$parent.$el.offsetWidth;
        if (this.inStage) {
          return parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4;
        } else if (index < activeIndex) {
          return -(1 + CARD_SCALE) * parentWidth / 4;
        } else {
          return (3 + CARD_SCALE) * parentWidth / 4;
        }
      },

      calcTranslate(index, activeIndex, isVertical) {
        const distance = this.$parent.$el[isVertical ? 'offsetHeight' : 'offsetWidth'];
        return distance * (index - activeIndex); // 往左跟往右
      },
      // 重点方法
      translateItem(index, activeIndex, oldIndex) {
        const parentType = this.$parent.type;
        const parentDirection = this.parentDirection;
        const length = this.$parent.items.length;
        if (parentType !== 'card' && oldIndex !== undefined) {
          this.animating = index === activeIndex || index === oldIndex;
        }
        if (index !== activeIndex && length > 2 && this.$parent.loop) {
          index = this.processIndex(index, activeIndex, length);
        }
        if (parentType === 'card') {
          // 卡片类型轮播平移计算
          if (parentDirection === 'vertical') {
            console.warn('[Element Warn][Carousel]vertical direction is not supported in card mode');
          }
          this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1; // 是否在台上
          this.active = index === activeIndex; // 当前项是否为活跃项
          this.translate = this.calcCardTranslate(index, activeIndex); // 平移计算
          this.scale = this.active ? 1 : CARD_SCALE; // 激活item不缩放，其他项缩放
        } else {
          // 普通类型轮播平移计算
          this.active = index === activeIndex;
          const isVertical = parentDirection === 'vertical';
          this.translate = this.calcTranslate(index, activeIndex, isVertical);
          this.scale = 1;
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
