import Vue from 'vue'

/**
 * 新增弹框拖拽功能
 */
Vue.directive('drag', {
  bind: (el) => {
    // 获取弹框标题区域dom节点
    const headerDom = el.querySelector('.el-dialog__header');
    // 修改鼠标图标样式
    headerDom.style.cursor = "move";
    // 禁止拖拽时选中标题中文本内容
    headerDom.style.userSelect = "none";

    // 获取弹框区域的dom节点
    const dialogDom = el.querySelector('.el-dialog');

    // 弹窗距离边界的距离
    const boundingPadding = 1;

    // 是否正在拖动
    let isDrag = false;

    // 鼠标按下时位置坐标
    let clientX = 0, clientY = 0;

    // 按下时弹框位置坐标
    let dialogLeft = 0, dialogTop = 0;
    let newLeft = 0, newTop = 0;
    let dialogWidth = 0, dialogHeight = 0;
    let distLeft = 0, distTop = 0;

    // 监听鼠标按下事件
    headerDom.onmousedown = function (e) {
      isDrag = true;

      // 获取当前鼠标位置坐标
      clientX = e.clientX;
      clientY = e.clientY;

      // 获取当前弹窗位置坐标
      dialogLeft = parseFloat(dialogDom.style.left);
      if (isNaN(dialogLeft)) {
        dialogLeft = 0;
      }
      newLeft = dialogLeft;

      dialogTop = parseFloat(dialogDom.style.top);
      if (isNaN(dialogTop)) {
        dialogTop = 0;
      }
      newTop = dialogTop;

      const dialogBounding = dialogDom.getBoundingClientRect();
      dialogWidth = dialogBounding.width;
      dialogHeight = dialogBounding.height;
      distLeft = dialogLeft - dialogBounding.left;
      distTop = dialogTop - dialogBounding.top;

      // 绑定鼠标移动事件
      document.addEventListener('mousemove', el.mousemove);
    }

    // 监听鼠标移动事件
    el.mousemove = function (e) {
      // 按下的时候，执行移动操作
      if (isDrag) {
        // 设置弹窗位置以及边界处理
        newLeft = dialogLeft + e.clientX - clientX;
        if (newLeft - distLeft < boundingPadding) {
          newLeft = boundingPadding + distLeft;
        } else if (newLeft - distLeft > window.innerWidth - boundingPadding - dialogWidth) {
          newLeft = distLeft + window.innerWidth - boundingPadding - dialogWidth;
        }
        dialogDom.style.left = newLeft + 'px';

        newTop = dialogTop + e.clientY - clientY;
        if (newTop - distTop <= boundingPadding) {
          newTop = boundingPadding + distTop;
        } else if (newTop - distTop >= window.innerHeight - boundingPadding - dialogHeight) {
          newTop = distTop + window.innerHeight - boundingPadding - dialogHeight;
        }
        dialogDom.style.top = newTop + 'px';
      }
    }

    // 监听鼠标抬起事件
    el.mouseup = function (e) {
      isDrag = false;

      // 解绑鼠标移动事件
      document.removeEventListener('mousemove', el.mousemove);
    }

    // 绑定鼠标抬起事件
    document.addEventListener('mouseup', el.mouseup);
  },
  unbind: (el) => {
    // 解绑鼠标抬起事件
    document.removeEventListener('mouseup', el.mouseup);
  }
})