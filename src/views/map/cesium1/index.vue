<template>
  <div>
    <div id="cesiumContainer"></div>
    <dialog-drag v-show="LayerTreeVisible" id="dialog-2" class="dialog-3" title="图层目录" :options="{ top:100,left:50,width:280 }" @close="closeDataTree">
        <el-scrollbar :native="false" style="height:100%">
          <el-tree 
            show-checkbox
            :data="LayerTreeData" 
            :props="defaultProps"
            :render-content="renderContent">
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
    Load3dtiles,
    loadJsonLayer
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
        cesiumData: null,
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
    computed: {
      getLayerResources: function() {
        return this.$store.getters.cesium_data;
      }
    },
    watch: {
      getLayerResources(newVal, oldVal) {
        // this.cesiumData = val
        // console.log(newVal)
        this.LayerTreeData = []
        this.creatLayerTree(newVal)
      }
    },
    mounted() {
      this.cesiumData = this.$store.getters.cesium_data
      intCesium(this, CesiumNavigation)
      this.creatLayerTree(this.cesiumData)      
    },
    methods: {
      closeDataTree() {
        this.LayerTreeV = false
      },
      creatLayerTree(dataMap) {
        for (let [key, value] of dataMap) {
          let level1 = {
            label: key,
            children:[]
          }
          var temp = [];
          value.map(col => {
            this.loadLayer(col)

            if (
              !temp.some(tCol => {
                return tCol["type"] === col["type"]
              })
            ) {
              temp.push(col["type"]);
            }
          });
          for(let i in temp){
            let level2 = {
              label: temp[i],
              children: []
            }
            value.map(col => {
              if(col["type"] == temp[i]){
                var level3 = {
                  label:col["name"]
                }
                level2.children.push(level3)
              }
            })
            level1.children.push(level2)
          }
          this.LayerTreeData.push(level1)
        }
      },
      renderContent(h, { node, data, store }) {
        var icon = ["project","type","layer"];
        return (
          <span class="custom-tree-node">
            <span> 
              <svg-icon style="margin-right:8px" icon-class={icon[node.level-1]} />
              <span>{node.label}</span>
            </span>  
            <span>
              <el-button size="mini" type="text" on-click={ (event) => {this.remove(node, data, event)}}>删除</el-button>
            </span>     
          </span>
        )  
      },
      remove(node, data, event) {
        event.stopPropagation()  
        alert("re")
        console.log(node)
        // deleteProjectByName(data.label).then(res => {
        //   // console.log(res);
        //   this.$refs["tree"].remove(node, data)
        //   this.spatialData = []
        //   this.projectMessage = {}
        // })
      },
      loadLayer({ serverAddress, type, name, position }) {
        switch (type) {
          case "二维矢量":
            // var obj = AddJsonLayer(this.cesiumObjs.viewer, serverAddress, true);
            // this.tilesets.set(name, obj);
            break;
          case "三维倾斜测量":
            var obj = Load3dtiles(serverAddress, this.cesiumObjs.viewer);
            // this.tilesets.set(name, obj);
            break;
          case "BIM":
            var arr = position.split(",");
            var obj = Load3dtiles(serverAddress, this.cesiumObjs.viewer, arr);
            // this.tilesets.set(name, obj);
            break;
          default:
            break;
        }
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