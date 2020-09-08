import request from "@/utils/request";
import getBlob from "@/utils/get-blob"

export function login (data) {
  return request({
    // url: "/denglu/userLogin",
    url: "/login",
    method: "post",
    data
  });
}

// export function login () {
//   return new Promise((res, rej) => {
//     const data = {"resCode":200,"message":null,"resObject":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi5rGf6IuP5L6o5ouT5L-h5oGv56eR5oqA5pyJ6ZmQ5YWs5Y-4MSIsImlkIjoiMiIsImV4cCI6MTYwMjE3MTA0NSwiaWF0IjoxNTk5NTc5MDQ1LCJqdGkiOiJhNTMwNzY3Mi0yMWViLTQ2NDQtYjEzMy1lZjQ0ZjBiYWIxNWEiLCJ0cyI6IjE1OTk1NzkwNDUifQ.FuJ2_ls5urtpq7-1NB-vts_0sQorfjxjI1ZvRFemBP4","level":2,"name":"江苏侨拓信息科技有限公司1","headUrl":"http://uploadceshi.njlime.com/file_1591622156263.jpeg","unitId":2}}
//     res(data)
//   })
// }

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

// export function logininfo (params) {
//   return request({
//     url: '/denglu/logininfo',
//     method: 'get',
//     params
//   })
// }

export function logininfo () {
  return new Promise((res, rej) => {
    const data = {"copyright":"小清柠技术支持 版权所有 南京来檬信息科技有限公司 备案号","beianUrl":"http://www.beian.miit.gov.cn/","shareTitle":"小清柠社群营销服务平台","shareIcon":"http://upload.njlime.com/favicon.ico","sysLogo":"","indexLogo":"","sysName":"test","resCode":200,"说明":"本单位没有配置数据或者参数没有带url，调用admin的配置数据","beianInfo":"苏ICP备17024429号"}
    res(data)
  })
}
