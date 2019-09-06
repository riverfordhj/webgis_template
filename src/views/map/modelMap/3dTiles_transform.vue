<!--  -->
<template>
  <div>
    <div id="cesiumContainer" class="fullSize" />
    <div id="menu" class="backdrop">
      <div>
        <span class="demonstration">经纬度位置</span>
        <el-input-number
          v-model="fullLong"
          :precision="16"
          :step="1"
          :min="-180"
          :max="180"
          size="small"
          controls-position="right"
        />
        <el-input-number
          v-model="fullLat"
          :precision="16"
          :step="1"
          :min="-180"
          :max="180"
          size="small"
          controls-position="right"
        />
        <el-input-number
          v-model="fullHeight"
          :precision="14"
          :step="1"
          size="small"
          controls-position="right"
        />
        <el-button type="primary" icon="el-icon-place" size="small" round @click="changePosition">定位</el-button>
      </div>

      <span class="demonstration">高程(meters)</span>
      <el-slider
        v-model="height"
        :step="5"
        :min="-1000"
        :max="1000"
        show-input
        :show-input-controls="false"
        input-size="mini"
        @input="changeHeight"
      />
      <span class="demonstration">经度(degrees)</span>
      <el-slider
        v-model="longitude"
        :step="0.00001"
        :min="-0.1"
        :max="0.1"
        show-input
        :show-input-controls="false"
        input-size="mini"
        @input="adjustLongitude"
      />
      <span class="demonstration">纬度(degrees)</span>
      <el-slider
        v-model="latitude"
        :step="0.00001"
        :min="-0.1"
        :max="0.1"
        show-input
        :show-input-controls="false"
        input-size="mini"
        @input="ajustLatitude"
      />
      <span class="demonstration">沿X轴旋转(degrees)</span>
      <el-slider
        v-model="xRotation"
        :step="1"
        :min="-360"
        :max="360"
        show-input
        :show-input-controls="false"
        input-size="mini"
        @input="rotateX"
      />
      <span class="demonstration">沿Y轴旋转(degrees)</span>
      <el-slider
        v-model="yRotation"
        :step="1"
        :min="-360"
        :max="360"
        show-input
        :show-input-controls="false"
        input-size="mini"
        @input="rotateY"
      />
      <span class="demonstration">沿Z轴旋转(degrees)</span>
      <el-slider
        v-model="zRotation"
        :step="1"
        :min="-360"
        :max="360"
        show-input
        :show-input-controls="false"
        input-size="mini"
        @input="rotateZ"
      />
      <span class="demonstration">比例缩放</span>
      <el-slider
        v-model="scale"
        :step="0.1"
        :min="0.1"
        :max="10"
        show-input
        :show-input-controls="false"
        input-size="mini"
        @input="changeScale"
      />
    </div>
    <div id="selectedMenu">
      <el-select v-model="urlValue" placeholder="请选择" @change="change3dTilesModel">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import Cesium from 'cesium/Cesium'
import { Init, add3dTiles, adjust3dTilesPosition, rotationAndScale, change3dTilesPositon, change3dTiles } from './cesium.js'
import 'cesium/Widgets/widgets.css'
import 'element-ui/lib/theme-chalk/index.css'

var viewer = {}
var tileset = {}
var resolvedTileset = {}
var initCartographic = {}
var lastCartographic = {}

export default {

  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      height: 0,
      longitude: 0,
      latitude: 0,
      xRotation: 0,
      yRotation: 0,
      zRotation: 0,
      scale: 1,
      fullLong: 0,
      fullLat: 0,
      fullHeight: 0,
      mat: Cesium.Matrix4.IDENTITY,
      options: [{
        value: 'http://202.114.148.160/sogbTo3dtiles/GuanBaHe/tileset.json',
        label: '关河坝'
      },
      {
        value: 'http://202.114.148.160/sogbTo3dtiles/DongJiaCun/tileset.json',
        label: '董家村'
      }],
      urlValue: ''
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {

  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    viewer = Init()
    tileset = add3dTiles(viewer)
    var _this = this
    tileset.readyPromise.then(function () {
      viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(
          0.5,
          -0.2,
          tileset.boundingSphere.radius * 4.0
        )
      )
      resolvedTileset = tileset
      initCartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
      )
      _this.fullLong = Cesium.Math.toDegrees(initCartographic.longitude)
      _this.fullLat = Cesium.Math.toDegrees(initCartographic.latitude)
      _this.fullHeight = initCartographic.height
      _this.mat = Cesium.Matrix4.fromArray(tileset.root.transform)
    })
  },
  // 方法集合
  methods: {
    changeHeight: function (h) {
      adjust3dTilesPosition(resolvedTileset, initCartographic, lastCartographic, this.longitude, this.latitude, h)
    },
    adjustLongitude: function (long) {
      adjust3dTilesPosition(resolvedTileset, initCartographic, lastCartographic, long, this.latitude, this.height)
    },
    ajustLatitude: function (lat) {
      adjust3dTilesPosition(resolvedTileset, initCartographic, lastCartographic, this.longitude, lat, this.height)
    },
    rotateX: function (x) {
      rotationAndScale(resolvedTileset, this.mat, this.zRotation, this.yRotation, x, this.scale)
    },
    rotateY: function (y) {
      rotationAndScale(resolvedTileset, this.mat, this.zRotation, y, this.xRotation, this.scale)
    },
    rotateZ: function (z) {
      rotationAndScale(resolvedTileset, this.mat, z, this.yRotation, this.xRotation, this.scale)
    },
    changeScale: function (s) {
      rotationAndScale(resolvedTileset, this.mat, this.zRotation, this.yRotation, this.xRotation, s)
    },
    changePosition: function () {
      lastCartographic.longitude = Cesium.Math.toRadians(this.fullLong)
      lastCartographic.latitude = Cesium.Math.toRadians(this.fullLat)
      lastCartographic.height = this.fullHeight

      change3dTilesPositon(resolvedTileset, initCartographic, lastCartographic.longitude, lastCartographic.latitude, lastCartographic.height)
      this.height = 0
      this.longitude = 0
      this.latitude = 0

      viewer.flyTo(tileset)
    },
    change3dTilesModel: function (url) {
      lastCartographic = {}
      tileset = change3dTiles(viewer, url)
      var _this = this
      tileset.readyPromise.then(function () {
        viewer.flyTo(
          tileset,
          new Cesium.HeadingPitchRange(
            0.5,
            -0.2,
            tileset.boundingSphere.radius * 4.0
          )
        )
        resolvedTileset = tileset
        initCartographic = Cesium.Cartographic.fromCartesian(
          tileset.boundingSphere.center
        )
        _this.fullLong = Cesium.Math.toDegrees(initCartographic.longitude)
        _this.fullLat = Cesium.Math.toDegrees(initCartographic.latitude)
        _this.fullHeight = initCartographic.height
        _this.height = 0
        _this.longitude = 0
        _this.latitude = 0
        _this.xRotation = 0
        _this.yRotation = 0
        _this.zRotation = 0
        _this.scale = 1
        _this.mat = Cesium.Matrix4.fromArray(tileset.root.transform)
      })
    }

  }
}
</script>

<style lang='scss' scoped>
#cesiumContainer {
  height: calc(100vh - 50px);
}
.backdrop {
  background: rgba(42, 42, 42, 0.9);
  border-radius: 5px;
  border: 1px solid #444;
  padding: 10px 10px;
  color: #fff;
  margin: 5px;
  line-height: 150%;
  font-size: small;
  width: 35%;
}
#menu {
  position: absolute;
  left: 1%;
  top: 1%;
}
#selectedMenu {
  position: absolute;
  right: 5%;
  top: 1%;
}
</style>
