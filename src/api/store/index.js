import request from '@/utils/request'

export function storeAdd(data) {
  return request({
    url: 'storemanager/store/create',
    method: 'post',
    data
  })
}


export function storePass(data) {
  return request({
    url: '/storemanager/store/pass',
    method: 'post',
    data
  })
}
export function storeSetStatus(data) {
  return request({
    url: '/storemanager/store/setStatus',
    method: 'post',
    data
  })
}
// 认领审核
export function storeCheckClaim(data) {
  return request({
    url: '/storemanager/store/checkClaim',
    method: 'post',
    data
  })
}



export function storeList(data) {
  return request({
    url: '/storemanager/store-category/list',
    method: 'get',
    params: data
  })
}


export function setMapStatus(data) {
  return request({
    url: '/storemanager/store/setMapShow',
    method: 'post',
    data
  })
}
export function storeReject(data) {
  return request({
    url: '/storemanager/store/reject',
    method: 'post',
    data
  })
}

export function storeDelete(data) {
  return request({
    url: '/storemanager/store/delete',
    method: 'post',
    data
  })
}
//
export function storeEnable(data) {
  return request({
    url: '/storemanager/store-category/enable',
    method: 'post',
    data
  })
}
export function storeDisable(data) {
  return request({
    url: '/storemanager/store-category/disable',
    method: 'post',
    data
  })
}

export function storeCategoryDelete(data) {
  return request({
    url: '/storemanager/store-category/delete',
    method: 'post',
    data
  })
}
export function storeCategoryCreate(data) {
  return request({
    url: '/storemanager/store-category/create',
    method: 'post',
    data
  })
}

export function storeCategoryEdit(data) {
  return request({
    url: '/storemanager/store-category/edit',
    method: 'post',
    data
  })
}


export function storeSetOpen(data) {
  return request({
    url: '/storemanager/store/setOpen',
    method: 'post',
    data
  })
}
export function storeSetTop(data) {
  return request({
    url: '/storemanager/store/setTop',
    method: 'post',
    data
  })
}

export function storeEdit(data) {
  return request({
    url: '/storemanager/store/edit',
    method: 'post',
    data
  })
}
export function storeDetail(data) {
  console.log('data',data)
  return request({
    url: '/storemanager/store/detail',
    method: 'get',
    params: data
  })
}







