import request from '@/utils/request'
import deleteEmptyParams from '@/utils/deleteEmptyParams'

export default {
  // 保存配置
  save(data) {
    return request({
      url: '/website/setting/save',
      method: 'POST',
      data: deleteEmptyParams(data),
    })
  },

  // 查看配置详情
  find(params) {
    return request({
      url: '/website/setting/find',
      method: 'GET',
      params,
    })
  },
}
