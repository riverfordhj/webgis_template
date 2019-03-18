<template>
  <div>
    <div id="cesiumContainer"></div>
    <!-- <div class="backdrop" id="menu">
      <div class="nowrap">
         <input id="baselayer1" type="checkbox" checked>
        <label for="baselayer">云南市</label>
        <el-checkbox id="baselayer" v-model="checked">云南市界图层</el-checkbox>
        <el-checkbox id="djcmodel" v-model="djcmodel" >董家村模型</el-checkbox>
        <el-checkbox id="gbhmodel" v-model="gbhmodel" >关坝河模型</el-checkbox>
      </div>
    </div> -->
    
    <div id="menu">
      <el-card class="box-card">
        <!-- <el-tree
          :data="tree_data"
          show-checkbox
          @check-change="handleCheckChange"
          @node-click="handleNodeClick"
          :indent=0
          :draggable=true
          :allow-drop="allowDrop"
          :default-checked-keys="defaultChecked" 
          :props="defaultProps"
          node-key="id">
        </el-tree> -->
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
// import kmldata from "@/assets/kml/yunnanshi.kml";

export default {
  name: "CesiumViewer",
  data() {
    return {
      checked: true,
      djcmodel: true,
      gbhmodel: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      tree_data: [
        //   {
        //   id: 1,
        //   label: '地图底图',
        //   children: [{
        //     id: 2,
        //     label: '云南市界图层',
        //   }]
        // },{
        //   id: 3,
        //   label: '三维模型',
        //   children: [{
        //     id: 4,
        //     label: '董家村模型',
        //   },{
        //     id: 5,
        //     label: '关坝河模型'
        //   }]
        // }
      ],
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
      this.CreatTree();
    }
  },
  mounted() {
    var self = this;
    this.cesium_resources = this.$store.getters.cesium_resources;
    this.CreatMap(self);
    this.CreatTree();
    
  },
  methods: {
    CreatMap(self) {
      Init(jsondata, this.checked, self);
    },
    CreatTree() {
      this.traversing();
      this.$nextTick(() => {
        let size = this.tilesets.size;
        var arr = [];
        for (var i = 0; i < size; i++) {
          arr.push(i);
        }
        this.defaultChecked = arr;
      });
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
    allowDrop(t1, t2, type) {
      if (t2.data.label === "123") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    traversing() {
      this.tree_data = [];
      this.cesium_resources.map((d, i) => {
        this.structuralTransform(d.name, i);
        this.addLayers(d.serverAddress, d.type, d.name);
      });
      this.defaultChecked = [1];
    },
    structuralTransform(label, id) {
      this.tree_data.push({
        label: label,
        id: id
      });
    },
    addLayers(url, type, layerName) {
      //此处以后要改为Map
      switch (type) {
        case "二维JSON":
          var obj = AddJsonLayer(this.cesiumObjs.viewer, url, true);
          this.tilesets.set(layerName, obj);

          break;
        case "三维倾斜测量":
          var obj = Load3dtiles1(url, this.cesiumObjs.viewer);
          // var self = this;
          // obj.readyPromise.then(function () {
          //   self.cesiumObjs.viewer.flyTo(obj, new Cesium.HeadingPitchRange(0.5, -0.2, obj.boundingSphere.radius * 4.0));
          // });
          this.tilesets.set(layerName, obj);
          break;
      }
    },
    remove(node, data) {
      this.tilesets.delete(data.label);
      this.cesiumObjs.viewer.scene.primitives.removeAll();
      store.dispatch('RemoveCesiumResources', data.label);
    }
  }
};
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

