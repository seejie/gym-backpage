import request from '@/utils/request'

export function storeAdd(data) {
  return request({
    url: 'storemanager/master/create',
    method: 'post',
    data
  })
}


export function storePass(data) {
  return request({
    url: '/storemanager/master/pass',
    method: 'post',
    data
  })
}
export function storeSetStatus(data) {
  return request({
    url: '/storemanager/master/setStatus',
    method: 'post',
    data
  })
}
// 认领审核
export function storeCheckClaim(data) {
  return request({
    url: '/storemanager/master/checkClaim',
    method: 'post',
    data
  })
}



export function storeList(data) {
  return request({
    url: '/storemanager/master-category/list',
    method: 'get',
    params: data
  })
}


export function setMapStatus(data) {
  return request({
    url: '/storemanager/master/setMapShow',
    method: 'post',
    data
  })
}
export function storeReject(data) {
  return request({
    url: '/storemanager/master/reject',
    method: 'post',
    data
  })
}

export function storeDelete(data) {
  return request({
    url: '/storemanager/master/delete',
    method: 'post',
    data
  })
}
//
export function storeEnable(data) {
  return request({
    url: '/storemanager/master-category/enable',
    method: 'post',
    data
  })
}
export function storeDisable(data) {
  return request({
    url: '/storemanager/master-category/disable',
    method: 'post',
    data
  })
}

export function storeCategoryDelete(data) {
  return request({
    url: '/storemanager/master-category/delete',
    method: 'post',
    data
  })
}
export function storeCategoryCreate(data) {
  return request({
    url: '/storemanager/master-category/create',
    method: 'post',
    data
  })
}

export function storeCategoryEdit(data) {
  return request({
    url: '/storemanager/master-category/edit',
    method: 'post',
    data
  })
}


export function storeSetOpen(data) {
  return request({
    url: '/storemanager/master/setOpen',
    method: 'post',
    data
  })
}
export function storeSetTop(data) {
  return request({
    url: '/storemanager/master/setTop',
    method: 'post',
    data
  })
}

export function storeEdit(data) {
  return request({
    url: '/storemanager/master/edit',
    method: 'post',
    data
  })
}
export function storeDetail(data) {
  console.log('data',data)
  return request({
    url: '/storemanager/master/detail',
    method: 'get',
    params: data
  })
}







