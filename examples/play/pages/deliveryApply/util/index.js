export const hasDuplicateField = (array,field) => {
  let flag = false
  const uniqueValues = new Set()
  for (const item of array) {
    if (uniqueValues.has(item[field])){
      flag = true
      break
    }
    uniqueValues.add(item[field])
  }
  return flag
}

export const deliveryCommonProps = {
  isDetail: {
    type: Boolean,
    default: false
  },
  baseInfo: {
    type: Object,
    default: () => ({})
  },
  varietyTbInfo: {
    type: Object,
    default: () => ({})
  },
  instInfo: {
    type: Object,
    default: () => ({})
  },
  detailInfo: {
    type: Object,
    default: () => ({})
  }
}

export const DELIVERY_DIRECTION = Object.freeze([
  { label:'买入', value: '0' },
  { label:'卖出', value:'1' }
])
export const DELIVERY_TIME = Object.freeze([
  { label:'滚动交割', value:'0'},
  { label:'集中交割', value:'1'}
])
export const DELIVERY_TYPE = Object.freeze([
  { label:'标准仓单', value:'A'},
  { label:'车(船)板', value:'C'}
])
export const CZCE_DELIVERY_TYPE = Object.freeze([
  { label:'国债', value: 'B'},
])
//投保标志
export const DELIVERY_INSURE_FLAG = Object.freeze([
  { label:'投机', value:'0'},
  { label:'保值', value: '1'},
])
//托管机构
export const DELIVERY_HOSTING_INSTITUTIONS = Object.freeze([
  { label:'中央结算', value: '0'},
  { label:'中国结算上海', value:'1'},
  { label: '中国结算深圳',value: '2'}
])