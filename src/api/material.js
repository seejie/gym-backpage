import request from '@/utils/request'

// 分页查看图片组列表
export function getImageGroupList(params) {
  return request({
    url: '/material/materialsImageGroup/list',
    method: 'get',
    params,
  })
}

// 分页查看图片列表
export function getImageList(params) {
  return request({
    url: '/material/materialsImage/listPage',
    method: 'get',
    params,
  })
}

// 添加图片素材
export function addImage(data) {
  return request({
    url: '/material/materialsImage/add',
    method: 'post',
    data,
  })
}
export function cropper(data) {
  return request({
    url: '/file/cropper',
    method: 'post',
    data,
  })
}
export function addImageGroup(data) {
  return request({
    url: '/material/materialsImageGroup/add',
    method: 'post',
    data,
  })
}

// 微信素材同步状态
export function querySyncStatus(params) {
  return request({
    url: '/material/wechatmaterials/querySyncStatus',
    method: 'get',
    params,
  })
}
