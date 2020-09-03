import request from '@/utils/request'
//查询标签列表
export function getLabelList (data) {
  return request({
    url: '/sys/THuigouTiyanTag/findAll',
    method: 'get',
    params: data
  })
}
//添加标签
export function addLabel (data) {
  return request({
    url: '/sys/THuigouTiyanTag/create',
    method: 'post',
    data: data
  })
}
//编辑标签
export function editLabel (data) {
  return request({
    url: '/sys/THuigouTiyanTag/update',
    method: 'post',
    data: data
  })
}
//删除标签
export function deletLabel (data) {
  return request({
    url: '/sys/THuigouTiyanTag/deletes',
    method: 'get',
    params: data
  })
}
