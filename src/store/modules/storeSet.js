import app from "../../main.js"
const state = {
    storeSeting: {},
    addGoodsStyle: 1,
}

const mutations = {
    SET_STORE_CONFIG: (state, data) => {
        state.storeSeting = data
        state.addGoodsStyle = data.addGoodsStyle || 1
    }
}

const actions = {
    getStoreConfig({
        commit
    }) {
        app.$ajax
            .get(`/storemanager/map-setting/get?unitId=4&channelType=11`)
            .then(res => {
                if (res.resObject && res.resCode === 200) {
                    if (res.resCode === 200) {
                        //  console.log(resObject)
                        commit('SET_STORE_CONFIG', res.resObject);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}