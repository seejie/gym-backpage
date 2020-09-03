import request from '@/utils/request'
import deleteEmptyParams from '@/utils/deleteEmptyParams'

export default {
  // 添加新闻
  add(data) {
    return request({
      url: '/website/news/add',
      method: 'POST',
      data,
    })
  },

  // 批量删除
  batchDelete(data) {
    return request({
      url: '/website/news/batchDelete',
      method: 'POST',
      data,
    })
  },

  // 批量下线
  batchDown(data) {
    return request({
      url: '/website/news/batchDown',
      method: 'POST',
      data,
    })
  },

  // 批量上线
  batchUp(data) {
    return request({
      url: '/website/news/batchUp',
      method: 'POST',
      data,
    })
  },

  // 删除新闻
  delete(data) {
    return request({
      url: '/website/news/delete',
      method: 'POST',
      data,
    })
  },

  // 修改新闻
  update(data) {
    return request({
      url: '/website/news/update',
      method: 'POST',
      data,
    })
  },

  // 分页查看新闻列表
  listPage(params) {
    return request({
      url: '/website/news/listPage',
      method: 'GET',
      params: deleteEmptyParams(params),
    })
  },
}
