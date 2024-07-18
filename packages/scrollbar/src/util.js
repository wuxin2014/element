export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight', // width + padding + border
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight', // width + padding - scrollBarWidth
    size: 'height',
    key: 'vertical',
    axis: 'Y', // Y轴
    client: 'clientY',
    direction: 'top'
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X', // X轴
    client: 'clientX',
    direction: 'left'
  }
};

export function renderThumbStyle({ move, size, bar }) {
  const style = {};
  const translate = `translate${bar.axis}(${ move }%)`;

  style[bar.size] = size; // 滚动条的长度(宽或者高)
  style.transform = translate; // 滚动条位移
  style.msTransform = translate;
  style.webkitTransform = translate;

  return style;
};
