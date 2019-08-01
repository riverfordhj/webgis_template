<template>
  <div>
    <div id="cesiumContainer">
    </div>
    <toolbar @openLayerTreePanel="openLayerTreePanel" :viewer="cesiumObjs.viewer" />  
    <div id="tooltip" class="tooltip"></div>
    <!-- <div id="areaTooltip" class="tooltip"></div>
    <div id="heightTooltip" class="tooltip"></div> -->
    <dialog-drag v-show="LayerTreeVisible" id="dialog-2" class="dialog-3" title="图层目录" :options="{ width:280 }" @close="closeDataTree">
        <el-scrollbar :native="false" style="height:100%">
          <el-tree 
            show-checkbox
            :data="LayerTreeData" 
            :props="defaultProps"
            @node-click="handleNodeClick"
            @check="handleCheckChange"
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
import DialogDrag from "vue-dialog-drag";
import Cesium from "cesium/Cesium";
import widgets from "cesium/Widgets/widgets.css";
import CesiumNavigation from "cesium-navigation-es6";
import toolbar from "./toolbar/index.vue";
import store from "../../../store";

import {
  intCesium,
  Load3dtiles,
  loadJsonLayer,
  FlyToTileSet,
  FlyToJsonLayer
} from "./cesium";

import jsondata from "@/assets/json/yunnanshi.json";

export default {
  name: "",
  components: {
    DialogDrag,
    toolbar
    // DropArea
  },
  data() {
    return {
      LayerTreeVisible: false,
      LayerTreeData: [],
      cesiumData: null,
      layerDataMap: new Map(),
      defaultProps: {
        children: "children",
        label: "label"
      },
      cesiumObjs: {
        viewer: undefined,
        mHeight: undefined,
        wHeight: undefined,
        latitude: undefined,
        longitude: undefined
      }
    };
  },
  computed: {
    getLayerResources: function() {
      return this.$store.getters.cesium_data;
    }
  },
  watch: {
    getLayerResources(newVal, oldVal) {
      // this.cesiumData = val
      // console.log(newVal);
      this.LayerTreeData = [];
      // debugger;
      this.creatLayerTree(newVal);
    }
  },
  mounted() {
    this.cesiumData = this.$store.getters.cesium_data;
    intCesium(this, CesiumNavigation, jsondata);
    this.creatLayerTree(this.cesiumData);
  },
  methods: {
    closeDataTree() {
      this.LayerTreeVisible = false;
    },
    creatLayerTree(dataMap) {
      for (let [key, value] of dataMap) {
        let level1 = {
          label: key,
          children: []
        };
        var temp = [];
        value.map(col => {
          this.loadLayer(col);
          // debugger
          if (
            !temp.some(type => {
              // debugger
              return type === col["type"];
            })
          ) {
            // debugger
            temp.push(col["type"]);
          }
        });
        for (let i in temp) {
          let level2 = {
            label: temp[i],
            children: []
          };
          value.map(col => {
            if (col["type"] == temp[i]) {
              var level3 = {
                label: col["name"]
              };
              level2.children.push(level3);
            }
          });
          level1.children.push(level2);
        }
        this.LayerTreeData.push(level1);
      }
    },
    renderContent(h, { node, data, store }) {
      var icon = ["type", "layer"];
      if (node.level === 1) {
        return (
          <span class="custom-tree-node">
            <span>
              <svg-icon style="margin-right:8px" icon-class="project" />
              <span>{node.label}</span>
            </span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={event => {
                  this.remove(node, data, event);
                }}
              >
                移除
              </el-button>
            </span>
          </span>
        );
      }

      return (
        <span class="custom-tree-node">
          <span>
            <svg-icon
              style="margin-right:8px"
              icon-class={icon[node.level - 2]}
            />
            <span>{node.label}</span>
          </span>
        </span>
      );
    },
    handleNodeClick(data, node, component) {
      if (node.level === 3) {
        let target = this.layerDataMap.get(data.label);
        switch (target.type) {
          case "三维倾斜测量":
          case "BIM":
          case "点云":
            FlyToTileSet(target.obj, this.cesiumObjs.viewer);
            break;
          case "JSON":
            FlyToJsonLayer(target.obj, this.cesiumObjs.viewer);
            break;
          default:
            break;
        }
      }
    },
    handleCheckChange(data, node) {
      for (let [key, value] of this.layerDataMap) {
        switch (value.type) {
          case "三维倾斜测量":
          case "BIM":
          case "点云":
            value.obj.show = false;
            break;
          case "JSON":
            value.obj.show = false;
            break;
          default:
            break;
        }
      }

      // var target = this.layerDataMap.get(data.label);
      // console.log({data, node})
      node.checkedNodes.map(checkedNode => {
        let target = this.layerDataMap.get(checkedNode.label);
        if (target) {
          switch (target.type) {
            case "三维倾斜测量":
            case "BIM":
            case "点云":
              target.obj.show = true;
              break;
            case "JSON":
              target.obj.show = true;
              break;
          }
        }
      });
      // node.checkedNodes
    },
    remove(node, data, event) {
      event.stopPropagation();
      // alert("re")s)
      // debugger
      
      // this.cesiumObjs.viewer.dataSources.removeAll(true)
      for (let [key, value] of this.layerDataMap) {
        switch (value.type) {
          case "三维倾斜测量":
          case "BIM":
          case "点云":
            this.cesiumObjs.viewer.scene.primitives.remove(value.obj)
            break;
          case "JSON":
            this.cesiumObjs.viewer.dataSources.remove(value.obj)
            break;
          default:
            break;
        }
      }
      
      // var len = this.cesiumObjs.viewer.dataSources.length;
      // if(len > 0){
      //   console.log(len)
      //   for(var n = 0; n < len; n++){
      //     //每删除一条viewer.dataSources，len就会减少1
      //     console.log(this.cesiumObjs.viewer.dataSources.get(0))
      //     this.cesiumObjs.viewer.dataSources.remove(this.cesiumObjs.viewer.dataSources.get(0));
      //   }
      // }
      // this.cesiumObjs.viewer.scene.primitives.destroy();
      
      this.layerDataMap = new Map()

      store.dispatch("RemoveCesiumData", node.label);
      // deleteProjectByName(data.label).then(res => {
      //   // console.log(res);
      //   this.$refs["tree"].remove(node, data)
      //   this.spatialData = []
      //   this.projectMessage = {}
      // })
    },
    loadLayer({ serverAddress, type, name, position }) {
      var _this = this;
      switch (type) {
        case "JSON":
          var obj = loadJsonLayer(
            this.cesiumObjs.viewer,
            serverAddress,
            function(datasource) {
              _this.layerDataMap.set(name, { type: type, obj: datasource });
            }
          );
          // this.layerDataMap.set(name, {type:type, obj: obj})
          break;
        case "二维矢量":
          // var obj = AddJsonLayer(this.cesiumObjs.viewer, serverAddress, true);
          // this.tilesets.set(name, obj);
          // var obj = loadJsonLayer(this.cesiumObjs.viewer, serverAddress)

          this.layerDataMap.set(name, { type: type, obj: obj });
          break;
        case "三维倾斜测量":
          var obj = Load3dtiles(serverAddress, this.cesiumObjs.viewer);
          // this.tilesets.set(name, obj);
          this.layerDataMap.set(name, { type: type, obj: obj });
          break;
        case "BIM":
        case "点云":
          var arr = position.split(",");
          var obj = Load3dtiles(serverAddress, this.cesiumObjs.viewer, arr);
          // this.tilesets.set(name, obj);
          this.layerDataMap.set(name, { type: type, obj: obj });
          break;
        default:
          break;
      }
    },
    openLayerTreePanel(bool) {
      this.LayerTreeVisible = true;
    }
  }
};
</script>

<style src='vue-dialog-drag/dist/vue-dialog-drag.css'></style>
<style src='vue-dialog-drag/dist/dialog-styles.css'></style>

<style>
.dialog-3.dialog-drag .dialog-header {
  background-color: #304156;
}
.dialog-3.dialog-drag {
  background-color: white;
}
.dialog-drag .dialog-body {
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
.tooltip {
  color: #e9e9e9;
  text-shadow: 2px 2px 2px #000;
  background-color: rgba(0, 0, 0, 0.4);
  display: none;
}
</style>

<style>
.cesium-widget-credits {
  display: none !important;
  visibility: hidden !important;
}
</style>