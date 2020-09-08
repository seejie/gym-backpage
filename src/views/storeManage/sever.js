const headers = {
  'Content-Type': 'application/json;charset=UTF-8'
}

export const storeTypeEdit = (ajax, param) => ajax.post('/api/store-type/edit', param, { headers }); // 编辑类型
export const storeTypeCreate = (ajax, param) => ajax.post('/api/store-type/create', param, { headers }); // 新增类型
export const storeTypeDelete = (ajax, param) => ajax.post('/api/store-type/delete', param, { headers }); // 删除类型
export const storeTypeEnable = (ajax, param) => ajax.post('/api/store-type/enable', param, { headers }); // 启用
export const storeTypeDisable = (ajax, param) => ajax.post('/api/store-type/disable', param, { headers }); // 禁用

export const storeCreate = (ajax, param) => ajax.post('/api/store/create', param, { headers }); // 新增店铺
