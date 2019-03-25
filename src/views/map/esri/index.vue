<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import esriLoader from "esri-loader";
import { createMap, AddLayer } from "./esriMap";
import jsondata from "@/assets/json/yunnan.json"
import store from '../../../store'
export default {
  name: "EsriMap",
  data() {
    return {
      layer_Resources:null,
      view:null,
      options:{
        url: "http://202.114.148.160/arcgis_js_api4.8/library/4.8/dojo/dojo.js"
      }
    };
  },
  computed: {
    getLayerResources:function(){
      return this.$store.getters.esri_resources;
    },
    getView(){
      return this.view
    }
  },
  watch: {
    getLayerResources(val){
      this.view.map.removeAll();
      this.layer_Resources = val;
      this.layer_Resources.map(row => {
        AddLayer(esriLoader, this.options, this.view, row.serverAddress)
      })
    },
    getView(view){ 
      this.layer_Resources = this.$store.getters.esri_resources;
      this.view.map.removeAll();
      view.when(() => {     
        this.layer_Resources.map(row => {
          AddLayer(esriLoader, this.options, this.view, row.serverAddress)
        })
      })
    }
  },
  mounted() {
    var self = this;
    this.initMap(self);   
  },
  methods: {
    initMap(self) {
      createMap(esriLoader, this.options, self, jsondata, store);
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