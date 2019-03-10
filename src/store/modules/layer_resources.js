const layer_resources = {
  state:{
    esri_resources:[],
    cesium_resources:[{
      layerName:"云南市界图层",
      type:"二维JSON",
      url:"http://202.114.148.160/sogbTo3dtiles/GeoJSON/yunnanshi.json",
      visible:true
    },{
      layerName:"董家村模型",
      type:"三维倾斜测量",
      url:"http://202.114.148.160/sogbTo3dtiles/DongJiaCun/tileset.json",
      visible:true
    },{
      layerName:"关坝河模型",
      type:"三维倾斜测量",
      url:"http://202.114.148.160/sogbTo3dtiles/GuanBaHe/tileset.json",
      visible:true
    }]
  },

  mutations:{
    ADD_ESRI_RESOURCES:(state,resource) =>{
      state.esri_resources.push(resource)
    },
    ADD_CESIUM_RESOURCES:(state,resource) =>{
      state.cesium_resources.push(resource)
    }
  },

  actions:{
    AddEsriResources({ commit }, resource){
      commit('ADD_ESRI_RESOURCES',resource)
    },
    AddCesiumResources({ commit }, resource){
      commit('ADD_CESIUM_RESOURCES',resource)
    }
  }

}

export default layer_resources