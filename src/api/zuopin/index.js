import request from "@/utils/request";
import qs from 'qs'
// list列表
export function list(params) {
  return new Promise((resolve, reject) => {
    request({
      url: "/worksmanager/listWorks",
      method: "GET",
      params
    }).then(res => resolve(res)).catch(error => reject(error));
  });
}

// 删除
export function del(data) {
  return new Promise((resolve, reject) => {
    request({
      url: "/worksmanager/deleteWorks",
      method: "POST",
      data
    }).then(res => resolve(res)).catch(error => reject(error));
  });
}

// 设置状态
export function status(data) {
  return new Promise((resolve, reject) => {
    request({
      url: "/worksmanager/setWorksStatus",
      method: "POST",
      data
    }).then(res => resolve(res)).catch(error => reject(error));
  });
}


// 查询品类，左右所有数据
// export function worksCategoryQueryAll(params) {
//   return request({
//     url: "/storemanager/listWorksCateory",
//     method: "GET",
//     params
//   });
// }


// // 品类删除
// export function worksCategoryDeleteByIds(params) {
//   return request({
//     url: "/storemanager/deleteWorksCateory",
//     method: "POST",
//     params
//   });
// }
