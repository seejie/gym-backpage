import { login, logout, getInfo, jcaptcha, logininfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setUserLevel, setUserToken, getUserToken} from '@/utils/storage'
import router, { resetRouter } from '@/router'
import settings from '@/settings'

// 动态添加favicon图标
function addFavicon(url) {
  var docHead = document.getElementsByTagName('head')[0];
  var newLink = document.createElement('link');
  newLink.rel = 'shortcut icon';
  newLink.type = 'image/x-icon';
  newLink.href = url;
  docHead.appendChild(newLink);
}

const state = {
  token: getUserToken(),
  name: '',
  avatar: '',
  loginName: '',
  mobileLogin: '',
  userLevel: '',
  roles: [],
  share_title: '',
  index_logo: '',
  sys_logo: '',
  share_icon: '',
  loginInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_LOGINNAME: (state, loginName) => {
    state.loginName = loginName;
  },
  SET_MOBILELOGIN: (state, mobileLogin) => {
    state.mobileLogin = mobileLogin;
  },
  SET_USERLEVEL: (state, userLevel) => {
    state.userLevel = userLevel
  },
  SET_SHARE_TITLE: (state, title) => {
    state.share_title = title;
  },
  SET_INDEX_LOGO: (state, logo) => {
    state.index_logo = logo;
  },
  SET_SYS_LOGO: (state, logo) => {
    state.sys_logo = logo;
  },
  SET_SHARE_ICON: (state, icon) => {
    state.share_icon = icon;
  },
  SET_LOGIN_INFO: (state, loginInfo) => {
    state.loginInfo = loginInfo;
  },
}

const actions = {
  jcaptcha({ commit}, params) {
    return jcaptcha(params)
      .then(res => {
        if (typeof res.headers.token !== 'string') {
          console.error('验证码接口未返回token');
          return;
        }
        commit('SET_TOKEN', res.headers.token);
        // setToken(res.headers.token);
        return res.data
      })
      .catch(e => {
        console.error(e);
      })
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password, validateCode } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, validateCode: validateCode }).then(response => {
        // setToken(response.resObject.token)
        setUserLevel(response.resObject.level)
        setUserToken(response.resObject.token)
        // commit('SET_NAME', response.resObject && response.resObject.name)

        window.localStorage.setItem('userInfo', JSON.stringify(response.resObject))

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { resObject } = response

        if (!resObject) {
          reject('Verification failed, please Login again.')
        }

        const {  name, loginName, mobileLogin, head_url, userLevel }  = resObject

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        //commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', head_url)
        commit('SET_LOGINNAME', loginName)
        commit('SET_MOBILELOGIN', mobileLogin)
        commit('SET_USERLEVEL', userLevel)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  logininfo({ commit }, params) {
    return logininfo(params).then(res => {
      document.title = res.share_title;
      addFavicon(res.share_icon);
      commit('SET_SHARE_TITLE', res.share_title);
      commit('SET_INDEX_LOGO', res.index_logo);
      commit('SET_SYS_LOGO', res.sys_logo);
      commit('SET_SHARE_ICON', res.share_icon)
    }).catch(() => {
      document.title = settings.title;
      commit('SET_SHARE_TITLE', '小清柠自媒体管理系统');
      commit('SET_INDEX_LOGO', require('@/assets/login/logo.png'));
      commit('SET_SYS_LOGO', require('@/assets/layout/logo-title.png'));
      commit('SET_SHARE_ICON', require('@/assets/layout/logo.png'))
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      // setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
