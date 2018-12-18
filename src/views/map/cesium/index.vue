<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from "cesium/Cesium";
import widgets from "cesium/Widgets/widgets.css";

import { Init } from "./cesium";

export default {
  name: "CesiumViewer",
  methods: {
    CreatMap() {
      // debugger
      Init();
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
</style>

