import request from "@/utils/request";
import deleteEmptyParams from "@/utils/deleteEmptyParams";

// 添加资讯
export function informationAdd(data) {
  return request({
    url: "/cms/information/add",
    method: "POST",
    data
  });
}

// 批量删除
export function informationBatchDelete(data) {
  return request({
    url: "/cms/information/batchDelete",
    method: "POST",
    data
  });
}

// 批量下线
export function informationBatchDown(data) {
  return request({
    url: "/cms/information/batchDown",
    method: "POST",
    data
  });
}

// 批量上线
export function informationBatchUp(data) {
  return request({
    url: "/cms/information/batchUp",
    method: "POST",
    data
  });
}

// 删除资讯
export function informationDelete(data) {
  return request({
    url: "/cms/information/delete",
    method: "POST",
    data
  });
}

// 修改资讯
export function informationUpdate(data) {
  return request({
    url: "/cms/information/update",
    method: "POST",
    data
  });
}

// 查看资讯详情
export function informationFind(params) {
  return request({
    url: "/cms/information/find",
    method: "GET",
    params
  });
}

// 分页查看资讯列表
export function informationListPage(params) {
  return request({
    url: "/cms/information/listPage",
    method: "GET",
    params: deleteEmptyParams(params)
  });
}

// 置顶
export function informationTop(data) {
  return request({
    url: "/cms/information/top",
    method: "POST",
    data
  });
}

// 取消置顶
export function informationUntop(data) {
  return request({
    url: "/cms/information/untop",
    method: "POST",
    data
  });
}

// 禁言
export function informationBan(data) {
  return request({
    url: "/cms/information/ban",
    method: "POST",
    data
  });
}

// 取消禁言
export function informationUnban(data) {
  return request({
    url: "/cms/information/unban",
    method: "POST",
    data
  });
}
