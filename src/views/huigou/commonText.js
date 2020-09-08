
export const orderStatusOptions = [{
  label: '全部',
  name: 'all',
  value: ''
}, {
  label: '待支付',
  name: '0',
  value: 0
}, {
  label: '待核销',
  name: '20',
  value: 20
}, {
  label: '待评价',
  name: '3',
  value: 3
}, {
  label: '待退款',
  name: '12',
  value: 12
}, {
  label: '已退款',
  name: '18',
  value: 18
}, {
  label: '已完成',
  name: '10',
  value: 10
}]

export const pageSizesRange = [5, 10, 20, 30]

export const deleteEmptyParams = (obj) => {
  Object.keys(obj).forEach((i) => {
    if (obj[i] === '') {
      delete obj[i]
    }
    return obj
  })
  return obj
}