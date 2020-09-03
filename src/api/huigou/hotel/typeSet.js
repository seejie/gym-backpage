import request from '@/utils/request'
//添加品类
export function addType (data) {
  return request({
    url: '/sys/THuigouHotelCategory/create',
    method: 'post',
    data: data
  })
}
//查询品类
export function getType (data) {
  return request({
    url: '/sys/THuigouHotelCategory/findAll',
    method: 'get',
    params: data
  })
}
//删除品类
export function delType (data) {
  return request({
    url: '/sys/THuigouHotelCategory/deletes',
    method: 'get',
    params: data
  })
}
//编辑品类
export function editType (data) {
  return request({
    url: '/sys/THuigouHotelCategory/update',
    method: 'post',
    data: data
  })
}
