import request from '@/utils/request'
//查询设施列表
export function getLabelList (data) {
  return request({
    url: '/sys/THuigouHotelFac/findAll',
    method: 'get',
    params: data
  })
}
//添加设施
export function addLabel (data) {
  return request({
    url: '/sys/THuigouHotelFac/create',
    method: 'post',
    data: data
  })
}
//编辑设施
export function editLabel (data) {
  return request({
    url: '/sys/THuigouHotelFac/update',
    method: 'post',
    data: data
  })
}
//删除设施
export function deletLabel (data) {
  return request({
    url: '/sys/THuigouHotelFac/deletes',
    method: 'get',
    params: data
  })
}
