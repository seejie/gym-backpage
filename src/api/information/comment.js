import request from "@/utils/request";
import deleteEmptyParams from  "@/utils/deleteEmptyParams";

// 修改评论
export function informationCommentUpdate(data) {
  return request({
    url: "/cms/informationComment/update",
    method: "POST",
    data
  });
}

// 批量下线
export function informationCommentBatchDown(data) {
  return request({
    url: "/cms/informationComment/batchDown",
    method: "POST",
    data
  });
}

// 批量上线
export function informationCommentBatchUp(data) {
  return request({
    url: "/cms/informationComment/batchUp",
    method: "POST",
    data
  });
}

// 删除评论
export function informationCommentDelete(data) {
  return request({
    url: "/cms/informationComment/delete",
    method: "POST",
    data
  });
}

// 分页查看评论列表
export function informationCommentListPage(params) {
  return request({
    url: "/cms/informationComment/listPage",
    method: "GET",
    params: deleteEmptyParams(params)
  });
}

// 查看评论详情
export function informationCommentFind(params) {
  return request({
    url: "/cms/informationComment/find",
    method: "GET",
    params
  });
}
