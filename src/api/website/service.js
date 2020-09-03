import request from '@/utils/request'
import deleteEmptyParams from '@/utils/deleteEmptyParams'

export default {
  // 添加服务
  add(data) {
    return request({
      url: '/website/service/add',
      method: 'POST',
      data,
    })
  },

  // 批量删除
  batchDelete(data) {
    return request({
      url: '/website/service/batchDelete',
      method: 'POST',
      data,
    })
  },

  // 批量下线
  batchDown(data) {
    return request({
      url: '/website/service/batchDown',
      method: 'POST',
      data,
    })
  },

  // 批量上线
  batchUp(data) {
    return request({
      url: '/website/service/batchUp',
      method: 'POST',
      data,
    })
  },

  // 删除服务
  delete(data) {
    return request({
      url: '/website/service/delete',
      method: 'POST',
      data,
    })
  },

  // 修改服务
  update(data) {
    return request({
      url: '/website/service/update',
      method: 'POST',
      data,
    })
  },

  // 分页查看服务列表
  listPage(params) {
    return request({
      url: '/website/service/listPage',
      method: 'GET',
      params: deleteEmptyParams(params),
    })
  },
}
