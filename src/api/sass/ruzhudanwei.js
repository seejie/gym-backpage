import request from "@/utils/request";
export function unitList(params) {
    return request({
      url: "/sys/unit/listUnit",
      method: "get",
      params
    });
  }