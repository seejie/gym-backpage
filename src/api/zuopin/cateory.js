import request from "@/utils/request";
import qs from 'qs'



// 新增品类
export function worksCategorySaveOrUpdate(data) {
  return request({
    url: "/worksmanager/saveWorksCateory",
    method: "POST",
    data
  });
}

// 查询品类，左右所有数据
export function worksCategoryQueryAll(params) {
  return request({
    url: "/worksmanager/listWorksCateory",
    method: "GET",
    params
  });
}


// 品类删除
export function worksCategoryDeleteByIds(data) {
  return request({
    url: "/worksmanager/deleteWorksCateory",
    method: "POST",
    data
  });
}
