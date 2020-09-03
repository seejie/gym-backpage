import request from "@/utils/request";

// 单位列表【查询自己以及所有下级C单位列表】
export function listSelfAndChildren() {
  return request({
    url: `/sys/unit/listSelfAndChildren`,
    method: "GET",
  });
}
