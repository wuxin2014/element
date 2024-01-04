import { on, off } from 'element-ui/src/utils/dom';
import { renderThumbStyle, BAR_MAP } from './util';

/* istanbul ignore next */
export default {
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },

  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    },

    wrap() {
      return this.$parent.wrap;
    }
  },
  // 渲染函数
  render(h) {
    const { size, move, bar } = this;

    return (
      <div
        class={ ['el-scrollbar__bar', 'is-' + bar.key] }
        onMousedown={ this.clickTrackHandler } >
        <div
          ref="thumb"
          class="el-scrollbar__thumb"
          onMousedown={ this.clickThumbHandler }
          style={ renderThumbStyle({ size, move, bar }) }>
        </div>
      </div>
    );
  },

  methods: {
    clickThumbHandler(e) {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      // 点击滚动拇指区域，监听拖拽事件
      this.startDrag(e);
      // 记录啥呢，以垂直滚动条为例，this.Y = e.currentTarget.offsetHeight - (e.clientY - e.currentTarget.getBoundingClientRect().top)
      this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]));
    },

    clickTrackHandler(e) {
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2); // 拇指区域内容高或内容宽的一半
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true; // 手指是否摁下

      on(document, 'mousemove', this.mouseMoveDocumentHandler); // 监听鼠标移动事件
      on(document, 'mouseup', this.mouseUpDocumentHandler); // 监听鼠标抬起事件
      document.onselectstart = () => false; // 这句的作用是什么,阻止默认事件
    },

    mouseMoveDocumentHandler(e) {
      debugger
      if (this.cursorDown === false) return;
      const prevPage = this[this.bar.axis];

      if (!prevPage) return;

      const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1); // $el元素相对之前应该偏移的量
      const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage); // 拇指区域点击的位置
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      off(document, 'mousemove', this.mouseMoveDocumentHandler); // 取消监听鼠标移动事件
      document.onselectstart = null;
    }
  },

  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler); // 取消监听鼠标抬起事件
  }
};
