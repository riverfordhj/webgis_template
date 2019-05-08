const cesium_data = {
  state: {
    data: new Map()
  },

  mutations: {
    ADD_CESIUM_DATA: (state, resource) => {
      state.data.set(resource.key, resource.value)
      // addWithDeduplication(state.esri_resources,resource);
      // state.esri_resources = Array.from(new Set(state.esri_resources))
    },
    REMOVE_CESIUM_DATA: (state, resource) => {
      state.data.delete(resource.key)
      //   deleteItem(state.esri_resources,resource,"serverAddress");
      // },
    },
  },

  actions: {
    AddCesiumData({ commit }, resource) {
      commit('ADD_CESIUM_DATA', resource)
    },
    RemoveCesiumData({ commit }, name) {
      commit('REMOVE_CESIUM_DATA', name)
    }
  }

}



// function deleteItem(arr, val, key) {
//   var filterObj = arr.filter(d => {
//     return d[key] === val;
//   });
//   var index = arr.indexOf(filterObj[0]);
//   if (index > -1)  arr.splice(index, 1); 
// }

// function addWithDeduplication(arr, item) {
//   if (arr.indexOf(item) > -1) {
//     return;
//   }
//   arr.push(item)
// } 


export default cesium_data