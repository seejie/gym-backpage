import axios from 'axios';
import settings from '@/settings';
import { getUserToken, setUserToken } from '@/utils/storage'
import app from '../../main.js'
import { Message } from 'element-ui';

const idfv = { idfv: 'backend' }
let XQN_BASE = localStorage.getItem('XQN_BASE');
try {
  XQN_BASE = XQN_BASE ? JSON.parse(XQN_BASE) : {}
} catch (error) {
  XQN_BASE = {}
}

var loading_count = 0;
axios.interceptors.request.use((config) => {
  loading_count++;
  // store.commit("CHANGE_LOADING", loading_count);
  config.timeout = config.timeout || 10000;
  return new Promise((resolve, reject) => {
    resolve(config);
  })
}, (error) => {
  loading_count--;
  // store.commit("CHANGE_LOADING", loading_count);
});

axios.interceptors.response.use((response) => {
  loading_count--;
  // store.commit("CHANGE_LOADING", loading_count);
  return new Promise((resolve, reject) => {
    console.log('resolve', response)
    if (response.data.resCode == 200 || response.data.resCode == 6 || response.data.code == 200) {
      resolve(response.data);
    } else if (response.data.appId) {
      resolve(response.data);
    } else {
      reject(response.data);
    }
  }).catch((res) => {
    if (res.resCode == 445) {
      setUserToken('')
      app.$router.push(`/login?redirectlogout=${app.$route.fullPath}`)
    } else {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5000,
      });
    }
  })
}, (error) => {
  loading_count--;
  // store.commit("CHANGE_LOADING", loading_count);
  console.error(error);
  if (typeof error.message === 'string') {
    // Toast(error.message);
  } else {
    // Toast("服务器异常！");
  }
});

// var token = 'oqR5q04A81bcEvu_Hqu0BY3dufMA';
// if (process.env.NODE_ENV === 'development') {
//   token = 'oqR5q04A81bcEvu_Hqu0BY3dufMA';
// }
// const { token } = store.getters;

const token = getUserToken()
console.log(getUserToken())

function request (url, data, method = 'GET') {
  const obj = {
    unitId: XQN_BASE.unitId,
    idfv: 'backend'
  }
  // const dataCur = data ? Object.assign(data) : obj;
  const dataCur = data || obj;

  const opt = {
    headers: {
      authorization: token || '',
      idfv: idfv.idfv,
      // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      // 'Content-Type': 'application/json;charset=UTF-8'
    },
    baseURL: settings.baseURL,

    method: method === 'POST' ? 'POST' : 'GET',
  };
  if (method === 'POST') {
    opt.data = dataCur;
    opt.transformRequest = [function (data) {
      let ret = '';
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  } else { // 默认GET
    opt.params = { ...dataCur };
  }
  return axios(url, opt);
}

// function upload (file) {
//   return new Promise((resolve, reject) => {
//     request(TokenUrl).then(res => {
//       QiNiuYunUpload(file, res.resObject.token).then(result => {
//         if (result && result.key) {
//           resolve(res.resObject.qiNiuYunUrl + '/' + result.key);
//         }
//         reject(result);
//       }).catch(err => {
//         console.error("上传文件异常: ", err);
//         reject(err);
//       })
//     }).catch(tokenErr => {
//       console.error("获取token异常: ", tokenErr);
//       reject(tokenErr);
//     })
//   })
// };

const api = {
  request: request,
  // upload: upload
}

export default api;
