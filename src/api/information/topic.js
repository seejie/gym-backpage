import request from '@/utils/request'
import deleteEmptyParams from '@/utils/deleteEmptyParams'

// 添加专题
export function informationTopicAdd(data) {
  return request({
    url: '/cms/informationTopic/add',
    method: 'POST',
    data,
  })
}

// 删除专题
export function informationTopicDelete(data) {
  return request({
    url: '/cms/informationTopic/delete',
    method: 'POST',
    data,
  })
}

// 修改专题
export function informationTopicUpdate(data) {
  return request({
    url: '/cms/informationTopic/update',
    method: 'POST',
    data,
  })
}

// 查看专题详情
export function informationTopicFind(params) {
  return request({
    url: '/cms/informationTopic/find',
    method: 'GET',
    params,
  })
}

// 查看专题下的素材
export function informationTopicListMatterialPage(params) {
  return request({
    url: '/cms/informationTopic/listMatterialPage',
    method: 'GET',
    params,
  })
}

// 分页查看专题列表
export function informationTopicListPage(params) {
  return request({
    url: '/cms/informationTopic/listPage',
    method: 'GET',
    params: deleteEmptyParams(params),
  })
}

// 禁言
export function informationTopicBan(data) {
  return request({
    url: '/cms/informationTopic/ban',
    method: 'POST',
    data,
  })
}

// 取消禁言
export function informationTopicUnban(data) {
  return request({
    url: '/cms/informationTopic/unban',
    method: 'POST',
    data,
  })
}
