import request from "@/utils/request";
import qs from 'qs'

// 编辑商品
export function shopProductEdit(data) {
  return request({
    url: "/shop/shopProduct/edit",
    method: "POST",
    data
  });
}

// 新增商品
export function shopProductAdd(data) {
  return request({
    url: "/shop/shopProduct/add",
    method: "POST",
    data
  });
}

// 商品列表
export function shopProductPage(params) {
  return request({
    url: "/shop/shopProduct/page",
    method: "GET",
    params
  });
}

// 商品详情
export function shopProductInfoById(id) {
  return request({
    url: `/shop/shopProduct/info/${id}`,
    method: "GET",
  });
}

// 删除商品
export function shopProductDelByIds(params) {
  return request({
    url: `/shop/shopProduct/delByIds?${qs.stringify(params, { arrayFormat: 'repeat' })}`,
    method: "GET",
  });
}

// 商品下线
export function shopProductPublish(params) {
  return request({
    url: `/shop/shopProduct/publish?${qs.stringify(params, { arrayFormat: 'repeat' })}`,
    method: "GET",
  });
}

// 审核设置
export function shopConfigSetting(data) {
  return request({
    url: "/shop/shopConfig/saveOrUpdate",
    method: "POST",
    data
  });
}

// 新增品类
export function shopCategorySaveOrUpdate(data) {
  return request({
    url: "/shop/shopCategory/saveOrUpdate",
    method: "POST",
    data
  });
}

// 查询品类，左右所有数据
export function shopCategoryQueryAll(params) {
  return request({
    url: "/shop/shopCategory/queryAll",
    method: "GET",
    params
  });
}

// 查询商品分类
export function shopCategoryTree(params) {
  return request({
    url: "/shop/shopCategory/tree",
    method: "GET",
    params
  });
}

// 品类删除
export function shopCategoryDeleteByIds(params) {
  return request({
    url: "/shop/shopCategory/deleteByIds",
    method: "GET",
    params
  });
}

// 添加品牌
export function shopBrandSaveOrUpdate(data) {
  return request({
    url: "/shop/shopBrand/saveOrUpdate",
    method: "POST",
    data
  });
}

// 品牌列表
export function shopBrandPage(params) {
  return request({
    url: "/shop/shopBrand/page",
    method: "GET",
    params
  });
}

// 删除品牌
export function shopBrandDelByIds(params) {
  return request({
    url: `/shop/shopBrand/delByIds?${qs.stringify(params, { arrayFormat: 'repeat' })}`,
    method: "GET",
  });
}

// 新增标签
export function shopTagSaveOrUpdate(data) {
  return request({
    url: "/shop/shopTag/saveOrUpdate",
    method: "POST",
    data
  });
}

// 标签列表
export function shopTagPage(params) {
  return request({
    url: "/shop/shopTag/listByPage",
    method: "GET",
    params
  });
}

// 删除标签
export function shopTagDelByIds(params) {
  return request({
    url: `/shop/shopTag/delByIds?${qs.stringify(params, { arrayFormat: 'repeat' })}`,
    method: "GET",
  });
}

