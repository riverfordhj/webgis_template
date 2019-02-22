<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import esriLoader from "esri-loader";
import { createMap } from "./esriMap";
import jsondata from "@/assets/json/yunnan.json"
export default {
  name: "EsriMap",
  data() {
    return {};
  },
  mounted() {
    var self = this;
    this.initMap(self);
  },
  methods: {
    initMap(self) {
      const options = {
        // url: 'http://223.255.43.21/arcgis_js_api4.8/library/4.8/dojo/dojo.js',
        url: "http://202.114.148.160/arcgis_js_api4.8/library/4.8/dojo/dojo.js"
        // url:'https://js.arcgis.com/4.9/'
      };
      createMap(esriLoader, options, self, jsondata);
    }
  }
};
</script>

<style>
/* @import url('http://223.255.43.21/arcgis_js_api4.8/library/4.8/esri/css/main.css'); */
/* @import url('https://js.arcgis.com/4.9/esri/css/main.css'); */
@import url("https://js.arcgis.com/4.9/esri/css/main.css");
#map {
  height: calc(100vh - 50px);
}
</style>