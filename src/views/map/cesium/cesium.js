import Cesium from 'cesium/Cesium';
import widgets from 'cesium/Widgets/widgets.css';

export const Init = function (jsondata, self,CesiumNavigation) {

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

  // AddKmlLayer(viewer, false);
  // var homeData = {
  //   baselayerEntities: undefined,
  //   djc3dtiles: undefined,
  //   gbh3dtiles:undefined,
  //   dataSource: undefined,
  //   baselayershow: isCheck
  // };
  AddJsonLayer(self.cesiumObjs.viewer, jsondata, true);

  // AddWMS(self.cesiumObjs.viewer);

  // debugger
  // Load3dtiles(viewer, '//192.168.5.51/ldata/djc/tileset.json', true, homeData);

  // Load3dtiles(viewer, 'http://202.114.148.160/sogbTo3dtiles/DongJiaCun/tileset.json', true, homeData,"djc3dtiles");
  // Load3dtiles(viewer, 'http://202.114.148.160/sogbTo3dtiles/GuanBaHe/tileset.json', true, homeData,"gbh3dtiles");

  // var viewer = CreateViewer(1);

  // if (viewer != undefined) {
  //   AddImageryLayer(viewer, 1);

  //   debugger
  //   // AddEntity(viewer);
  //   AddModel(viewer);
  // }

  // viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
  //   e.cancel = true;
  //   viewer.flyTo(homeData.baselayerEntities);
  // });

  // var element = document.getElementById('baselayer');
  // element.addEventListener('change', function (e) {
  //   homeData.baselayerEntities.show = e.target.checked;
  //   var obj = {
  //     checked : e.target.checked,
  //     dataSource : homeData.dataSource,
  //   }
  //   TrueChecked.call(obj,"JsonData",viewer);
  // });

  // var djcelement = document.getElementById('djcmodel');
  // djcelement.addEventListener('change', function (e) {
  //   homeData.djc3dtiles.show = e.target.checked;
  //   // var checked = e.target.checked;
  //   var obj = {
  //     checked : e.target.checked,
  //     tileset : homeData.djc3dtiles
  //   }
  //   TrueChecked.call(obj,"3DTiles",viewer);
  // });

  // var gbhelement = document.getElementById('gbhmodel');
  // gbhelement.addEventListener('change', function (e) {
  //   homeData.gbh3dtiles.show = e.target.checked;
  //   var obj = {
  //     checked : e.target.checked,
  //     tileset : homeData.gbh3dtiles,
  //   }
  //   TrueChecked.call(obj,"3DTiles",viewer);
  // });

  getPosition(self)

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
}

export function FlyTo_TileSet(tileset,viewer){
  viewer.flyTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0));
}

export function FlyTo_JsonData(jsonData,viewer){
  viewer.flyTo(jsonData);
}

function TrueChecked(type,viewer) {
  if(type == "JsonData"){
    if(this.checked){
      FlyTo_JsonData.call(this,viewer);
      return;
    }else{
      return;
    }
  }

  if(this.checked){
    FlyTo_TileSet.call(this,viewer);
  }
}

function Load3dtiles(viewer, url, isFlyTo, homeData, string) {
  var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: url,
  }));
  tileset.readyPromise.then(function () {
    homeData[string] = tileset;
    if (isFlyTo)
      viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 4.0));
  });
}
  
export function Load3dtiles1(url, viewer, arr) {
  var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: url,
  }));

  if(arr){
    tileset.readyPromise.then(function () {
      var longitude = 100.89544722222222;
      var latitude =  25.40965 ;
      var height = 1968;
      var heading = 0;
      var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
      var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)));
      Cesium.Matrix4.multiply(mat, rotationX, mat);
      tileset._root.transform = mat;
    })
  }

  return tileset;
}

function CreateViewer(id) {
  var viewer = undefined;
  switch (id) {
    case 0:
      viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false, //是否显示动画控件
        baseLayerPicker: false, //是否显示图层选择控件
        geocoder: true, //是否显示地名查找控件
        timeline: false, //是否显示时间线控件
        sceneModePicker: true, //是否显示投影方式控件
        navigationHelpButton: false, //是否显示帮助信息控件
        infoBox: true, //是否显示点击要素之后显示的信息
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      });
      break;
    case 1:
      viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false, //是否显示动画控件
        baseLayerPicker: false, //是否显示图层选择控件
        geocoder: true, //是否显示地名查找控件
        timeline: false, //是否显示时间线控件
        sceneModePicker: true, //是否显示投影方式控件
        navigationHelpButton: false, //是否显示帮助信息控件
        infoBox: true, //是否显示点击要素之后显示的信息
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
          layer: "tdtBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      });
      break;
  }
  return viewer;
}

function AddImageryLayer(viewer, id) {
  switch (id) {
    case 0:
      viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
        layer: "tdtAnnoLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false
      }));
      break;
    case 1:
      viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
        layer: "tdtAnnoLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible"
      }));
      break;
  }
}

export function AddJsonLayer(viewer, jsondata, isFlyTo) {
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
          heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
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

function AddKmlLayer(viewer, isFlyTo) {
  var kmlOptions = {
    camera: viewer.scene.camera,
    canvas: viewer.scene.canvas,
    clampToGround: true
  };

  var kmlPromise = Cesium.KmlDataSource.load('//192.168.5.4/data/kml/yunnanshi.kml', kmlOptions);

  kmlPromise.then(function (dataSource) {
    // Add the new data as entities to the viewer
    viewer.dataSources.add(dataSource);

    // Get the array of entities
    var neighborhoodEntities = dataSource.entities.values;
    for (var i = 0; i < neighborhoodEntities.length; i++) {
      var entity = neighborhoodEntities[i];

      entity.name = entity.properties.name;

      // Generate Polygon position
      var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
      var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
      polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
      entity.position = polyCenter;
      // Generate labels
      entity.label = {
        text: entity.name,
        showBackground: true,
        scale: 0.6,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10.0, 8000.0),
        disableDepthTestDistance: 100.0
      };
    }

    if (isFlyTo)
      viewer.flyTo(dataSource);
  });

  // viewer.flyTo(layer);
}

function AddEntity(viewer) {
  var blueBox = viewer.entities.add({
    name: 'Blue box',
    position: Cesium.Cartesian3.fromDegrees(114.0, 40.0, 300000.0),
    box: {
      dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
      material: Cesium.Color.BLUE
    }
  });

  var redBox = viewer.entities.add({
    name: 'Red box with black outline',
    position: Cesium.Cartesian3.fromDegrees(107.0, 40.0, 300000.0),
    box: {
      dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK
    }
  });

  var outlineOnly = viewer.entities.add({
    name: 'Yellow box outline',
    position: Cesium.Cartesian3.fromDegrees(100.0, 40.0, 300000.0),
    box: {
      dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
      fill: false,
      outline: true,
      outlineColor: Cesium.Color.YELLOW
    }
  });

  viewer.zoomTo(viewer.entities);
}

function AddModel(viewer) {
  var tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(14010)
    })
  );
  viewer.zoomTo(tileset);
}

function AddWMS(viewer) {
  var provider = new Cesium.WebMapServiceImageryProvider({
    url : 'http://202.114.148.160:8000/arcgis/services/云南/MyMapService/MapServer/WMSServer?',
    // url: "http://localhost:8000/geoserver/webgis/wms?",
    // layers : 'webgis:yn_wgs84',
    // parameters: {
    //   service : 'WMS',
    //   format: 'image/png',
    //   transparent: true
    // },
    crs : 'EPSG:4326',
    layers : '0',
    parameters : {
      service : 'WMS',
      format: 'image/png',
      transparent: true
    }
    // proxy: new Cesium.DefaultProxy('/proxy/')
  })
  viewer.imageryLayers.addImageryProvider(provider);
}

function getPosition(self) {
  //得到当前三维场景
  var scene = self.cesiumObjs.viewer.scene;
  //得到当前三维场景的椭球体
  var ellipsoid = scene.globe.ellipsoid;

  // var longitudeDiv = document.getElementById("longitudeDiv");
  // var latitudeDiv = document.getElementById("latitudeDiv");
  // var heightDiv = document.getElementById("heightDiv");
  // var altitudeDiv = document.getElementById("altitudeDiv");

  var longitudeString = null;
  var latitudeString = null;
  var height = null;
  var cartesian = null;
  // 定义当前场景的画布元素的事件处理
  var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
  handler.setInputAction(function (movement) {
    //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
    cartesian = self.cesiumObjs.viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
    if (cartesian) {
      //将笛卡尔坐标转换为地理坐标
      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      //将弧度转为度的十进制度表示
      longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      //获取相机高度
      height = Math.ceil(self.cesiumObjs.viewer.camera.positionCartographic.height);
      self.cesiumObjs.latitude = longitudeString.toFixed(2);
      self.cesiumObjs.longitude = latitudeString.toFixed(2);
      self.cesiumObjs.height = height.toFixed(0);
    } else {
      // entity.label.show = false;
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
  handler.setInputAction(function (wheelment) {
    height = Math.ceil(self.cesiumObjs.viewer.camera.positionCartographic.height);
    self.cesiumObjs.height = height.toFixed(0);
  }, Cesium.ScreenSpaceEventType.WHEEL);
}