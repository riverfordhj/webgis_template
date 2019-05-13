import Cesium from 'cesium/Cesium';
import $ from 'jquery'

//测量相关变量
var clampMode = 0;
var handlerDis, handlerArea, handlerHeight;
// var $height = $('#height'), $oritention = $('#oritention'), $pitch = $('#pitch'), $speed = $('#speed'),$longitude = $('#longitude'),$latitude= $('#latitude');
//绘制对象
var drawHandler = {};

export const intCesium = function (self, CesiumNavigation, jsondata) {
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

  //解决线与面被地形遮挡问题
  // self.cesiumObjs.viewer.scene.globe.depthTestAgainstTerrain = false;

  //默认视角

  self.cesiumObjs.viewer.camera.setView({
    // destination: Cesium.Cartesian3.fromDegrees(106.72 , 25.05, 3000000),  
    destination: Cesium.Rectangle.fromDegrees(97, 21, 106, 29),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(0)
    }
  });

  var options = {};
  // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
  // options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
  options.defaultResetView = Cesium.Rectangle.fromDegrees(97, 21, 106, 29);
  // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
  options.enableCompass = true;
  // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
  options.enableZoomControls = true;
  // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
  options.enableDistanceLegend = true;
  // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
  options.enableCompassOuterRing = true;

  // let viewer = new Cesium.Viewer("cesiumContainer");
  CesiumNavigation(self.cesiumObjs.viewer, options);

  getPosition(self)

  // loadJsonLayer(self.cesiumObjs.viewer, jsondata, true);

  // SetMeasurement(self.cesiumObjs.viewer)

  // measureLineSpace(self.cesiumObjs.viewer, null)
}

function getPosition(self) {
  //得到当前三维场景
  // var scene = self.cesiumObjs.viewer.scene;
  //得到当前三维场景的椭球体
  // var ellipsoid = scene.globe.ellipsoid;

  // cartesian = self.cesiumObjs.viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);

  var longitudeString = null;
  var latitudeString = null;
  var height = null;
  var cartesian = null;

  var handler = new Cesium.ScreenSpaceEventHandler(self.cesiumObjs.viewer.scene.canvas);
  // var ray;
  handler.setInputAction(function (event) {
    // ray = self.cesiumObjs.viewer.scene.camera.getPickRay(event.endPosition);
    // cartesian = self.cesiumObjs.viewer.scene.globe.pick(ray, self.cesiumObjs.viewer.scene)
    cartesian = self.cesiumObjs.viewer.scene.pickPosition(event.endPosition);
    if (cartesian) {
      //将笛卡尔坐标转换为地理坐标
      // var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
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

//加载3DTILES模型
export function Load3dtiles(url, viewer, arr) {
  var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: url,
  }))
  // viewer.scene.primitives.add(tileset);
  // tileset.readyPromise.then(function () {
  //     viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0));
  // });

  if (arr) {
    tileset.readyPromise.then(function () {
      var longitude = 100.89544722222222;
      var latitude = 25.40965;
      var height = 1968;
      var heading = 0;
      var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
      var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)));
      Cesium.Matrix4.multiply(mat, rotationX, mat);
      tileset._root.transform = mat;
    })
  }
  tileset.show = false
  return tileset
}

//加载json文件图层
export function loadJsonLayer(viewer, jsondata, isFlyTo) {
  var geojsonOptions = {
    clampToGround: true,
    fill: Cesium.Color.RED
  };

  var dataPromise = Cesium.GeoJsonDataSource.load(jsondata, geojsonOptions);

  dataPromise.then(function (dataSource) {
    // Add the new data as entities to the viewer
    viewer.dataSources.add(dataSource);

    // Save an new entity collection of baselayer data
    // dataSource.entities.show = homeData.baselayershow;
    // homeData.baselayerEntities = dataSource.entities;
    // homeData.dataSource = dataSource;

    // Get the array of entities
    var neighborhoodEntities = dataSource.entities.values;
    for (var i = 0; i < neighborhoodEntities.length; i++) {
      var entity = neighborhoodEntities[i];

      if (Cesium.defined(entity.polygon)) {
        // entity styling code here
        // Use geojson neighborhood value as entity name
        entity.name = entity.properties.Name;

        // Set the polygon material to a random, translucent color.
        entity.polygon.material = Cesium.Color.fromRandom({
          // red: 0.5,
          // maximumGreen: 0.9,
          // minimumBlue: 0.1,
          alpha: 0.4
        });

        // Generate Polygon position
        var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
        var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
        polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);

        //polyCenter.z += 20000;
        entity.position = polyCenter;

        // Generate labels
        entity.label = {
          text: entity.name,
          showBackground: true,
          scale: 0.7,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(100.0, 2000000.0),
          disableDepthTestDistance: 10000.0
        };
      }
    }

    if (isFlyTo)
      viewer.flyTo(dataSource);
  });
  return dataPromise;
}

//缩放到3dtiles
export function FlyToTileSet(tileset, viewer) {
  tileset.readyPromise.then(function () {
    viewer.flyTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0))
  })
}

//缩放到jsonLayer
export function FlyToJsonLayer(jsonData, viewer) {
  viewer.flyTo(jsonData);
}


//将笛卡尔坐标转经纬度坐标
function CartToLonlat(position) {
  var cartographic = Cesium.Cartographic.fromCartesian(position);
  var longitude = Cesium.Math.toDegrees(cartographic.longitude);
  var latitude = Cesium.Math.toDegrees(cartographic.latitude);
  var height = cartographic.height;
  return {
      lon: longitude,
      lat: latitude,
      height: height
  };
}

// function SetMeasurement(viewer) {
//   //初始化测量距离
//   handlerDis = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Distance, 0);
//   //注册测距功能事件
//   handlerDis.measureEvt.addEventListener(function (result) {
//     var distance = result.distance > 1000 ? (result.distance / 1000) + 'km' : result.distance + 'm';
//     handlerDis.disLabel.text = '距离:' + distance;
//     handlerDis.disLabel.outlineColor = new Cesium.Color(0, 0, 1);
//     handlerDis.disLabel.font = '100 18px sans-serif';
//     handlerDis.disLabel.outlineWidth = 5;
//   });
//   handlerDis.activeEvt.addEventListener(function (isActive) {
//     if (isActive == true) {
//       viewer.enableCursorStyle = false;
//       viewer._element.style.cursor = '';
//       $('body').removeClass('measureCur').addClass('measureCur');
//     } else {
//       viewer.enableCursorStyle = true;
//       $('body').removeClass('measureCur');
//     }
//   });

//   //初始化测量面积
//   handlerArea = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Area, 0);
//   handlerArea.measureEvt.addEventListener(function (result) {
//     var area = result.area > 1000000 ? result.area / 1000000 + 'km²' : result.area + '㎡'
//     handlerArea.areaLabel.text = '面积:' + area;
//     handlerArea.areaLabel.outlineColor = new Cesium.Color(0, 0, 1);
//     handlerArea.areaLabel.font = '100 18px sans-serif';
//     handlerArea.areaLabel.outlineWidth = 5.0;
//   });
//   handlerArea.activeEvt.addEventListener(function (isActive) {
//     if (isActive == true) {
//       viewer.enableCursorStyle = false;
//       viewer._element.style.cursor = '';
//       // $('body').removeClass('measureCur').addClass('measureCur');
//     } else {
//       viewer.enableCursorStyle = true;
//       // $('body').removeClass('measureCur');
//     }
//   });

//   //初始化测量高度
//   handlerHeight = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH);
//   handlerHeight.measureEvt.addEventListener(function (result) {
//     var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
//     var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
//     var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
//     handlerHeight.disLabel.text = '空间距离:' + distance;
//     handlerHeight.disLabel.outlineColor = new Cesium.Color(0, 0, 1);
//     handlerHeight.disLabel.font = '100 18px sans-serif';
//     handlerHeight.disLabel.outlineWidth = 5.0;
//     handlerHeight.vLabel.text = '垂直高度:' + vHeight;
//     handlerHeight.vLabel.outlineColor = new Cesium.Color(0, 0, 1);
//     handlerHeight.vLabel.font = '100 18px sans-serif';
//     handlerHeight.vLabel.outlineWidth = 5.0;
//     handlerHeight.hLabel.text = '水平距离:' + hDistance;
//     handlerHeight.hLabel.outlineColor = new Cesium.Color(0, 0, 1);
//     handlerHeight.hLabel.font = '100 18px sans-serif';
//     handlerHeight.hLabel.outlineWidth = 5.0;
//   });
//   handlerHeight.activeEvt.addEventListener(function (isActive) {
//     if (isActive == true) {
//       viewer.enableCursorStyle = false;
//       viewer._element.style.cursor = '';
//       // $('body').removeClass('measureCur').addClass('measureCur');
//     } else {
//       viewer.enableCursorStyle = true;
//       // $('body').removeClass('measureCur');
//     }
//   });

//   $('#distance').click(function () {
//     deactiveAll();
//     handlerDis && handlerDis.activate();
//   });

//   $('#area').click(function () {
//     deactiveAll();
//     handlerArea && handlerArea.activate();
//   });
//   $('#height_a').click(function () {
//     deactiveAll();
//     handlerHeight && handlerHeight.activate();
//   });
//   $('#clear').click(function () {
//     clearAll();
//   });

//   $('#selOpt').change(function () {
//     var value = $(this).val();
//     if (value == '1') {
//       clampMode = 0;
//       handlerArea.clampMode = 0;
//       handlerDis.clampMode = 0;
//     } else {
//       clampMode = 1;
//       handlerArea.clampMode = 1;
//       handlerDis.clampMode = 1;
//     }
//   });

//   if (!scene.pickPositionSupported) {
//     //alert('IE浏览器不支持深度拾取,量算功能无法使用(无法进行鼠标交互绘制)，量算功能可在chrome、firefox下使用！');
//   }
// }

// function clearMeasureAll() {
//   handlerDis && handlerDis.clear();
//   handlerArea && handlerArea.clear();
//   handlerHeight && handlerHeight.clear();
// }

// function deactiveAll() {
//   handlerDis && handlerDis.deactivate();
//   handlerArea && handlerArea.deactivate();
//   handlerHeight && handlerHeight.deactivate();
// }

//画点线面
function enableDrawGeometry(viewer) {
  var tooltip = createTooltip(document.body);
  var handlerPoint = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
  handlerPoint.activeEvt.addEventListener(function (isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = '';
      $('body').removeClass('drawCur').addClass('drawCur');
    } else {
      viewer.enableCursorStyle = true;
      $('body').removeClass('drawCur');
    }
  });
  handlerPoint.movingEvt.addEventListener(function (windowPosition) {
    tooltip.showAt(windowPosition, '<p>点击绘制一个点</p>');
  });
  handlerPoint.drawEvt.addEventListener(function (result) {
    tooltip.setVisible(false);
  });

  drawHandler.handlerPoint = handlerPoint;
  var handlerLine = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
  handlerLine.activeEvt.addEventListener(function (isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = '';
      $('body').removeClass('drawCur').addClass('drawCur');
    } else {
      viewer.enableCursorStyle = true;
      $('body').removeClass('drawCur');
    }
  });
  handlerLine.movingEvt.addEventListener(function (windowPosition) {
    if (handlerLine.isDrawing) {
      tooltip.showAt(windowPosition, '<p>左键点击确定折线中间点</p><p>右键单击结束绘制</p>');
    } else {
      tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>');
    }

  });
  handlerLine.drawEvt.addEventListener(function (result) {
    tooltip.setVisible(false);
  });
  drawHandler.handlerLine = handlerLine;

  var handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, clampMode);
  handlerPolygon.activeEvt.addEventListener(function (isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = '';
      $('body').removeClass('drawCur').addClass('drawCur');
    } else {
      viewer.enableCursorStyle = true;
      $('body').removeClass('drawCur');
    }
  });
  handlerPolygon.movingEvt.addEventListener(function (windowPosition) {
    if (handlerPolygon.isDrawing) {
      tooltip.showAt(windowPosition, '<p>点击确定多边形中间点</p><p>右键单击结束绘制</p>');
    } else {
      tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>');
    }
  });
  handlerPolygon.drawEvt.addEventListener(function (result) {
    tooltip.setVisible(false);
    var positions = result.object.positions;
    var worldPositions = [];
    for (var i = 0; i < positions.length; i++) {
      var worldPos = CartToLonlat(positions[i]);
      worldPositions.push([worldPos.lon, worldPos.lat, worldPos.height]);
    }
    console.log(JSON.stringify(worldPositions));
  });
  drawHandler.handlerPolygon = handlerPolygon;


  var handlerMarker = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Marker);
  handlerMarker.activeEvt.addEventListener(function (isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = '';
      $('body').removeClass('drawCur').addClass('drawCur');
    } else {
      viewer.enableCursorStyle = true;
      $('body').removeClass('drawCur');
    }
  });
  handlerMarker.movingEvt.addEventListener(function (windowPosition) {
    tooltip.showAt(windowPosition, '<p>点击绘制地标</p>');
  });
  handlerMarker.drawEvt.addEventListener(function (result) {
    tooltip.setVisible(false);
  });
  drawHandler.handlerMarker = handlerMarker;

  $('#point').click(function () {
    deactiveAll();
    drawHandler.handlerPoint.activate();
  });
  $('#polyline').click(function () {
    deactiveAll();
    drawHandler.handlerLine.activate();
  });
  $('#polygon').click(function () {
    deactiveAll();
    drawHandler.handlerPolygon.activate();
  });
  $('#marker').click(function () {
    deactiveAll();
    drawHandler.handlerMarker.activate();
  });
  $('#clear').click(function () {
    clearAll();
  });
  if (!scene.pickPositionSupported) {
    alert('不支持深度拾取,无法进行鼠标交互绘制！');
  }
}

function deactiveAll() {
  drawHandler.handlerLine.deactivate();
  drawHandler.handlerPoint.deactivate();
  drawHandler.handlerPolygon.deactivate();
  drawHandler.handlerMarker.deactivate();
}

function clearAll() {
  drawHandler.handlerLine.clear();
  drawHandler.handlerPoint.clear();
  drawHandler.handlerPolygon.clear();
  drawHandler.handlerMarker.clear();
}

var measureLineSpace = function (viewer,handler) {
  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
  var positions = [];
  var poly = null;
  var tooltip = document.getElementById("toolTip");
  var distance = 0;
var cartesian = null;
var floatingPoint;
  tooltip.style.display = "block";

  handler.setInputAction(function (movement) {
      tooltip.style.left = movement.endPosition.x + 3 + "px";
      tooltip.style.top = movement.endPosition.y - 25 + "px";
      tooltip.innerHTML = '<p>单击开始，右击结束</p>';

  ///////=================================

  cartesian = viewer.scene.pickPosition(movement.endPosition); 
  
  /////==================================
      //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
      if (positions.length >= 2) {
          if (!Cesium.defined(poly)) {
              poly = new PolyLinePrimitive(positions);
          } else {
              positions.pop();
              // cartesian.y += (1 + Math.random());
              positions.push(cartesian);
          }
          distance = getSpaceDistance(positions);
          // console.log("distance: " + distance);
          // tooltip.innerHTML='<p>'+distance+'米</p>';
      }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(function (movement) {
      tooltip.style.display = "none";
  // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
  cartesian = viewer.scene.pickPosition(movement.position); 
      if (positions.length == 0) {
          positions.push(cartesian.clone());
      }
      positions.push(cartesian);
      //在三维场景中添加Label
     // var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      var textDisance = distance + "米";
      // console.log(textDisance + ",lng:" + cartographic.longitude/Math.PI*180.0);
  floatingPoint = viewer.entities.add({
          name: '空间直线距离',
    // position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
    position:positions[positions.length - 1],
          point: {
              pixelSize: 5,
              color: Cesium.Color.RED,
              outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
      heightReference:Cesium.HeightReference.NONE
          },
          label: {
              text: textDisance,
              font: '18px sans-serif',
              fillColor: Cesium.Color.GOLD,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(20, -20),
      heightReference:Cesium.HeightReference.NONE
          }
      });
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(function (movement) {
  handler.destroy();//关闭事件句柄
  positions.pop();//最后一个点无效
  viewer_g.entities.remove(floatingPoint);
      tooltip.style.display = "none";
    
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  var PolyLinePrimitive = (function () {
      function _(positions) {
          this.options = {
              name: '直线',
              polyline: {
                  show: true,
                  positions: [],
                  material: Cesium.Color.CHARTREUSE  ,
        width: 2
        
        
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
          this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
          viewer.entities.add(this.options);
      };

      return _;
  })();	

};