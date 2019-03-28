<template>
  <div>
    <div id="cesiumContainer"></div>
    <div id="menu">
      <el-card class="box-card">
        <el-tree
          :data="tree_data"
          show-checkbox
          node-key="id"
          @check-change="handleCheckChange"
          @node-click="handleNodeClick"
          :default-checked-keys="defaultChecked"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
  import Cesium from "cesium/Cesium";
  import widgets from "cesium/Widgets/widgets.css";

  import ElementUI from "element-ui";
  import "element-ui/lib/theme-chalk/index.css";

  import store from '../../../store'

  import {
    Init,
    AddJsonLayer,
    Load3dtiles1,
    FlyTo_TileSet,
    FlyTo_JsonData
  } from "./cesium";
  import jsondata from "@/assets/json/yunnanshi.json";

  export default {
    name: '',
    data() {
      return {
        checked: true,
        tree_data: [],
        cesium_resources: [],
        tilesets: new Map(),
        defaultChecked: [],
        cesiumObjs: {
          viewer: undefined
        }
      };
    },
    computed: {
      getLayerResources: function() {
        return this.$store.getters.cesium_resources;
      }
    },
    watch: {
      getLayerResources(val) {
        this.cesium_resources = val;
        this.react();
      }
    },
    mounted(){
      var self = this;
      this.cesium_resources = this.$store.getters.cesium_resources;
      this.createMap(self);
      this.react();
    },
    methods: {
      createMap(self){
        Init(jsondata, self)
      },
      react(){
        this.tree_data = [];
        this.cesium_resources.map((d, i) => {
          this.creatTree(d.name, i);
          this.addLayers(d);
          this.defaultChecked.push(i);
        });
      },
      creatTree(label, id){
        this.tree_data.push({
          label: label,
          id: id
        });
      },
      addLayers({serverAddress, type, name, position}){
        //此处以后要改为Map
        switch (type) {
          case "二维JSON":
            var obj = AddJsonLayer(this.cesiumObjs.viewer, serverAddress, true);
            this.tilesets.set(name, obj);
            break;
          case "三维倾斜测量":
            var obj = Load3dtiles1(serverAddress, this.cesiumObjs.viewer);
            this.tilesets.set(name, obj);
            break;
          case "BIM":
            var arr = position.split(",");
            var obj = Load3dtiles1(serverAddress, this.cesiumObjs.viewer, arr)
            this.tilesets.set(name, obj);
            break;
          default:
            break;
        }
      },
      remove(node, data) {
        this.tilesets.delete(data.label);
        this.cesiumObjs.viewer.scene.primitives.removeAll();
        store.dispatch('RemoveCesiumResources', data.label);
      },
      handleCheckChange(data, checked, indeterminate) {
        var target = this.tilesets.get(data.label);
        if (data.label.match("模型")) {
          target.show = checked;
        } else {
          target.then(function(dataSource) {
            dataSource.entities.show = checked;
          });
        }
      },
      handleNodeClick(data) {
        var target = this.tilesets.get(data.label);
        if (!target) {
          return;
        }
        if (data.label.match("模型")) {
          FlyTo_TileSet(target, this.cesiumObjs.viewer);
        } else {
          FlyTo_JsonData(target, this.cesiumObjs.viewer);
        }
      },
    }
  }
</script>

<style scoped>
  #cesiumContainer {
    height: calc(100vh - 50px);
  }
  .backdrop {
    display: block;
    background: rgba(42, 42, 42, 0.9);
    border-radius: 5px;
    border: 1px solid #444;
    padding: 5px 10px;
    color: #fff;
    line-height: 150%;
    font-size: small;
  }
  #menu {
    position: absolute;
    left: 10px;
    top: 10px;
  }

  .nowrap {
    white-space: nowrap;
  }

  /* .backdrop a:link,
  .backdrop a:visited,
  .backdrop a:hover {
    color: #fff;
  } */
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>