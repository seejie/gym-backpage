
import request from "@/utils/request";

// 添加标签
export function informationLabelAdd(data) {
  return request({
    url: "/cms/informationLabel/add",
    method: "POST",
    data
  });
}

// 删除标签
export function informationLabelDelete(data) {
  return request({
    url: "/cms/informationLabel/delete",
    method: "POST",
    data
  });
}

// 修改标签
export function informationLabelUpdate(data) {
  return request({
    url: "/cms/informationLabel/update",
    method: "POST",
    data
  });
}

// 查看标签详情
export function informationLabelFind(params) {
  return request({
    url: "/cms/informationLabel/find",
    method: "GET",
    params
  });
}

// 分页查看标签列表
export function informationLabelListPage(params) {
  return request({
    url: "/cms/informationLabel/listPage",
    method: "GET",
    params
  });
}
