import Cesium from 'cesium/Cesium'
// import $ from 'jquery'

// //测量相关变量
// var clampMode = 0;
// var handlerDis, handlerArea, handlerHeight;
// // var $height = $('#height'), $oritention = $('#oritention'), $pitch = $('#pitch'), $speed = $('#speed'),$longitude = $('#longitude'),$latitude= $('#latitude');
// //绘制对象
// var drawHandler = {};
// var viewer

export const intCesium = function(self, viewer, CesiumNavigation, jsondata) {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MjMyYjZiMC1lZmY1LTQzNmEtODg1NS01NmQzMmE2NWY2ZjMiLCJpZCI6NDQ1MSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MDg4NTM2Mn0.7OzWWlmUmJv_EJo0RFpuiL2G_KLgZBENAAXOgU1O1qM'

  viewer = new Cesium.Viewer('cesiumContainer', {
    geocoder: false, //搜索
    homeButton: false, //主页 地球回正
    sceneModePicker: false, //地球平铺 网格  3d/2d选择器
    baseLayerPicker: true,
    animation: false, //是否创建动画小器件，左下角仪表
    selectionIndicator: false,
    fullscreenButton: false,
    // infoBox: true,
    navigationHelpButton: false, //是否显示右上角的帮助按钮
    timeline: true,
    shouldAnimate: true,
    // baseLayerPicker: true //图层选择器
    InfoBox: false
  })

  // Load Cesium World Terrain
  viewer.terrainProvider = Cesium.createWorldTerrain({
    requestWaterMask: true, // required for water effects
    requestVertexNormals: true // required for terrain lighting
  })
  // Enable depth testing so things behind the terrain disappear.
  viewer.scene.globe.depthTestAgainstTerrain = true

  //解决线与面被地形遮挡问题
  // viewer.scene.globe.depthTestAgainstTerrain = false;

  //默认视角

  viewer.camera.setView({
    // destination: Cesium.Cartesian3.fromDegrees(106.72 , 25.05, 3000000),
    destination: Cesium.Rectangle.fromDegrees(97, 21, 106, 29),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(0)
    }
  })

  var options = {}
  // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
  // options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
  options.defaultResetView = Cesium.Rectangle.fromDegrees(97, 21, 106, 29)
  // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
  options.enableCompass = true
  // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
  options.enableZoomControls = true
  // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
  options.enableDistanceLegend = true
  // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
  options.enableCompassOuterRing = true

  // let viewer = new Cesium.Viewer("cesiumContainer");
  CesiumNavigation(viewer, options)

  getPosition(self, viewer)

  // loadJsonLayer(viewer, jsondata, true);

  // SetMeasurement(viewer)

  // measureLineSpace(viewer, null)
  return viewer
}

function getPosition(self, viewer) {
  //得到当前三维场景
  // var scene = viewer.scene;
  //得到当前三维场景的椭球体
  // var ellipsoid = scene.globe.ellipsoid;

  // cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);

  var longitudeString = null
  var latitudeString = null
  var height = null
  var cartesian = null

  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  // var ray;
  handler.setInputAction(function(event) {
    // ray = viewer.scene.camera.getPickRay(event.endPosition);
    // cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    cartesian = viewer.scene.pickPosition(event.endPosition)
    if (cartesian) {
      //将笛卡尔坐标转换为地理坐标
      // var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      //将弧度转为度的十进制度表示
      longitudeString = Cesium.Math.toDegrees(cartographic.longitude)
      latitudeString = Cesium.Math.toDegrees(cartographic.latitude)

      //获取相机高度
      height = Math.ceil(viewer.camera.positionCartographic.height)
      self.cesiumObjs.latitude = longitudeString.toFixed(2)
      self.cesiumObjs.longitude = latitudeString.toFixed(2)
      self.cesiumObjs.mHeight = cartographic.height.toFixed(0)
      self.cesiumObjs.wHeight = height.toFixed(0)
    } else {
      // entity.label.show = false;
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
  handler.setInputAction(function(wheelment) {
    height = Math.ceil(viewer.camera.positionCartographic.height)
    self.cesiumObjs.wHeight = height.toFixed(0)
  }, Cesium.ScreenSpaceEventType.WHEEL)
}

//加载3DTILES模型
export function Load3dtiles(url, viewer, arr) {
  var tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: url
    })
  )
  // viewer.scene.primitives.add(tileset);
  // tileset.readyPromise.then(function () {
  //     viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0));
  // });

  if (arr) {
    tileset.readyPromise.then(function() {
      var longitude = parseFloat(arr[0])
      var latitude = parseFloat(arr[1])
      var height = parseFloat(arr[2])
      var heading = 0
      var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
      var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position)
      var rotationX = Cesium.Matrix4.fromRotationTranslation(
        Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading))
      )
      Cesium.Matrix4.multiply(mat, rotationX, mat)
      tileset._root.transform = mat
    })
  }
  tileset.show = true
  return tileset
}

//加载json文件图层
export function loadJsonLayer(viewer, jsondata, callback) {
  var geojsonOptions = {
    clampToGround: true,
    fill: Cesium.Color.RED
  }

  var dataPromise = Cesium.GeoJsonDataSource.load(jsondata, geojsonOptions)

  dataPromise.then(function(dataSource) {
    viewer.dataSources.add(dataSource)
    var neighborhoodEntities = dataSource.entities.values

    var color = Cesium.Color.fromRandom({
      alpha: 0.9
    })
    for (var i = 0; i < neighborhoodEntities.length; i++) {
      var entity = neighborhoodEntities[i]

      if (Cesium.defined(entity.polygon)) {
        entity.polygon.material = Cesium.Color.fromRandom({
          alpha: 0.6
        })
      }
      if (Cesium.defined(entity.polyline)) {
        entity.polyline.material = color
      }
      if (Cesium.defined(entity.point)) {
        entity.point.material = color
      }
      // dataSource.show = false
      callback(dataSource)
      // console.log(viewer)
    }
  })
  return dataPromise
}

//缩放到3dtiles
export function FlyToTileSet(tileset, viewer) {
  tileset.readyPromise.then(function() {
    viewer.flyTo(
      tileset,
      new Cesium.HeadingPitchRange(
        0.5,
        -0.2,
        tileset.boundingSphere.radius * 4.0
      )
    )
  })
}

//缩放到jsonLayer
export function FlyToJsonLayer(jsonData, viewer) {
  viewer.flyTo(jsonData)
}

export { viewer }
