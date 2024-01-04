import Vue from 'vue';

export default function scrollIntoView(container, selected) {
  if (Vue.prototype.$isServer) return;

  if (!selected) {
    container.scrollTop = 0;
    return;
  }

  const offsetParents = [];
  let pointer = selected.offsetParent; // 找到目标元素的父级元素(带有定位属性的)
  while (pointer && container !== pointer && container.contains(pointer)) { // Node.contains()
    offsetParents.push(pointer);
    pointer = pointer.offsetParent;
  }
  // offsetTop是指相对其offsetParent元素的顶部内边距距离
  const top = selected.offsetTop + offsetParents.reduce((prev, curr) => (prev + curr.offsetTop), 0); // 这步没看懂
  const bottom = top + selected.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;

  if (top < viewRectTop) { // 不在可视区内让其滚动到可视区内
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}
