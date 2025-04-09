
export default {
  bind(el, binding, vnode) {
    startDrag(el.querySelector('.el-dialog__header'), el.querySelector('.el-dialog'), binding.value);
  }
}

/**
 * 拖拽移动
 * @param  {elementObjct} bar 鼠标点击控制拖拽的元素
 * @param {elementObjct}  target 移动的元素
 * @param {function}  callback 移动后的回调
 */
function startDrag(bar, target, callback) {
  let params = {
    flag: false,
    top: 0,
    left: 0,
    cWidth: 0,
    cHeight: 0,
    tWidth: 0,
    tHeight: 0,
    currentX: 0,
    currentY: 0,
  };

  // 给拖动块添加样式
  bar.style.cursor = 'move';
  // 禁止拖拽时选中标题中文本内容
  bar.style.userSelect = 'none';

  // 获取相关CSS属性
  // o是移动对象
  // var getCss = function (o, key) {
  //   return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
  // };

  bar.onmousedown = function (event) {
    // 按下时初始化params
    const e = event ? event : window.event;
    params = {
      flag: true,
      cWidth: document.body.clientWidth,
      cHeight: document.body.clientHeight,
      top: target.getBoundingClientRect().top,
      left: target.getBoundingClientRect().left,
      tWidth: target.offsetWidth,
      tHeight: target.offsetHeight,
      currentX: e.clientX, // 记录摁下时的X轴坐标点
      currentY: e.clientY, // 记录摁下时的Y轴坐标点
    };

    // 给被拖动块初始化样式
    target.style.margin = 0;
    target.style.top = params.top + 'px';
    target.style.left = params.left + 'px';
    // target.style.cssText += `;left:${params.left}px;top:${params.top}px;`;
    console.log(params, '===')

    if (!event) {
      // 防止IE文字选中
      bar.onselectstart = function () {
        return false;
      }
    }

    document.onmousemove = function (event) {
      // 防止文字选中
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

      const e = event ? event : window.event;
      // 最终移动位置
      let zLeft = 0;
      let zTop = 0;
      if (params.flag) {
        const nowX = e.clientX; // X轴移动到的坐标点
        const nowY = e.clientY; // Y轴移动到的坐标点
        // 差异距离
        const disX = nowX - params.currentX;
        const disY = nowY - params.currentY;
        
        // 限制X轴范围
        zLeft = parseInt(params.left) + disX;
        if (zLeft <= -parseInt(params.tWidth / 2)) {
          zLeft = -parseInt(params.tWidth / 2);
        } else if (zLeft >= params.cWidth - parseInt(params.tWidth * 0.5)) {
          zLeft = params.cWidth - parseInt(params.tWidth * 0.5);
        }

        // 限制Y轴范围
        zTop = parseInt(params.top) + disY;
        if (zTop <= 0) {
          zTop = 0;
        } else if (zTop >= params.cHeight - parseInt(params.tHeight * 0.5)) {
          zTop = params.cHeight - parseInt(params.tHeight * 0.5);
        }

        // 执行移动
        target.style.left = zLeft + 'px';
        target.style.top = zTop + 'px';
        // target.style.cssText += `;left:${zLeft}px;top:${zTop}px;`;
      }

      if (typeof callback == "function") {
        callback(zLeft, zTop);
      }
    }

    document.onmouseup = function () {
      params.flag = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  // //拉伸
  // let minWidth = 400;
  // let minHeight = 300;
  // let resizeEl=document.createElement("div");
  // target.appendChild(resizeEl);
  // //在弹窗右下角加上一个10-10px的控制块
  // resizeEl.style.cursor = 'se-resize';
  // resizeEl.style.position = 'absolute';
  // resizeEl.style.height= '10px';
  // resizeEl.style.width = '10px';
  // resizeEl.style.right = '0px';
  // resizeEl.style.bottom = '0px';
  // //鼠标拉伸弹窗
  // resizeEl.onmousedown = (e) => {
  //   // 记录初始x位置
  //   const clientX = e.clientX;
  //   // 鼠标按下，计算当前元素距离可视区的距离
  //   const disX = e.clientX -resizeEl.offsetLeft;
  //   const disY = e.clientY - resizeEl.offsetTop;

  //   document .onmousemove = function (e) {
  //     e.preventDefault(); // 移动时禁用默认事件
  //     // 通过事件委托，计算移动的距离
  //     const x = e.clientX - disX + (e.clientX - clientX);//这里由于elementUI的dialog控制居中的，所以水平拉伸效果是双倍
  //     const y = e.clientY - disY;
  //     //比较是否小于最小宽高
  //     target.style.width = `${ x > minWidth ? x : minWidth }px`;
  //     target.style.height = `${ y > minHeight ? y : minHeight }px`;
  //   };

  //   //拉伸结束
  //   document.onmouseup = function (e) {
  //     document.onmousemove = null;
  //     document.onmouseup = null;
  //   };
  // }

}