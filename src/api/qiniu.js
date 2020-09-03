import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/common/getQiniuyunToken', // 假地址 自行替换
    method: 'get'
  })
}

