<template>
  <el-select ref="select" v-model="select" clearable :collapseTags="false" v-bind="{...$attrs}" >
    <el-option v-for="item in optionList" :key="item.key" :value="item.value" :label="item.label" />
  </el-select>
</template>

<script>
// select选择器多选时启用鼠标悬停折叠文字以tooltip显示具体所选值
export default {
  props: {
    optionList: {
      type: Array,
      default: () => []
    },
    maxTagCount: {
      type: Number,
      default: 1
    },
  },
  data() {
    console.log(this.$attrs)
    // 创建数字展示的tag
    let countDom = document.createElement("span")
    countDom.className = "jy-ui-collapse-tag"

    return {
      domSelectTags: null,
      domSelect: null,
      countDom,
      toolTip: null,
      toolTipArr: [],
      select: []
    };
  },
  watch: {
    select: {
      handler(v) {
        this.afterChange(v)
      },
    },
  },
  mounted() {
    this.domSelect = this.$refs.select.$el
    this.domSelectTags = this.domSelect.querySelector(".el-select__tags")
    this.domSelectTags && this.domSelect.querySelector(".el-select__tags > span").after(this.countDom)
  },
  methods: {
    querySelectorAll(txt) {
      const selectRefs = this.$refs.select
      if (!selectRefs) return []

      const select = selectRefs.$el

      if (!select) return []
      return select.querySelectorAll(txt)
    },
    // vue 获取元素距离浏览器视口左侧的距离
    offsetLeft(elements) {
      let left = elements.offsetLeft
      let parent = elements.offsetParent
      while (parent != null) {
        left += parent.offsetLeft
        parent = parent.offsetParent
      }

      return left
    },
    // vue 获取元素距离浏览器视口顶部的距离
    offsetTop(elements) {
      let top = elements.offsetTop
      let parent = elements.offsetParent
      while (parent != null) {
        top += parent.offsetTop
        parent = parent.offsetParent
      }

      return top
    },
    // 获取当前元素所在的模块的第一个有滚动条的父元素
    parentScroll(elements) {
      let dom = null
      let parent = elements.parentNode
      let flag = true

      while (parent != null && flag) {
        const style = this.isDOM(parent) ? this.getStyle(parent, 'overflow-y') : ''
        if (style === 'auto' || style === 'scroll') {
          dom = parent
          flag = false
        }

        parent = parent.parentNode
      }

      return dom
    },
    // 根据className类获取祖先节点
    getParent(elements, className) {
      let dom = null
      let parent = elements.parentNode
      let flag = true

      while (parent != null && flag) {
        const _className = this.isDOM(parent) ? parent.className : ''
        if (_className.indexOf(className) > -1) {
          dom = parent
          flag = false
        }

        parent = parent.parentNode
      }

      return dom
    },
    afterChange(value) {
      console.log('=afterChange=', value)
      if (!this.domSelectTags) return

      this.$nextTick(() => {
        let { length } = this.querySelectorAll(".el-tag")
        if (length != value.length) {
          requestAnimationFrame(awaitUntilNodeEqual)
          return;
        }

        if (length == 0) {
          this.countDom.style.display = "none"
          this.countDom.innerHTML = 0
        }

        this.handleInsideTags()
      })
    },
    handleInsideTags() {
      // 处理内部节点
      let elTags = Array.from(this.querySelectorAll(".el-tag"))

      // toolTip的内容
      this.toolTipArr = []

      elTags.forEach((elTag, index) => {
        if (index >= this.maxTagCount) {
          elTag.style.display = "none"
          this.toolTipArr.push(elTag.innerText)
        } else {
          // 这里不用display = "inline-block"，是因为display设置了inline-block后会导致用了align-items: center的样式会失效。
          // display:flex已经block化了。
          elTag.style.display = "flex"
        }
      });

      let elCount = elTags.length

      if (elCount > this.maxTagCount) {
        this.countDom.innerHTML = `+${elCount - this.maxTagCount}`
        this.countDom.style.display = "flex"
        this.countDom.style.alignItems = "center"
      } else {
        this.countDom.style.display = "none"
        this.countDom.innerHTML = 0
      }

      // 鼠标移入collapse-tags，即鼠标移入多选的数字标签时。
      this.countDom.onmouseenter = self => this.mouseenter(self)
      // 鼠标离开collapse-tags，即鼠标离开多选的数字标签时。
      this.countDom.onmouseleave = () => this.mouseleave()
    },
    mouseenter({ target }) {
      // 微前端框架里需要被减去的宽度
      let subtractWidth = 0
      let subtractHeight = 0
      let subTop = 0
      if (window.__MICRO_APP_ENVIRONMENT__) {
        //  let alideNode = document.querySelector('body').querySelector('.d2-theme-container-aside')
        subtractWidth = 0
        subtractHeight = 0
        subTop = 72
      }
      // 创建toolTip元素DOM
      this.toolTip = document.createElement("div")
      this.toolTip.className = "jy-ui-select-tooltip"
      // 创建toolTip中内容的显示元素DOM
      const toolTipContent = document.createElement("span")
      toolTipContent.className = "jy-ui-select-tooltip-content"
      toolTipContent.innerHTML = this.toolTipArr.join('，')
      // 创建toolTip显示时所需的三角形元素DOM
      const arrowBottom = document.createElement("span")
      arrowBottom.className = "jy-ui-select-tooltip-arrow"

      const arrowTop = document.createElement("span")
      arrowTop.className = 'jy-ui-select-tooltip-arrow jy-ui-select-tooltip-arrow-top'

      // 将toolTip中内容的显示元素DOM插入到toolTip元素中
      this.toolTip.appendChild(toolTipContent)
      // 将三角形元素插入到toolTip元素中
      this.toolTip.appendChild(arrowBottom)
      this.toolTip.appendChild(arrowTop)
      // 将toolTip元素插入到body中
      document.querySelector('body').appendChild(this.toolTip)

      // target.offsetLeft - 当前鼠标移入的数字元素距离浏览器视口左侧的距离
      const selectOffsetTop = this.offsetTop(this.domSelect)  // 当前select元素距离浏览时视口顶部的距离
      const targetOffsetLeft = this.offsetLeft(target)  // 当前鼠标移入的数字元素距离浏览器视口左侧的距离
      const slectOffsetHeight = this.domSelect.offsetHeight  // slectOffsetHeight - 当前select元素的高度
      const toolTipOffsetHeight = this.toolTip.offsetHeight  // 当前所要显示的toolTip的高度
      const toolTipOffsetWidth = this.toolTip.offsetWidth  // toolTipOffsetWidth - 当前所要显示的toolTip的宽度
      const targetOffsetWidth = target.offsetWidth  // targetOffsetWidth - 当前鼠标移入的数字元素的宽度

      // toolTip距离浏览器视口左侧的距离
      let leftPos = targetOffsetLeft + (targetOffsetWidth / 2) - (toolTipOffsetWidth / 2)
      // toolTip距离浏览器视口顶部的距离
      let topPos = selectOffsetTop - toolTipOffsetHeight - 5

      // 如果toolTip的上边被浏览器视口遮挡，则将toolTip放置在select的下边
      if (topPos - subTop <= 0) {
        topPos = selectOffsetTop + slectOffsetHeight + 5
        arrowBottom.style.display = 'none'
        arrowTop.style.display = 'block'
      } else {
        arrowBottom.style.display = 'block'
        arrowTop.style.display = 'none'
      }

      // 如果toolTip的左边被浏览器视口遮挡，则将toolTip的left置为2
      if (leftPos <= 0) {
        leftPos = 2
        let arrowLeftPos = targetOffsetLeft + (targetOffsetWidth / 2)
        arrowLeftPos = Math.floor(arrowLeftPos) + 'px'
        arrowBottom.style.left = arrowLeftPos
        arrowTop.style.left = arrowLeftPos
      }

      // window.pageYOffset: safari获取scrollTop的方法
      const bodyTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
      const bodyHasScroll = this.getStyle(document.querySelector('body'), 'overflow') === 'hidden'
      const floorBodyTop = Math.floor(bodyTop)

      // 如果是被浏览器的滚动条滚到了视口的顶部，则将toolTip放置在select的下边。其中，bodyTop指的是网页滚动的距离
      if (!bodyHasScroll && (floorBodyTop + toolTipOffsetHeight + 10 + subTop >= selectOffsetTop)) {
        topPos = selectOffsetTop + slectOffsetHeight + 5
        arrowBottom.style.display = 'none'
        arrowTop.style.display = 'block'
      } else {
        arrowBottom.style.display = 'block'
        arrowTop.style.display = 'none'
      }

      const parentScroll = this.parentScroll(this.domSelect)
      const parentScrollTop = parentScroll ? parentScroll.scrollTop : 0
      const floorParentScrollTop = Math.floor(parentScrollTop)

      // 弹框的高度缩小到一定程度时，也会出现滚动条，当这个滚动条滚动时，也会影响tooltip的位置。
      // 用this.getParent(this.domSelect, 'el-dialog__wrapper')来获取el-dialog__wrapper，是因为弹窗关闭后，
      // 会在body节点中依旧保留弹窗的节点dom，如果页面中打开的弹窗不止一个，此时要再获取el-dialog__wrapper的scrollTop就不知道要获取哪个弹窗的了。
      const dialogWrapper = this.getParent(this.domSelect, 'el-dialog__wrapper')
      const dialogWrapperScrollTop = dialogWrapper ? Math.floor(dialogWrapper.scrollTop) : 0

      // 如果当前元素的父元素存在滚动条，且body元素的滚动条不存在，说明select组件有可能是在弹窗中且弹窗内可能会发生滚动。
      if (parentScroll && bodyHasScroll) {
        topPos = topPos - floorParentScrollTop + floorBodyTop - dialogWrapperScrollTop

        if (floorParentScrollTop + toolTipOffsetHeight + 10 + subTop + dialogWrapperScrollTop >= selectOffsetTop) {
          topPos = selectOffsetTop + slectOffsetHeight - floorParentScrollTop - dialogWrapperScrollTop + floorBodyTop + 5
          arrowBottom.style.display = 'none'
          arrowTop.style.display = 'block'
        } else {
          arrowBottom.style.display = 'block'
          arrowTop.style.display = 'none'
        }
      } else if (parentScroll && !bodyHasScroll) {
        // 如果当前元素的父元素存在滚动条，且body元素的滚动条存在，说明select组件可能只是在页面中且其所在模块的某个父元素可能会发生滚动，
        // 那么这个时候topPos的值其实已经包含了浏览器滚动条的滚动距离了，所以这里就不再加bodyTop了。
        topPos = topPos - floorParentScrollTop
        // 如果浏览器的滚动条和当前元素的某个父元素的滚动条发生了滚动且tooltip被顶部遮挡，则将toolTip放置在select的下边
        if (floorBodyTop + floorParentScrollTop + toolTipOffsetHeight + 10 + subTop >= selectOffsetTop) {
          topPos = selectOffsetTop + slectOffsetHeight - floorParentScrollTop + 5
          arrowBottom.style.display = 'none'
          arrowTop.style.display = 'block'
        } else {
          arrowBottom.style.display = 'block'
          arrowTop.style.display = 'none'
        }
      }

      this.toolTip.style.display = 'block'
      this.toolTip.style.left = Math.floor(leftPos) - subtractWidth + 'px'
      this.toolTip.style.top = Math.floor(topPos) - subtractHeight + 'px'

      // 如果toolTip的右边被浏览器视口遮挡，则将toolTip的left置为initial，right置为2
      if (Math.floor(leftPos) + toolTipOffsetWidth >= document.body.offsetWidth) {
        this.toolTip.style.left = 'initial'
        this.toolTip.style.right = '2px'

        let arrowRightPos = document.body.offsetWidth - targetOffsetLeft - (targetOffsetWidth / 2) - 18
        arrowRightPos = Math.floor(arrowRightPos) + 'px'

        arrowBottom.style.left = 'initial'
        arrowTop.style.left = 'initial'
        arrowBottom.style.right = arrowRightPos
        arrowTop.style.right = arrowRightPos
      }
    },
    mouseleave() {
      // 鼠标离开多选的数字标签时，删除插入到body中国的toolTip。
      document.querySelector('body').removeChild(this.toolTip)
    },
    // 原生js获取元素的样式
    getStyle(el, name) {
      if (window.getComputedStyle) {
        return String(getComputedStyle(el).getPropertyValue(name)).trim()
      } else {
        return el.currentStyle[name]
      }
    },
    // 判断当前节点是否是dom节点，如果不判断的话，在使用getComputedStyle时，
    // 会报Failed to execute 'getComputedStyle' on 'Window': parameter 1 is not of type 'Element'.的错，因为getComputedStyle这个方法只能用在dom节点上。
    isDOM(el) {
      // 首先判断是否支持HTMLELement，如果支持，使用HTMLElement，如果不支持，通过判断DOM的特征，如果拥有这些特征说明就是ODM节点，特征使用的越多越准确
      return (typeof HTMLElement === 'function')
        ? (el instanceof HTMLElement)
        : (el && (typeof el === 'object') && (el.nodeType === 1) && (typeof el.nodeName === 'string'))
    }
  },
}
</script>

<style>
.jy-ui-collapse-tag {
  height: 20px;
  padding: 0 5px;
  line-height: 19px;
  background-color: #f4f4f5;
  border: 1px solid #e9e9eb;
  border-radius: 4px;
  color: #909399;
  margin-left: 4px;
  cursor: pointer;
}
.jy-ui-select-tooltip {
  margin-top: 16px;
}
.jy-ui-select-tooltip-content {
  background-color: aliceblue;
  padding: 10px 12px;
  border-radius: 4px;
}
.jy-ui-select-tooltip-arrow {

}
.jy-ui-select-tooltip-arrow-top {
 
}
</style>
