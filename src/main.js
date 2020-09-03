import Vue from 'vue';
import 'vue-area-linkage/dist/index.css';
import VueAreaLinkage from 'vue-area-linkage';
import Cookies from 'js-cookie';
import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import Element from 'element-ui';
import './styles/element-variables.scss';
import moment from 'moment';
import '@/styles/index.scss'; // global css
//import '@/views/mall/mallCommon.scss';
import App from './App';
import store from './store';
import router from './router';

import './icons'; // icon
// import './permission' // permission control
import './utils/error-log'; // error log
import globalComponents from '@/utils/globalComponents';
import * as filters from './filters'; // global filters
import ajax from '@/utils/request';
import axios from 'axios';

Vue.prototype.$moment = moment;
Vue.prototype.$ajax = ajax;
Vue.prototype.axios = axios;
Vue.prototype.duplicateRemoval = obj => {
  for (var i in obj) {
    if (obj[i] === null) {
      delete obj[i];
    }
  }
  return obj;
};
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
});
Vue.use(VueAreaLinkage);
Vue.use(globalComponents);
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

export default new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
