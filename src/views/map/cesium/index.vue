<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="backdrop" id="menu">
      <div class="nowrap">
        <!-- <input id="baselayer1" type="checkbox" checked>
        <label for="baselayer">云南市</label>-->
        <el-checkbox id="baselayer" v-model="checked">云南市界图层</el-checkbox>
        <el-checkbox id="djcmodel" v-model="djcmodel" >董家村模型</el-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import widgets from "cesium/Widgets/widgets.css";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import { Init } from "./cesium";
import jsondata from "@/assets/json/yunnanshi.json";
// import kmldata from "@/assets/kml/yunnanshi.kml";

export default {
  name: "CesiumViewer",
  data() {
    return {
      checked: true,
      djcmodel: true
    };
  },
  methods: {
    CreatMap() {
      // debugger
      Init(jsondata, this.checked);
    }
  },
  mounted() {
    this.CreatMap();
  }
};
</script>

<style scoped>
#cesiumContainer {
  height: calc(100vh - 50px);
}
.backdrop {
  display: inline-block;
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
</style>

