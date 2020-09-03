import request from "@/utils/request";
import settings from "@/settings";
import getBlob from "@/utils/get-blob"

export function login (data) {
  return request({
    // url: "/denglu/userLogin",
    url: "/login",
    method: "post",
    data
  });
}

export function getInfo (token) {
  return request({
    url: "/denglu/getUserByToken",
    method: "get"
  });
}

export function jcaptcha (params) {
  return getBlob({
    url: '/jcaptcha',
    params,
  })
}


export function logout () {
  return request({
    url: "/logout",
    method: "get"
  });
}

export function logininfo (params) {
  return request({
    url: '/denglu/logininfo',
    method: 'get',
    params
  })
}
