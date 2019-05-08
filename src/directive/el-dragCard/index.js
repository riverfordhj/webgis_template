import drag from './drag'

const install = function(Vue) {
  Vue.directive('el-drag-card', drag)
}

if (window.Vue) {
  window['el-drag-card'] = drag
  Vue.use(install); // eslint-disable-line
}

drag.install = install
export default drag
