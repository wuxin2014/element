```
function processIndex(index, activeIndex, length) {
  if (activeIndex === 0 && index === length - 1) { // 左边界处理
    return -1; // 放置到展示台上最左侧
  } else if (activeIndex === length - 1 && index === 0) { // 右边界处理
    return length; // 放置到展示台上最右侧
  } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
    return length + 1; // 放置到右侧+1(台外)
  } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
    return -2; // 放置到左侧-1(台外)
  }
  return index;
}
this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;

function calcCardTranslate(index, activeIndex) {
  const parentWidth = this.$parent.$el.offsetWidth;
  if (this.inStage) {
    return parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4;
  } else if (index < activeIndex) {
    return -(1 + CARD_SCALE) * parentWidth / 4;
  } else {
    return (3 + CARD_SCALE) * parentWidth / 4;
  }
}

.carousel-container {
  transform: translateX(-25%); /* 关键！左移 25% */
}
```

### 设定参数（固定下来，方便计算）
- 容器宽度 parentWidth = 400（单位：px）
- 缩放比例 CARD_SCALE = 0.8
- 当前激活卡片索引 activeIndex = 2
- 我们关注 5 张卡片：索引(index) 0, 1, 2, 3, 4
→ 所以 index - activeIndex 分别是：-2, -1, 0, +1, +2

根据逻辑：
- inStage 通常只包括 d = -1, 0, +1（即索引 1, 2, 3）
- d = -2 和 d = +2（索引 0 和 4）属于舞台外，堆在两边

### 第一步：用代码计算每张卡片的原始 translateX（未矫正）
我们逐个计算 calcCardTranslate(index, 2)

#### 卡片 index=2（主角，d=0）→ inStage
```
(2 - 0.8) * 0 + 1 = 1
→ 400 * 1 / 4 = **100**
```

#### 卡片 index=1（左边一张，d=-1）→ inStage
```
(2 - 0.8) * (-1) + 1 = -1.2 + 1 = -0.2
→ 400 * (-0.2) / 4 = **-20**
```

#### 卡片 index=3（右边一张，d=+1）→ inStage
```
(2 - 0.8) * 1 + 1 = 1.2 + 1 = 2.2
→ 400 * 2.2 / 4 = **220**
```

#### 卡片 index=0（更左，d=-2）→ 不在 inStage，且 index < activeIndex
```
-(1 + 0.8) * 400 / 4 = -1.8 * 100 = **-180**
```

#### 卡片 index=4（更右，d=+2）→ 不在 inStage，且 index > activeIndex
```
(3 + 0.8) * 400 / 4 = 3.8 * 100 = **380**
```

### 第二步：列出所有卡片的“原始位置”
| 索引 | d 值 | 是否 inStage | 原始 translateX (px) |
|------|-----|--------------|---------------------|
| 0    | -2  | ❌            | -180                |
| 1    | -1  | ✅           | -20                 |
| 2    | 0   | ✅           | 100 ← 主角          |
| 3    | +1  | ✅           | 220                 |
| 4    | +2  | ❌           | 380                 |
此时，如果直接显示，主角在 100px 处，不在中间！

### 第三步：父容器整体左移 100px（即 transform: translateX(-100px)）
这是关键！所有卡片的位置都要再减去 100px

| 索引 | 原始位置 | 矫正后位置 = 原始 - 100 |
|------|--------|------------------------|
| 0    | -180   | -280               |
| 1    | -20    | -120               |
| 2    | 100    | 0 ← 完美居中！✅    |
| 3    | 220    | 120                |
| 4    | 380    | 280                |


### 目标效果（5 张 inStage 卡片）
```
索引:   i-2   i-1    i     i+1   i+2
位置:   ◄─── ◄───  [●]  ───► ───►
视觉:   小    中    大    中    小

// inStage 条件改为：距离 activeIndex 不超过 2
this.inStage = Math.abs(index - this.activeIndex) <= 2;

那么 d = index - activeIndex 的取值为：-2, -1, 0, +1, +2


calcCardTranslate(index, activeIndex) {
  const parentWidth = this.$parent.$el.offsetWidth;
  const d = index - activeIndex;
  const maxVisibleOffset = 2; // 最多显示左右各2张

  if (Math.abs(d) <= maxVisibleOffset) {
    // inStage: 5张卡片（d = -2,-1,0,1,2）
    // 原始位置 = (3*d + 4) * parentWidth / 8
    return (3 * d + 4) * parentWidth / 8;
  } else if (index < activeIndex) {
    // 舞台左侧隐藏区
    return -0.75 * parentWidth; // 比最左还左一点
  } else {
    // 舞台右侧隐藏区
    return 1.75 * parentWidth; // 比最右还右一点
  }
}

css
.carousel-container {
  transform: translateX(-50%); /* 关键！左移 50% */
}

// 最终建议
calcCardTranslate(index, activeIndex) {
  const W = this.$parent.$el.offsetWidth;
  const d = index - activeIndex;

  // 支持左右各2张，共5张 inStage
  if (Math.abs(d) <= 2) {
    // (3*d + 4) / 8 * W
    // d=-2 → -2/8W, d=0 → 4/8W=0.5W, d=2 → 10/8W
    return (3 * d + 4) * W / 8;
  } 
  // 舞台外卡片堆在两侧
  else if (index < activeIndex) {
    return -W; // 足够靠左
  } else {
    return 2 * W; // 足够靠右
  }
}
```

| 原逻辑（3张） | 新逻辑（5张） |
|-------------|-------------|
| `inStage`: \|d\| ≤ 1 | `inStage`: \|d\| ≤ 2 |
| 公式：`((2 - s)*d + 1) * W / 4` | 公式：`(3*d + 4) * W / 8` |
| 父容器偏移：`-25%` | 父容器偏移：`-50%` |
| 隐藏区：`±(1+s)/4 W`, `(3+s)/4 W` | 隐藏区：`-0.75W`, `1.75W`（或根据需求调整） |


