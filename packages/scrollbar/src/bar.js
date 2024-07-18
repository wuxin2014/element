import { on, off } from 'element-ui/src/utils/dom';
import { renderThumbStyle, BAR_MAP } from './util';

/* istanbul ignore next */
export default {
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String, // 滚动条的长度
    move: Number // 滚动条的位移
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
    // size指宽度百分比或者高度百分比
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
    // 2.拖拽滚动条进行滚动
    clickThumbHandler(e) {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      // 点击滚动拇指区域，监听拖拽事件
      this.startDrag(e);
      // 以垂直滚动条为例，this.Y = e.currentTarget.offsetHeight - (e.clientY - e.currentTarget.getBoundingClientRect().top)
      // e.clientY - e.currentTarget.getBoundingClientRect().top = 鼠标距离滚动条顶部（或者左侧的距离）
      // 计算点击位置距离滚动条底部（或者右侧）的距离
      this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]));
    },
    // 3.在滚动轨道上点击，触发滚动条滚动
    clickTrackHandler(e) {
      // 计算鼠标 距离滚动轨道最上方（或者最左侧）的距离
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      // 计算出滚动条高度或者宽度的一半
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
      // 以鼠标的位置作为滚动条的中心，计算出滚动条距离滚动轨道最上方的百分比
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100); // 内容滚动设置 scrollTop或者scrollLeft
    },

    startDrag(e) {
      e.stopImmediatePropagation(); // 阻止冒泡
      this.cursorDown = true; // 手指是否摁下

      on(document, 'mousemove', this.mouseMoveDocumentHandler); // 监听鼠标移动事件
      on(document, 'mouseup', this.mouseUpDocumentHandler); // 监听鼠标抬起事件
      document.onselectstart = () => false; // 禁止选中文字
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;
      const prevPage = this[this.bar.axis];

      if (!prevPage) return;
      // 计算鼠标 距离滚动轨道最上方（或者最左侧）的距离
      const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
      // 鼠标距离滚动条最上方的位置
      const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
      // 计算滚动条距离滚动轨道最上方（或者最左侧）的百分比
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);

      this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
    },

    mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      off(document, 'mousemove', this.mouseMoveDocumentHandler); // 取消监听鼠标移动事件
      document.onselectstart = null; // 取消禁止选中，将事件重新赋值即可，可以为null，字符串、布尔值
    }
  },

  destroyed() {
    off(document, 'mouseup', this.mouseUpDocumentHandler); // 取消监听鼠标抬起事件
  }
};
