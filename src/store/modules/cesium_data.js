import { arrayEquals } from "@/utils/filterData.js"

const cesium_data = {
  state: {
    data: new Map()
  },

  mutations: {
    ADD_CESIUM_DATA: (state, resource) => {
      let val = state.data.get(resource.key) || []
      let a = new Set(val)
      let b = new Set(resource.value)
      let unionSet = new Set([...a,...b])
      if (arrayEquals(Array.from(unionSet), val)) {
        return
      }
      let data = state.data.set(resource.key,Array.from(unionSet))
      state.data = new Map(data)
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