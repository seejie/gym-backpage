import request from '@/utils/request'
import deleteEmptyParams from '@/utils/deleteEmptyParams'

export default {
  // 添加案例
  add(data) {
    return request({
      url: '/website/case/add',
      method: 'POST',
      data,
    })
  },

  // 批量删除
  batchDelete(data) {
    return request({
      url: '/website/case/batchDelete',
      method: 'POST',
      data,
    })
  },

  // 批量下线
  batchDown(data) {
    return request({
      url: '/website/case/batchDown',
      method: 'POST',
      data,
    })
  },

  // 批量上线
  batchUp(data) {
    return request({
      url: '/website/case/batchUp',
      method: 'POST',
      data,
    })
  },

  // 删除案例
  delete(data) {
    return request({
      url: '/website/case/delete',
      method: 'POST',
      data,
    })
  },

  // 修改案例
  update(data) {
    return request({
      url: '/website/case/update',
      method: 'POST',
      data,
    })
  },

  // 分页查看案例列表
  listPage(params) {
    return request({
      url: '/website/case/listPage',
      method: 'GET',
      params: deleteEmptyParams(params),
    })
  },
}
