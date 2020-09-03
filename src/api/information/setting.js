import request from "@/utils/request";

// 查看配置详情
export function informationNewsPagesettingFind(params) {
  return request({
    url: "/cms/informationNewsPagesetting/find",
    method: "GET",
    params
  });
}

// 保存配置
export function informationNewsPagesettingSave(data) {
  return request({
    url: "/cms/informationNewsPagesetting/save",
    method: "POST",
    data
  });
}
