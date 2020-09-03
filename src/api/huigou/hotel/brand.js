import request from '@/utils/request'
//查询品牌数据
export function getTabelList (data) {
  return request({
    url: '/sys/THuigouHotelBrand/findAll',
    method: 'get',
    params: data
  })
}
//创建品牌数据
export function addBrand (data) {
  return request({
    url: '/sys/THuigouHotelBrand/create',
    method: 'post',
    data: data
  })
}
//编辑标签
export function editLabel (data) {
  return request({
    url: '/sys/THuigouHotelBrand/update',
    method: 'post',
    data: data
  })
}
//删除标签
export function deletLabel (data) {
  return request({
    url: '/sys/THuigouHotelBrand/deletes',
    method: 'get',
    params: data
  })
}
