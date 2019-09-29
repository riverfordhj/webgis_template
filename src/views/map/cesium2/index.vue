<!--
 * @Descripttion: 
 * @version: 
 * @Author: KanMing
 * @Date: 2019-09-21 18:42:28
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-29 17:48:46
 -->
<template>
  <div>
    <div id="cesiumContainer"></div>
    <!-- <toolbar @openLayerTreePanel="openLayerTreePanel" /> -->
    <div class="toolbar">
      <hsc-menu-style-white>
        <hsc-menu-bar style="border-radius: 0 0 4pt 0;">
          <hsc-menu-bar-item label="基础">
            <hsc-menu-item label="图层管理" @click="openLayerTreePanel" />
          </hsc-menu-bar-item>
          <hsc-menu-bar-item label="绘制">
            <hsc-menu-item label="绘制点" @click="drawPointEvent" />
            <hsc-menu-item label="绘制线" @click="drawPolylineEvent" />
            <hsc-menu-item label="绘制面" @click="drawPolygonEvent" />
            <hsc-menu-item label="移除绘制" @click="removeEntities(dataSource)" />
            <hsc-menu-item label="保存">
              <hsc-menu-item label="geoJson" @click="saveAsJson" />
              <hsc-menu-item label="kml" @click="saveAsKml" />
            </hsc-menu-item>
          </hsc-menu-bar-item>
          <hsc-menu-bar-item label="测量">
            <hsc-menu-item label="测量长度" @click="measurePolylineEvent" />
            <hsc-menu-item label="测量面积" @click="measurePolygonEvent" />
            <hsc-menu-item label="测量高度" @click="measureHeightEvent" />
            <hsc-menu-item label="移除测量" @click="removeEntities(measureSource)" />
          </hsc-menu-bar-item>
          <hsc-menu-bar-item label="漫游">
            <hsc-menu-item label="按路线漫游" @click="showFlyCard" />
            <hsc-menu-item label="绘制漫游路线" @click="drawFlyLine" />
          </hsc-menu-bar-item>
        </hsc-menu-bar>
      </hsc-menu-style-white>
      <property-dialog @setProperty="setProperty" :visible="propertyDialogVisible" />
      <fly-dialog @setFlyProperty="setFlyProperty" :visible="flyDialogVisible" />
    </div>
    <div id="tooltip" class="tooltip"></div>
    <!-- <div id="areaTooltip" class="tooltip"></div>
    <div id="heightTooltip" class="tooltip"></div>-->
    <dialog-drag
      v-show="LayerTreeVisible"
      id="dialog-2"
      class="dialog-3"
      title="图层目录"
      :options="{ width:280 }"
      @close="closeDataTree"
    >
      <el-scrollbar :native="false" style="height:100%">
        <el-tree
          show-checkbox
          :data="LayerTreeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          @check="handleCheckChange"
          :render-content="renderContent"
        ></el-tree>
      </el-scrollbar>
    </dialog-drag>
    <transition name="fade">
      <el-card class="fly-card" v-if="flyCardOpened">
        <div slot="header" class="clearfix">
          <span>飞行漫游</span>
          <el-button style="float: right; padding: 3px 0;" type="text" @click="closeFlyCard">关闭</el-button>
        </div>
        <!-- <el-button circle type="primary" icon="el-icon-video-play"></el-button>
        <el-button circle type="primary" icon="el-icon-video-pause"></el-button>-->
        <i class="el-icon-video-play" @click="flyByPolyline"></i>
        <i class="el-icon-video-pause" @click="stopFly"></i>
        <el-select style="float:right" v-model="roadValue" placeholder="请选择">
          <el-option
            v-for="item in roadOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-card>
    </transition>
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
// import toolbar from "./components/toolbar/index.vue";
import store from "../../../store";
import { uploadFlightPath } from '../../../api/flightPath'
import $ from "jquery";
import tokml from "tokml";
import GeoJSON from "geojson";
import { saveAs } from 'file-saver';

import PropertyDialog from './components/propertyDialog/index'
import flyDialog from './components/flyDialog/index'

import {
  intCesium,
  Load3dtiles,
  loadJsonLayer,
  FlyToTileSet,
  FlyToJsonLayer
} from "./cesium";
import { getHttpVerify } from "../../../utils/tileset-verify"
import jsondata from "@/assets/json/yunnanshi.json";

var viewer, cesiumData, layerDataMap = new Map();
// var
var flyPointId = 'flyPt', renderListener = null;
// LayerTreeData = new Map();

export default {
  name: '',
  components: {
    DialogDrag,
    toolbar,
    PropertyDialog,
    flyDialog
    // DropArea
  },
  data() {
    return {
      LayerTreeVisible: false,
      LayerTreeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      cesiumObjs: {
        mHeight: undefined,
        wHeight: undefined,
        latitude: undefined,
        longitude: undefined
      },
      dataSource: new Map(),
      measureSource: new Map(),
      drawHandler: null,
      radiansPerDegree: Math.PI / 180.0,
      degreesPerRadian: 180.0 / Math.PI,
      tooltip: null,
      geoData: {
        points: [],
        lines: [],
        polylines: [],
        gons: [],
        polygons: [],
      },
      geoJSONObj: {
        points: undefined,
        polylines: undefined,
        polygons: undefined
      },
      currentType: '', // point,polyline,polygon
      propertyDialogVisible: false,
      propertyForm: undefined,
      road: [[
        {
          longitude: 100.90204525860803,
          dimension: 25.415434384871443,
          height: 2100,
          time: 0
        },
        {
          longitude: 100.90005648583525,
          dimension: 25.411981917622956,
          height: 2100,
          time: 80
        },
        {
          longitude: 100.89575984495269,
          dimension: 25.410297414081114,
          height: 2100,
          time: 160
        },
        {
          longitude: 100.89542206209941,
          dimension: 25.407635651586816,
          height: 2100,
          time: 240
        },
        {
          longitude: 100.89378049669321,
          dimension: 25.40501924133208,
          height: 2100,
          time: 360
        },
        // [100.89162023881252, 25.404576969652666]
      ]],
      roadValue: '',
      roadOptions: [{
        value: 'road1',
        label: '路线1'
      }, {
        value: 'road2',
        label: '路线1'
      }],
      flyCardOpened: false,
      //绘制的漫游路线
      flyLine: [],
      flyDialogVisible: false,
      flyDataSource: new Map()
    }
  },
  computed: {
    getLayerResources: function () {
      return this.$store.getters.cesium_data;
    }
  },
  watch: {
    getLayerResources(newVal) {
      this.cesiumData = newVal
      // console.log(newVal);
      this.LayerTreeData = [];
      // console.log(viewer)
      // intCesium(this, viewer, CesiumNavigation, jsondata);

      // debugger;
      this.creatLayerTree(newVal);
    }
  },
  mounted() {
    cesiumData = this.$store.getters.cesium_data;
    // debugger
    viewer = intCesium(this, viewer, CesiumNavigation, jsondata);
    // viewer.scene.globe.depthTestAgainstTerrain = false;
    // console.log(viewer)
    this.creatLayerTree(cesiumData);
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
          console.log(col)
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
                label: col["layerName"]
              };
              level2.children.push(level3);
            }
          });
          level1.children.push(level2);
        }
        this.LayerTreeData.push(level1);
        console.log(this.LayerTreeData)
      }
    },
    renderContent(h, { node, data }) {
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
    handleNodeClick(data, node) {
      if (node.level === 3) {
        console.log(layerDataMap)
        let target = layerDataMap.get(data.label);
        // console.log(target)
        // debugger
        if (!target) {
          return
        }
        switch (target.type) {
          case "三维倾斜测量":
          case "BIM":
          case "点云":
          case "三维模型":
          case "手工建模":
          case "自动单体化":
            FlyToTileSet(target.obj, viewer);
            break;
          case "JSON":
            FlyToJsonLayer(target.obj, viewer);
            break;
          default:
            break;
        }
      }
    },
    handleCheckChange(data, node) {
      for (let [key, value] of layerDataMap) {
        switch (value.type) {
          case "三维倾斜测量":
          case "BIM":
          case "点云":
          case "三维模型":
          case "手工建模":
          case "自动单体化":
            value.obj.show = false;
            break;
          case "JSON":
            value.obj.show = false;
            break;
          default:
            break;
        }
      }

      // var target = layerDataMap.get(data.label);
      // console.log({data, node})
      node.checkedNodes.map(checkedNode => {
        let target = layerDataMap.get(checkedNode.label);
        if (target) {
          switch (target.type) {
            case "三维倾斜测量":
            case "BIM":
            case "点云":
            case "三维模型":
            case "手工建模":
            case "自动单体化":
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
      for (let [key, value] of layerDataMap) {
        switch (value.type) {
          case "三维倾斜测量":
          case "BIM":
          case "点云":
          case "三维模型":
          case "手工建模":
          case "自动单体化":
            viewer.scene.primitives.remove(value.obj)
            break;
          case "JSON":
            viewer.dataSources.remove(value.obj)
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

      layerDataMap = new Map()

      store.dispatch("RemoveCesiumData", node.label);
      // deleteProjectByName(data.label).then(res => {
      //   // console.log(res);
      //   this.$refs["tree"].remove(node, data)
      //   this.spatialData = []
      //   this.projectMessage = {}
      // })
    },
    loadLayer({ serverAddress, type, layerName, position, url }) {
      // var serverUrl = serverAddress;
      if (!serverAddress) {
        serverAddress = url
      }
      // debugger
      var _this = this;
      switch (type) {
        case "JSON":
          var obj = loadJsonLayer(
            viewer,
            serverAddress,
            function (datasource) {
              layerDataMap.set(layerName, { type: type, obj: datasource });
            }
          );
          // layerDataMap.set(name, {type:type, obj: obj})
          break;
        case "二维矢量":
          // var obj = AddJsonLayer(this.cesiumObjs.viewer, serverAddress, true);
          // this.tilesets.set(name, obj);
          // var obj = loadJsonLayer(this.cesiumObjs.viewer, serverAddress)

          // layerDataMap.set(name, { type: type, obj: obj });
          break;
        case "三维倾斜测量":
        case "三维模型":
        case "手工建模":
        case "自动单体化":
          console.log(viewer)
          var obj = Load3dtiles(serverAddress, viewer);
          // this.tilesets.set(name, obj);
          layerDataMap.set(layerName, { type: type, obj: obj });
          getHttpVerify(layerName, obj)
          console.log(layerDataMap)
          break;
        case "BIM":
        case "点云":
          var arr = position.split(",");
          var obj = Load3dtiles(serverAddress, viewer, arr);
          // this.tilesets.set(name, obj);
          layerDataMap.set(layerName, { type: type, obj: obj });
          break;
        default:
          break;
      }
    },
    openLayerTreePanel() {
      this.LayerTreeVisible = true;
    },
    drawPointEvent() {
      this.drawPoint()
    },
    drawPolylineEvent() {
      this.drawPolyline()
    },
    drawPolygonEvent() {
      this.drawPolygon()
    },
    measurePolylineEvent() {
      this.measurePolyline()
    },
    measurePolygonEvent() {
      this.measurePolygon()
    },
    measureHeightEvent() {
      this.measureHeight()
    },
    // 移除要素
    removeEntities(dataSource) {
      for (let [key, value] of dataSource) {
        viewer.entities.removeById(key);
      }
      this.geoData = {
        points: [],
        lines: [],
        polylines: [],
        gons: [],
        polygons: [],
      }

      this.geoJSONObj = {
        points: undefined,
        polylines: undefined,
        polygons: undefined
      }
    },
    //显示tooltip
    showTooltip(position, text) {
      if (!tooltip) {
        this.tooltip = $("#tooltip")[0]
      }
      tooltip.style.left = position.x + 10 + "px";
      tooltip.style.top = position.y + 20 + "px";
      tooltip.style.display = "block";
      tooltip.style.position = "absolute";
      tooltip.innerText = text;
    },
    // 隐藏tooltip
    hideTooltip() {
      // debugger
      if (!tooltip) {
        this.tooltip = $("#tooltip")[0]
      }
      tooltip.style.display = "none";
    },
    transformCoordinate(cartesian) {
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      return {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude)
      }
    },
    drawPoint() {
      this.clearHandler();
      var _this = this;
      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      this.drawHandler.setInputAction(function (event) {
        var pickedObject = viewer.scene.pick(event.position);
        //获取地形或模型对应的cartesian3
        var cartesian = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(cartesian)) {
          _this.geoData.points.push(_this.transformCoordinate(cartesian))
          _this.currentType = 'point'
          // var s = GeoJSON.parse(_this.geoData.points, { Point: ['latitude', 'longitude'] });
          // _this.geoJSONObj.points = s

          var label = new Cesium.Entity({
            position: cartesian,
            name: "point",
            point: {
              color: Cesium.Color.RED,
              pixelSize: 10,
              outlineColor: Cesium.Color.BLACK
            },
            id: new Date().getTime()
          });
        }
        viewer.entities.add(label);
        _this.dataSource.set(label.id, label);
        console.log(viewer)
        //显示属性弹窗
        _this.showPropertyDialog()
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.drawHandler.setInputAction(function (event) {
        _this.showTooltip(event.endPosition, `左键单击画点，右键单击停止`)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      this.drawHandler.setInputAction(function (event) {
        _this.drawHandler.destroy()
        _this.drawHandler = null
        _this.hideTooltip()
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    },
    drawPolyline() {
      this.clearHandler();
      var _this = this;
      var PolyLinePrimitive = (function () {
        function _(positions) {
          this.options = {
            name: "线",
            id: new Date().getTime(),
            polyline: {
              show: true,
              positions: [],
              material: Cesium.Color.RED,
              // clampToGround: true,
              width: 5
            }
          };
          this.positions = positions;
          this._init();
        }

        _.prototype._init = function () {
          var _self = this;
          var _update = function () {
            return _self.positions;
          };
          //实时更新polyline.positions
          this.options.polyline.positions = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
          _this.dataSource.set(this.options.id, this.options);
        };
        return _;
      })();

      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      var positions = [];
      var poly = undefined;
      //鼠标左键单击画点
      this.drawHandler.setInputAction(function (event) {
        var cartesian = viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);

        // 获取geojson一条线的点位置
        var position = _this.transformCoordinate(cartesian)
        var unit = []
        for (let i in position) {
          unit.push(position[i])
        }
        _this.geoData.lines.push(unit)

      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //鼠标移动
      this.drawHandler.setInputAction(function (event) {
        var cartesian = viewer.scene.pickPosition(event.endPosition);
        if (positions.length >= 2) {
          if (!Cesium.defined(poly)) {
            poly = new PolyLinePrimitive(positions);
          } else {
            if (cartesian != undefined) {
              positions.pop();
              cartesian.y += 1 + Math.random();
              positions.push(cartesian);
              _this.showTooltip(event.endPosition, `左键单击绘制，右键单击结束`)
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      //单击鼠标右键结束画线
      this.drawHandler.setInputAction(function (event) {
        _this.drawHandler.destroy();
        _this.drawHandler = null;

        var cartesian = viewer.scene.pickPosition(event.position);
        var position = _this.transformCoordinate(cartesian)
        var unit = []
        for (let i in position) {
          unit.push(position[i])
        }
        _this.geoData.lines.push(unit)

        // 根据坐标点生成线的geojson
        _this.geoData.polylines.push({ line: _this.geoData.lines })
        _this.currentType = 'polyline'
        //显示属性弹窗
        _this.showPropertyDialog()
        // var lines = GeoJSON.parse(_this.geoData.polylines, { 'LineString': 'line' });
        // _this.geoJSONObj.polylines = lines
        // _this.geoData.lines = []

        // tooltip[0].style.display = "none"
        _this.hideTooltip()
        console.log(viewer)

      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    drawPolygon() {
      this.clearHandler();
      var _this = this;
      var PolygonPrimitive = (function () {
        function _(positions) {
          this.options = {
            name: "多边形",
            id: new Date().getTime(),
            polygon: {
              hierarchy: [],
              perPositionHeight: true,
              material: Cesium.Color.RED.withAlpha(0.4)
            }
          };
          this.hierarchy = positions;
          this._init();
        }

        _.prototype._init = function () {
          var _self = this;
          var _update = function () {
            return _self.hierarchy;
          };
          //实时更新polygon.hierarchy
          this.options.polygon.hierarchy = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
          // _this.dataSource.push(this.options)
          _this.dataSource.set(this.options.id, this.options);
        };
        return _;
      })();

      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      var positions = [];
      var poly = undefined;

      //鼠标单击画点
      this.drawHandler.setInputAction(function (event) {
        // var cartesian = viewer.scene.camera.pickEllipsoid(
        //   event.position,
        //   viewer.scene.globe.ellipsoid
        // );
        var cartesian = viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);

        // 获取geojson一个面的点位置
        var position = _this.transformCoordinate(cartesian)
        var unit = []
        for (let i in position) {
          unit.push(position[i])
        }
        _this.geoData.gons.push(unit)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //鼠标移动
      this.drawHandler.setInputAction(function (event) {
        var cartesian = viewer.scene.pickPosition(event.endPosition);
        if (positions.length >= 2) {
          if (!Cesium.defined(poly)) {
            poly = new PolygonPrimitive(positions);
          } else {
            if (cartesian != undefined) {
              positions.pop();
              cartesian.y += 1 + Math.random();
              positions.push(cartesian);
              // tooltip[0].style.left = event.endPosition.x + 10 + "px"
              // tooltip[0].style.top = event.endPosition.y + 20 + "px"
              // tooltip[0].style.display = "block"
              // tooltip[0].style.position = "absolute"
              // tooltip[0].innerText = `左键单击绘制，右键单击结束`
              _this.showTooltip(event.endPosition, `左键单击绘制，右键单击结束`)

            }
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      //鼠标右键单击结束绘制
      this.drawHandler.setInputAction(function (event) {
        _this.drawHandler.destroy();
        _this.drawHandler = null;

        var cartesian = viewer.scene.pickPosition(event.position);

        // 获取geojson一个面的点位置
        var position = _this.transformCoordinate(cartesian)
        var unit = []
        for (let i in position) {
          unit.push(position[i])
        }
        _this.geoData.gons.push(unit)

        // 根据坐标点生成线的geojson
        _this.geoData.polygons.push({ polygon: [_this.geoData.gons] })
        _this.currentType = 'polygon'
        //显示属性弹窗
        _this.showPropertyDialog()
        // var polygons = GeoJSON.parse(_this.geoData.polygons, { 'Polygon': 'polygon' });
        // _this.geoJSONObj.polygons = polygons
        // _this.geoData.gons = []

        // tooltip[0].style.display = "none"
        _this.hideTooltip()
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    measurePolyline() {
      this.clearHandler();
      var _this = this;
      var tooltip = $("#tooltip")
      var positions = [];
      var poly = undefined;
      var PolyLinePrimitive = (function () {
        function _(positions) {
          this.options = {
            name: "线",
            id: new Date().getTime(),
            polyline: {
              show: true,
              positions: [],
              material: Cesium.Color.RED,
              // clampToGround: true,
              width: 5
            }
          };
          this.positions = positions;
          this._init();
        }

        _.prototype._init = function () {
          var _self = this;
          var _update = function () {
            return _self.positions;
          };
          //实时更新polyline.positions
          this.options.polyline.positions = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
          _this.measureSource.set(this.options.id, this.options);
          // _this.dataSource1.add(this.options);
        };
        return _;
      })();

      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      this.drawHandler.setInputAction(event => {
        var cartesian = viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }

        var distance = this.getSpaceDistance(positions);
        _this.showTooltip(event.position, `${distance}米`)

        positions.push(cartesian);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.drawHandler.setInputAction(event => {
        var cartesian = viewer.scene.pickPosition(event.endPosition);
        if (positions.length >= 2) {
          if (!Cesium.defined(poly)) {
            poly = new PolyLinePrimitive(positions);
          } else {
            if (cartesian != undefined) {
              positions.pop();
              // cartesian.y += 1 + Math.random();
              positions.push(cartesian);
            }
          }
          var distance = this.getSpaceDistance(positions);
          _this.showTooltip(event.endPosition, `${distance}米`)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this.drawHandler.setInputAction(event => {
        _this.drawHandler.destroy();
        _this.drawHandler = null;
        _this.hideTooltip()
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    measurePolygon() {
      this.clearHandler();
      var _this = this;
      var tooltip = $("#tooltip")
      var PolygonPrimitive = (function () {
        function _(positions) {
          this.options = {
            name: "多边形",
            id: new Date().getTime(),
            polygon: {
              hierarchy: [],
              perPositionHeight: true,
              material: Cesium.Color.RED.withAlpha(0.4)
            }
          };
          this.hierarchy = positions;
          this._init();
        }

        _.prototype._init = function () {
          var _self = this;
          var _update = function () {
            return _self.hierarchy;
          };
          //实时更新polygon.hierarchy
          this.options.polygon.hierarchy = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
          // _this.dataSource.push(this.options)
          _this.measureSource.set(this.options.id, this.options);
        };
        return _;
      })();

      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      var positions = [];
      var poly = undefined;

      //鼠标单击画点
      this.drawHandler.setInputAction(function (event) {
        var cartesian = viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        var textArea = _this.getArea(positions) + "平方公里";
        console.log(textArea);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //鼠标移动
      this.drawHandler.setInputAction(function (event) {
        var cartesian = viewer.scene.pickPosition(event.endPosition);
        if (positions.length >= 2) {
          if (!Cesium.defined(poly)) {
            poly = new PolygonPrimitive(positions);
          } else {
            if (cartesian != undefined) {
              positions.pop();
              cartesian.y += 1 + Math.random();
              positions.push(cartesian);
              _this.showTooltip(event.endPosition, _this.getArea(positions) + "平方公里")
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      //鼠标右键单击结束绘制
      this.drawHandler.setInputAction(function (event) {
        _this.drawHandler.destroy();
        _this.drawHandler = null;
        _this.hideTooltip()
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    measureHeight() {
      var _this = this
      this.clearHandler()
      var tooltip = $("#tooltip")
      var PolyLinePrimitive = (function () {
        function _(positions) {
          this.options = {
            name: "线",
            id: new Date().getTime(),
            polyline: {
              show: true,
              positions: [],
              material: Cesium.Color.RED,
              // clampToGround: true,
              width: 5
            }
          };
          this.positions = positions;
          this._init();
        }

        _.prototype._init = function () {
          var _self = this;
          var _update = function () {
            return _self.positions;
          };
          //实时更新polyline.positions
          this.options.polyline.positions = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
          _this.measureSource.set(this.options.id, this.options);
          // _this.dataSource1.add(this.options);
        };
        return _;
      })();
      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      )
      var positions = [];
      var poly = undefined
      var startingPt = null
      //鼠标左键单击画点
      // debugger
      this.drawHandler.setInputAction(function (event) {
        var cartesian = viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
          startingPt = cartesian
        }
        positions.push(cartesian);
        if (positions.length > 2) {
          positions.pop()
          _this.drawHandler.destroy()
          _this.drawHandler = null
          _this.hideTooltip()
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.drawHandler.setInputAction(function (event) {
        var cartesian = viewer.scene.pickPosition(event.endPosition);
        if (positions.length >= 2) {
          if (!Cesium.defined(poly)) {
            poly = new PolyLinePrimitive(positions);
          } else {
            if (cartesian != undefined) {
              positions.pop();
              var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(startingPt)
              var lat = Cesium.Math.toDegrees(cartographic.latitude)
              var lng = Cesium.Math.toDegrees(cartographic.longitude)
              var cartographic1 = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
              var newPoint = Cesium.Cartesian3.fromDegrees(lng, lat, cartographic1.height)
              positions.push(newPoint);
              var distance = _this.getSpaceDistance(positions);
              _this.showTooltip(event.endPosition, `${distance}米`)
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    // drawBufferLine(){
    //   var _this = this
    //   this.clearHandler()
    // },
    getSpaceDistance(positions) {
      var distance = 0;
      for (var i = 0; i < positions.length - 1; i++) {
        var point1cartographic = Cesium.Cartographic.fromCartesian(
          positions[i]
        );
        var point2cartographic = Cesium.Cartographic.fromCartesian(
          positions[i + 1]
        );
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(
          Math.pow(s, 2) +
          Math.pow(point2cartographic.height - point1cartographic.height, 2)
        );
        distance = distance + s;
      }
      return distance.toFixed(2);
    },
    //计算多边形面积
    getArea(points) {
      var res = 0;
      //拆分三角曲面
      for (var i = 0; i < points.length - 2; i++) {
        var j = (i + 1) % points.length;
        var k = (i + 2) % points.length;
        var totalAngle = this.angle(points[i], points[j], points[k]);
        // var dis_temp1 = distance(positions[i], positions[j]);
        var dis_temp1 = this.getSpaceDistance([points[i], points[j]]);
        // var dis_temp2 = distance(positions[j], positions[k]);
        var dis_temp2 = this.getSpaceDistance([points[j], points[k]]);
        // debugger
        res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
      }
      return (res / 1000000.0).toFixed(4);
    },
    //角度
    angle(p1, p2, p3) {
      var bearing21 = this.bearing(p2, p1);
      var bearing23 = this.bearing(p2, p3);
      var angle = bearing21 - bearing23;
      if (angle < 0) {
        angle += 360;
      }
      return angle;
    },
    //方向
    bearing(from, to) {
      var lat1 = from.x * this.radiansPerDegree;
      var lon1 = from.y * this.radiansPerDegree;
      var lat2 = to.x * this.radiansPerDegree;
      var lon2 = to.y * this.radiansPerDegree;
      var angle = -Math.atan2(
        Math.sin(lon1 - lon2) * Math.cos(lat2),
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
      );
      if (angle < 0) {
        angle += Math.PI * 2.0;
      }
      angle = angle * this.degreesPerRadian; //角度
      return angle;
    },
    // 删除事件
    clearHandler() {
      if (this.drawHandler) {
        this.drawHandler.destroy();
        this.drawHandler = null;
      }
    },
    // 保存为json
    saveAsJson() {
      for (let i in this.geoJSONObj) {
        if (this.geoJSONObj[i]) {
          this.saveFile(JSON.stringify(this.geoJSONObj[i]), `${i}.geojson`)
        }
      }
    },
    // 保存为kml
    saveAsKml() {
      for (let i in this.geoJSONObj) {
        if (this.geoJSONObj[i]) {
          var kml = tokml(this.geoJSONObj[i])
          this.saveFile(kml, `${i}.kml`)
        }
      }
    },
    // 下载到本地
    saveFile(content, name) {
      saveAs(new Blob([content], {
        type: 'text/plain;charset=utf-8'
      }), name)
    },
    setProperty(form) {
      switch (this.currentType) {
        case 'point':
          Object.assign(this.geoData.points[this.geoData.points.length - 1], form)
          this.geoJSONObj.points = GeoJSON.parse(this.geoData.points, { Point: ['latitude', 'longitude'] })
          break
        case 'polyline':
          Object.assign(this.geoData.polylines[this.geoData.polylines.length - 1], form)
          this.geoJSONObj.polylines = GeoJSON.parse(this.geoData.polylines, { 'LineString': 'line' })
          this.geoData.lines = []
          break
        case 'polygon':
          Object.assign(this.geoData.polygons[this.geoData.polygons.length - 1], form)
          this.geoJSONObj.polygons = GeoJSON.parse(this.geoData.polygons, { 'Polygon': 'polygon' })
          this.geoData.gons = []
          break
        default:
          return;
      }
    },
    showPropertyDialog() {
      this.propertyDialogVisible = !this.propertyDialogVisible
    },
    showFlyDialog() {
      this.flyDialogVisible = !this.flyDialogVisible
    },
    showFlyCard() {
      this.flyCardOpened = true
    },
    closeFlyCard() {
      this.flyCardOpened = false
    },
    //按固定线路飞行
    flyByPolyline() {
      if (viewer.entities.getById(flyPointId)) {
        alert("!!")
        return
      }
      // viewer.entities.add({
      //   polyline: {
      //     // This callback updates positions each frame.
      //     positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      //       100.90204525860803, 25.415434384871443, 2100,
      //       100.90005648583525, 25.411981917622956, 2100,
      //       100.89575984495269, 25.410297414081114, 2100,
      //       100.89542206209941, 25.407635651586816, 2100,
      //       100.89378049669321, 25.40501924133208, 2100,
      //       100.89162023881252, 25.4045769696526662100, 2100]),
      //     width: 5,
      //     material: Cesium.Color.RED
      //   }
      // })
      let start = Cesium.JulianDate.fromDate(new Date(2017, 7, 11))
      // 结束时间

      let stop = Cesium.JulianDate.addSeconds(
        start,
        360,
        new Cesium.JulianDate()
      )

      // 设置始时钟始时间
      viewer.clock.startTime = start.clone()
      // 设置时钟当前时间
      viewer.clock.currentTime = start.clone()
      // 设置始终停止时间
      viewer.clock.stopTime = stop.clone()
      // 时间速率，数字越大时间过的越快
      viewer.clock.multiplier = 10
      // 时间轴
      viewer.timeline.zoomTo(start, stop)
      // debugger
      // 循环执行,即为2，到达终止时间，重新从起点时间开始
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP

      // viewer.camera.flyTo({
      //     destination:Cesium.Cartesian3.fromDegrees(116.405419,32.073514,20000)
      // })
      for (let j = 0; j < this.road.length; j++) {
        let property = this.computeFlight(this.road[j], start)
        // 添加模型
        let planeModel = viewer.entities.add({
          id: flyPointId,
          // 和时间轴关联
          availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({
              start: start,
              stop: stop
            })
          ]),
          position: property,
          // 根据所提供的速度计算模型的朝向
          orientation: new Cesium.VelocityOrientationProperty(property),
          // 模型数据
          point: {
            color: new Cesium.Color.fromCssColorString('#FFFF00').withAlpha(
              0.2
            ),
            pixelSize: 10
          }
        })
        viewer.trackedEntity = planeModel




        var scratch = new Cesium.Matrix4();
        var _this = this
        renderListener = function (e) {
          var time = viewer.clock.currentTime.secondsOfDay - viewer.clock.startTime.secondsOfDay;
          //viewer.camera.positionCartographic.height = 2000 + $this.limitCamera(f_property);
          // if ($this.flightEntity && $this.isFollowModel) {
          _this.getModelMatrix(planeModel, viewer.clock.currentTime, scratch);

          var transformX = 50; //距离运动点的距离（后方） 
          var transformZ = 10; //距离运动点的高度（上方）
          viewer.scene.camera.lookAtTransform(scratch, new Cesium.Cartesian3(-transformX, 0, transformZ))
          // }
        }
        viewer.scene.preRender.addEventListener(renderListener)
      }
    },
    getModelMatrix(entity, time, result) {
      var matrix3Scratch = new Cesium.Matrix3();

      var position = Cesium.Property.getValueOrUndefined(entity.position, time, new Cesium.Cartesian3());
      if (!Cesium.defined(position)) {
        return undefined;
      }
      var orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, new Cesium.Quaternion());
      if (!Cesium.defined(orientation)) {
        result = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, result);
      } else {
        result = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
          position, result);
      }
      return result;
    },
    //计算飞行
    computeFlight(source, start) {
      // 取样位置 相当于一个集合
      let property = new Cesium.SampledPositionProperty()
      for (let i = 0; i < source.length; i++) {
        let time = Cesium.JulianDate.addSeconds(
          start,
          source[i].time,
          new Cesium.JulianDate()
        )
        let position = Cesium.Cartesian3.fromDegrees(
          source[i].longitude,
          source[i].dimension,
          source[i].height
        )
        // 添加位置，和时间对应
        property.addSample(time, position)
      }
      return property
    },
    stopFly() {
      // viewer.clock = new Cesium.Clock({
      //   startTime: Cesium.JulianDate.fromIso8601("2013-12-25"),
      //   currentTime: Cesium.JulianDate.fromIso8601("2013-12-25"),
      //   stopTime: Cesium.JulianDate.fromIso8601("2013-12-26"),
      //   clockRange: Cesium.ClockRange.LOOP_STOP,
      //   clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER
      // });
      viewer.timeline.zoomTo(Cesium.JulianDate.fromDate(new Date(2017, 7, 11)), Cesium.JulianDate.fromDate(new Date(2017, 7, 12)))
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED
      // viewer.timeline.
      viewer.entities.removeById(flyPointId)
      viewer.scene.preRender.removeEventListener(renderListener)

    },
    drawFlyLine() {
      this.clearHandler();
      this.flyLine = []
      var _this = this;
      var PolyLinePrimitive = (function () {
        function _(positions) {
          this.options = {
            name: "线",
            id: new Date().getTime(),
            polyline: {
              show: true,
              positions: [],
              material: Cesium.Color.YELLOW,
              // clampToGround: true,
              width: 5
            }
          };
          this.positions = positions;
          this._init();
        }

        _.prototype._init = function () {
          var _self = this;
          var _update = function () {
            return _self.positions;
          };
          //实时更新polyline.positions
          this.options.polyline.positions = new Cesium.CallbackProperty(
            _update,
            false
          );
          viewer.entities.add(this.options);
          _this.flyDataSource.set(this.options.id, this.options);
        };
        return _;
      })();

      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      var positions = [];
      var poly = undefined;
      //鼠标左键单击画点
      this.drawHandler.setInputAction(function (event) {
        var cartesian = viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        console.log(cartesian)
        _this.flyLine.push(cartesian)
        // 获取geojson一条线的点位置
        // var position = _this.transformCoordinate(cartesian)
        // console.log(position)
        // var unit = []
        // for (let i in position) {
        //   unit.push(position[i])
        // }
        // _this.geoData.lines.push(unit)

      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //鼠标移动
      this.drawHandler.setInputAction(function (event) {
        var cartesian = viewer.scene.pickPosition(event.endPosition);
        if (positions.length >= 2) {
          if (!Cesium.defined(poly)) {
            poly = new PolyLinePrimitive(positions);
          } else {
            if (cartesian != undefined) {
              positions.pop();
              cartesian.y += 1 + Math.random();
              positions.push(cartesian);
              _this.showTooltip(event.endPosition, `左键单击绘制，右键单击结束`)
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      //单击鼠标右键结束画线
      this.drawHandler.setInputAction(function (event) {
        _this.drawHandler.destroy();
        _this.drawHandler = null;

        var cartesian = viewer.scene.pickPosition(event.position);
        var position = _this.transformCoordinate(cartesian)
        _this.flyLine.push(cartesian)
        console.log(_this.flyLine[0].x)
        //显示属性弹窗
        _this.showFlyDialog()
        _this.hideTooltip()
        // console.log(viewer)

      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    setFlyProperty(form) {
      // console.log(form)
      var _this = this
      uploadFlightPath(this.flyLine, form.name, form.description).then(res => {
        _this.$message({
          message: '上传成功',
          type: 'success'
        });
      }).catch(err => {
        _this.$message({
          message: 'err.message',
          type: 'error'
        });
      })
      //删除线
      for (let [key, value] of this.flyDataSource) {
        viewer.entities.removeById(key);
      }
      this.flyLine = []
    }
  }
}
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


<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.toolbar {
  left: 10px;
  top: 10px;
  position: absolute;
  z-index: 991;
}
.fly-card {
  position: absolute;
  width: 400px;
  top: 20px;
  right: 20px;
}
i {
  color: #606266;
  margin: 0 10px;
  font-size: 2em;
  vertical-align: middle;
  cursor: pointer;
}
</style>

<style>
.cesium-widget-credits {
  display: none !important;
  visibility: hidden !important;
}
</style>