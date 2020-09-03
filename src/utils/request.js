import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import settings from '@/settings';
import { getUserToken } from '@/utils/storage';
import { setUserToken } from '@/utils/storage';
import app from '../main.js';

const idfv = { idfv: 'backend' };

// create an axios instance
const service = axios.create({
  baseURL: settings.baseUrl, //process.env.VUE_APP_BASE_API, // url = base url + request url
  //withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // const { token } = store.getters;
    const token = getUserToken();

    if (token) {
      config.headers.authorization = token;
    }
    config.headers.idfv = idfv.idfv;
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;

    if (res.resCode == '445') {
      setUserToken('');
      app.$router.push(`/login?redirectlogout=${app.$route.fullPath}`);
      return res;
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.resCode != 200 && res.resultCode != '0000' && res.code != 200 && res.resultCode != '200' && res.code != 0) {
      // 100008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.resCode == 999) {
        MessageBox.confirm('您的身份认证已过期，您可以选择取消留在此页或者选择重新登录', '确认是否重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload();
          });
        });
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5000,
        });
      }

      return Promise.reject(new Error(res.message || 'Error'));
    }

    return res;
  },
  error => {
    const { response } = error;

    if (response) {
      const message = response.data.message || response.data || error.message;

      Message({
        // 需要确认res.body中错误码字段名
        message,
        type: 'error',
        duration: 5000,
      });
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5000,
      });
    }

    return Promise.reject(error);
  }
);

export default service;
