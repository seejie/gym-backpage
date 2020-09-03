import request from '@/utils/request'
//查询码商数据
export function getTabelList (data) {
  return request({
    url: '/sys/THuigouTicketCode/findAll',
    method: 'get',
    params: data
  })
}
//创建码商数据
export function addBrand (data) {
  return request({
    url: '/sys/THuigouTicketCode/create',
    method: 'post',
    data: data
  })
}
//编辑标签
export function editLabel (data) {
  return request({
    url: '/sys/THuigouTicketCode/update',
    method: 'post',
    data: data
  })
}
//删除标签
export function deletLabel (data) {
  return request({
    url: '/sys/THuigouTicketCode/deletes',
    method: 'get',
    params: data
  })
}
