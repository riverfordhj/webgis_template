import Cesium from 'cesium/Cesium';


export const intCesium = function (self, CesiumNavigation) {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MjMyYjZiMC1lZmY1LTQzNmEtODg1NS01NmQzMmE2NWY2ZjMiLCJpZCI6NDQ1MSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MDg4NTM2Mn0.7OzWWlmUmJv_EJo0RFpuiL2G_KLgZBENAAXOgU1O1qM';

  self.cesiumObjs.viewer = new Cesium.Viewer('cesiumContainer', {
    geocoder: false, //搜索
    homeButton: false, //主页 地球回正
    sceneModePicker: false, //地球平铺 网格  3d/2d选择器
    baseLayerPicker: true,
    animation: false, //是否创建动画小器件，左下角仪表
    selectionIndicator: false,
    fullscreenButton: false,
    // infoBox: true,
    navigationHelpButton: false, //是否显示右上角的帮助按钮
    timeline: false,
    // baseLayerPicker: true //图层选择器
  });

  // Load Cesium World Terrain
  self.cesiumObjs.viewer.terrainProvider = Cesium.createWorldTerrain({
    requestWaterMask: true, // required for water effects
    requestVertexNormals: true // required for terrain lighting
  });
  // Enable depth testing so things behind the terrain disappear.
  self.cesiumObjs.viewer.scene.globe.depthTestAgainstTerrain = true;

  var options = {};
  // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
  options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
  // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
  options.enableCompass= true;
  // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
  options.enableZoomControls= true;
  // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
  options.enableDistanceLegend= true;
  // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
  options.enableCompassOuterRing= true;
  
  // let viewer = new Cesium.Viewer("cesiumContainer");
  CesiumNavigation(self.cesiumObjs.viewer, options);

  getPosition(self)
}

function getPosition(self) {
  //得到当前三维场景
  // var scene = self.cesiumObjs.viewer.scene;
  //得到当前三维场景的椭球体
  // var ellipsoid = scene.globe.ellipsoid;

  //   cartesian = self.cesiumObjs.viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
  
  var longitudeString = null;
  var latitudeString = null;
  var height = null;
  var cartesian = null;

  var handler = new Cesium.ScreenSpaceEventHandler(self.cesiumObjs.viewer.scene.canvas);
  var ray;
  handler.setInputAction(function (event) {
    ray = self.cesiumObjs.viewer.scene.camera.getPickRay(event.endPosition);
    cartesian = self.cesiumObjs.viewer.scene.globe.pick(ray,self.cesiumObjs.viewer.scene)
    if (cartesian) {
        //将笛卡尔坐标转换为地理坐标
        // var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var cartographic=Cesium.Cartographic.fromCartesian(cartesian);
        //将弧度转为度的十进制度表示
        longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
  
        //获取相机高度
        height = Math.ceil(self.cesiumObjs.viewer.camera.positionCartographic.height);
        self.cesiumObjs.latitude = longitudeString.toFixed(2);
        self.cesiumObjs.longitude = latitudeString.toFixed(2);
        self.cesiumObjs.mHeight = cartographic.height.toFixed(0);
        self.cesiumObjs.wHeight = height.toFixed(0);
      } else {
        // entity.label.show = false;
      }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
  handler.setInputAction(function (wheelment) {
    height = Math.ceil(self.cesiumObjs.viewer.camera.positionCartographic.height);
    self.cesiumObjs.wHeight = height.toFixed(0);
  }, Cesium.ScreenSpaceEventType.WHEEL);
}