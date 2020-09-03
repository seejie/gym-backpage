const state = {
  formAddStatus:{
    showImgText: false,
    formRouter:'',
    fromSelectMaterial: false,
    fromSelectMaterialAdd: false
  },
}

const mutations = {
  setAddImageTextStatus: (state, payload) => {
    state.formAddStatus.showImgText=payload.showImgText;
    state.formAddStatus.formRouter=payload.formRouter;
    state.formAddStatus.fromSelectMaterial=payload.fromSelectMaterial;
  },
  setFromSelectMaterialAdd:(state, payload)=>{
    state.formAddStatus.fromSelectMaterialAdd=payload.fromSelectMaterialAdd;
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

