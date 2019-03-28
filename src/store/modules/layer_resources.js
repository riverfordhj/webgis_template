const layer_resources = {
  state:{
    esri_resources:[],
    cesium_resources:[
      // {
      // name:"云南市界图层",
      // type:"二维JSON",
      // serverAddress:"http://202.114.148.160/sogbTo3dtiles/GeoJSON/yunnanshi.json",
      // visible:true
      // },
    // {
    //   layerName:"董家村模型",
    //   type:"三维倾斜测量",
    //   url:"http://202.114.148.160/sogbTo3dtiles/DongJiaCun/tileset.json",
    //   visible:true
    // },
    // {
    //   layerName:"关坝河模型",
    //   type:"三维倾斜测量",
    //   url:"http://202.114.148.160/sogbTo3dtiles/GuanBaHe/tileset.json",
    //   visible:true
    // }
  ]
  },

  mutations:{
    ADD_ESRI_RESOURCES:(state, resource) => {
      addWithDeduplication(state.esri_resources,resource);
      // state.esri_resources = Array.from(new Set(state.esri_resources))
    },
    ADD_CESIUM_RESOURCES:(state, resource) => {
      addWithDeduplication(state.cesium_resources,resource);
    },
    REMOVE_ESRI_RESOURCES:(state, resource) => {
      deleteItem(state.esri_resources,resource,"serverAddress");
    },
    REMOVE_CESIUM_RESOURCES:(state, resource) => {
      deleteItem(state.cesium_resources,resource,"name"); 
    }
  },

  actions:{
    AddEsriResources({ commit }, resource){
      commit('ADD_ESRI_RESOURCES', resource)
    },
    AddCesiumResources({ commit }, resource){
      commit('ADD_CESIUM_RESOURCES', resource)
    },
    AddResources({ commit }, resource){
      var data = resource.data;
      switch(data.type) {
        case "二维矢量":
          commit('ADD_ESRI_RESOURCES', data)      
          break;
        case "BIM":
          commit('ADD_CESIUM_RESOURCES', data)
          break;
        case "三维倾斜测量":
          commit('ADD_CESIUM_RESOURCES', data)
          break;
        default:
          break;
      }
    },
    RemoveEsriResources({ commit }, id) {
      commit('REMOVE_ESRI_RESOURCES', id)
    },
    RemoveCesiumResources({ commit }, name) {
      commit('REMOVE_CESIUM_RESOURCES', name)
    }
  }

}



function deleteItem(arr, val, key) {
  var filterObj = arr.filter(d => {
    return d[key] === val;
  });
  var index = arr.indexOf(filterObj[0]);
  if (index > -1)  arr.splice(index, 1); 
}

function addWithDeduplication(arr, item) {
  if (arr.indexOf(item) > -1) {
    return;
  }
  arr.push(item)
} 


export default layer_resources