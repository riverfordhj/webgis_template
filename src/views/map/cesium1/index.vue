<template>
  <div>
    <div id="cesiumContainer"></div>
    <dialog-drag v-show="LayerTreeVisible" id="dialog-2" class="dialog-3" title="图层目录" :options="{ top:100,left:50 }" @close="closeDataTree">
        <el-scrollbar :native="false" style="height:100%">
          <el-tree :data="LayerTreeData" :props="defaultProps">
          </el-tree>
        </el-scrollbar >  
    </dialog-drag>
    <div class="footer">
      <div class="footerItem" id="mouseHeightDiv">鼠标高度:{{cesiumObjs.mHeight}}米</div>
      <div class="footerItem" id="windowHeightDiv">视窗高度:{{cesiumObjs.wHeight}}米</div>
      <div class="footerItem" id="latitudeDiv">纬度:{{cesiumObjs.latitude}}度</div>
      <div class="footerItem" id="longitudeDiv">经度:{{cesiumObjs.longitude}}度</div>
    </div>
  </div>  
</template>

<script>
  import DialogDrag from 'vue-dialog-drag'
  import Cesium from "cesium/Cesium"
  import widgets from "cesium/Widgets/widgets.css"
  import CesiumNavigation from "cesium-navigation-es6"

  import store from "../../../store"

  import {
    intCesium,
  } from "./cesium";

  export default {
    name: '',
    components: {
      DialogDrag,
      // DropArea
    },
    data() {
      return {
        LayerTreeVisible:true,
        LayerTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        cesiumObjs: {
          viewer: undefined,
          mHeight: undefined,
          wHeight: undefined,
          latitude: undefined,
          longitude: undefined
        }
      }
    },
    mounted() {
      intCesium(this, CesiumNavigation)
    },
    methods: {
      closeDataTree() {
        this.LayerTreeV = false
      }
    }
  }
</script>

<style src='vue-dialog-drag/dist/vue-dialog-drag.css'></style>
<style src='vue-dialog-drag/dist/dialog-styles.css'></style>

<style>
  .dialog-3.dialog-drag .dialog-header{
    background-color: #304156;
  }
  .dialog-3.dialog-drag{
    background-color: white;
  }
  .dialog-drag .dialog-body{
    height: calc(100vh - 500px);
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>

<style scoped>
  #cesiumContainer {
    height: calc(100vh - 50px);
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .footer {
    left: 0px;
    right: 0px;
    bottom: 0px;
    position: absolute;
    z-index: 991;
    padding: 3px 10px;
    font-size: 13px;
    color: #e9e9e9;
    text-shadow: 2px 2px 2px #000;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .footerItem {
    float: right;
    min-width: 80px;
    margin-right: 20px;
    font-size: 13px;
    color: #e9e9e9;
    text-shadow: 2px 2px 2px #000;
  }
</style>

<style>
  .cesium-widget-credits {
    display: none !important;
    visibility: hidden !important;
  }
</style>