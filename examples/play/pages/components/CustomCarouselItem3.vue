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
    <div v-if="$parent.type === 'card'" v-show="!active" class="el-carousel__mask">
    </div>
    <slot></slot>
  </div>
</template>
 
<script>
import { autoprefixer } from 'element-ui/src/utils/util';
const CARD_SCALE = 0.83;
const CARD_SCALE2 = 0.7;
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
      animating: false,
      opacity: 1
    };
  },

  methods: {
    /**
     * 非无缝轮播
     * 画图才好理解,可见元素是5个
     * 数组列表：[0,1,2,3,4,5,6]，length = 7
     * activeIndex = 0，展示[5 6 0 1 2], 3 4视情况再排布
     * activeIndex = 1，展示[6 0 1 2 3], 4 5视情况再排布
     * activeIndex = 2，展示[0 1 2 3 4], 5 6视情况再排布
     * activeIndex = 3，展示[1 2 3 4 5], 6 0视情况再排布
     * activeIndex = 4，展示[2 3 4 5 6], 0 1视情况再排布
     * activeIndex = 5，展示[3 4 5 6 0], 1 2视情况再排布
     * activeIndex = 6，展示[4 5 6 0 1], 2 3视情况再排布
     */
    processIndex(index, activeIndex, length) {
      // console.log('processIndex', activeIndex, index);
      if ((activeIndex === 0 && index === length - 1) || (activeIndex === 1 && index === 0)) {
        return -1; // 放置到展示台上左侧
      } else if ((activeIndex === 0 && index === length - 2) || (activeIndex === 1 && index === length - 1) || index + 2 === activeIndex) {
        return -2; // 放置到展示台上最左侧
      } else if ((activeIndex === length - 1 && index === 0) || (activeIndex === length - 2 && index === 0)) {
        return length; // 放置到展示台上右侧
      } else if ((activeIndex === length - 1 && index === 1) || (activeIndex === length - 2 && index === 1)) {
        return length + 1; // 放置到展示台上最右侧
      } else if (index < activeIndex - 2 && activeIndex - index >= length / 2) {
        return length + 2; // 放置到右侧+2(台外)
      } else if (index > activeIndex + 2 && index - activeIndex >= length / 2) {
        return -3; // 放置到左侧-2(台外)
      }
      return index;
    },
    // item项目宽度设置为父级宽度的20% 也就是1/5
    calcCardTranslate(index, activeIndex, length) {
      const parentWidth = this.$parent.$el.offsetWidth;
      let itemWidth = parentWidth / 5;
      if (this.inStage) {
        if (index === activeIndex) {
          return (parentWidth - itemWidth) / 2;
        } else if (Math.abs(index - activeIndex) == 1 || Math.abs(index) == 1) {
          return index - activeIndex > 0 ? itemWidth * 3 : itemWidth
        } else if (Math.abs(index - activeIndex) == 2 || Math.abs(index) == 2) {
          return index - activeIndex > 0 ? itemWidth * 4 : 0
        }
      } else if (index < activeIndex) {
        return -itemWidth
      } else {
        return parentWidth
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
      if (index !== activeIndex && length > 2 && this.$parent.loop) {
        index = this.processIndex(index, activeIndex, length);
      }
      // console.error('translateItem', activeIndex, index);
      if (parentType === 'card') {
        if (parentDirection === 'vertical') {
          console.warn('[Element Warn][Carousel]vertical direction is not supported in card mode');
        }
        this.inStage = Math.round(Math.abs(index - activeIndex)) <= 2 || Math.abs(index) <= 2;
        this.active = index === activeIndex;
        // 平移
        this.translate = this.calcCardTranslate(index, activeIndex, length);
        // 缩放
        if (this.active) {
          this.scale = 1
          this.opacity = 1
        } else if (Math.abs(activeIndex - index) === 1 || Math.abs(index) == 1) {
          this.scale = CARD_SCALE;
          this.opacity = 0.6
        } else if (Math.abs(activeIndex - index) === 2 || Math.abs(index) == 2) {
          this.scale = CARD_SCALE2;
          this.opacity = 0.4
        } else {
          this.scale = CARD_SCALE2;
          this.opacity = 0
        }
      } else {
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
      const value = `${translateType}(${this.translate}px) scale(${this.scale})`;
      const style = {
        transform: value,
        opacity: this.opacity,
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