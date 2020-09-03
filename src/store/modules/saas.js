import { bindOpenPlateform } from '@/api/sass/plateformBind'

const state = {
  token: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {

  // 开放平台绑定
  bindOpnPlat({ commit }, params) {
    const { appId, appSecret, token, key } = params
    debugger
    return new Promise((resolve, reject) => {
      bindOpenPlateform({ appid: appId, appsecret: appSecret, access_token: token, encryption_key: key }).then(response => {
        // commit('SET_NAME', response.resultList && response.resultList.name)
        debugger
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
