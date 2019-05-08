import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import layer_resources from './modules/layer_resources'
import cesium_data from './modules/cesium_data'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    layer_resources,
    cesium_data,
    permission
  },
  getters
})

export default store
