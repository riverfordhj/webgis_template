import Cesium from 'cesium/Cesium.js'

// 初始化一个viewer
const Init = function() {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYzVmODUzMy03ZjZjLTQzMmQtYjlmZC1lZjBkYzgzYjc3NTciLCJpZCI6NDUzMiwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MTA1NzA3MX0.LtxiUHHxAsLj-PR9VCn-sCRaej5Lt2XN2pWPJcWTW5U'
  var viewer = new Cesium.Viewer('cesiumContainer', {
    // load Cesium World Terrain
    terrainProvider: Cesium.createWorldTerrain({
      requestWaterMask: true, // required for water effects
      requestVertexNormals: true // required for terrain lighting
    }),
    infoBox: true, // infobox小部件，点击显示属性信息
    fullscreenButton: true, // viewer全屏显示
    baseLayerPicker: true, // 底图选择部件
    sceneModePicker: false, // 在3D，2D和哥伦布视图（CV）模式之间切换。
    homeButton: false, // 默认视图回正
    geocoder: false, // 位置搜索工具
    navigationHelpButton: false, // 默认相机控件
    // CreditsDisplay: false,// 显示数据信息
    animation: false, // 视图动画控制
    timeline: false, // 时间轴
    selectionIndicator: false
  })
  // Enable depth testing so things behind the terrain disappear.
  viewer.scene.globe.depthTestAgainstTerrain = true
  // viewer.extend(Cesium.viewerCesiumInspectorMixin)

  return viewer
  // addJsonLayer(viewer, jsonData)
}

// 定义3dTiles模型所选要素的交互形式
var featureViewer = {
  colorHighlight: Cesium.Color.YELLOW.withAlpha(0.3),
  colorSelected: Cesium.Color.LIME.withAlpha(0.3),
  setMouseOver: function(v) {
    if (v) {
      this.viewer.screenSpaceEventHandler.setInputAction(
        this.onMouseMove,
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      )
    } else {
      this.restoreHighlight()

      this.nameOverlay.style.display = 'none'
      this.viewer.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      )
    }
  },
  setMouseClick: function(v) {
    if (v) {
      this.orginClickHandler = this.viewer.screenSpaceEventHandler.getInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      )
      this.viewer.screenSpaceEventHandler.setInputAction(
        this.onLeftClick,
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      )
    } else {
      // 设置为原来的
      this.viewer.screenSpaceEventHandler.setInputAction(
        this.orginClickHandler,
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      )
    }
  },
  install: function(viewer) {
    var nameOverlay = document.createElement('div')
    viewer.container.appendChild(nameOverlay)
    nameOverlay.className = 'backdrop'
    nameOverlay.style.display = 'none'
    nameOverlay.style.position = 'absolute'
    nameOverlay.style.bottom = '0'
    nameOverlay.style.left = '0'
    nameOverlay.style['pointer-events'] = 'none'
    nameOverlay.style.padding = '4px'
    nameOverlay.style.backgroundColor = 'black'
    nameOverlay.style.color = 'white'
    this.nameOverlay = nameOverlay

    var selected = {
      feature: undefined,
      originalColor: new Cesium.Color()
    }

    var highlighted = {
      feature: undefined,
      originalColor: new Cesium.Color()
    }

    const selectedEntity = new Cesium.Entity()

    this.viewer = viewer

    var leftDown = false
    var middleDown = false

    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      leftDown = true
    },
    Cesium.ScreenSpaceEventType.LEFT_DOWN)

    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      leftDown = false
    },
    Cesium.ScreenSpaceEventType.LEFT_UP)

    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      middleDown = true
    },
    Cesium.ScreenSpaceEventType.MIDDLE_DOWN)

    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      middleDown = false
    },
    Cesium.ScreenSpaceEventType.MIDDLE_UP)

    this.restoreHighlight = function() {
      // If a feature was previously highlighted, undo the highlight
      if (Cesium.defined(highlighted.feature)) {
        try {
          highlighted.feature.color = highlighted.originalColor
        } catch (ex) {
          console.log(ex)
        }
        highlighted.feature = undefined
      }
    }

    this.onMouseMove = function(movement) {
      self.restoreHighlight()

      if (middleDown || leftDown) {
        nameOverlay.style.display = 'none'
        return
      }

      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.endPosition)
      if (!Cesium.defined(pickedFeature)) {
        nameOverlay.style.display = 'none'
        return
      }

      if (!Cesium.defined(pickedFeature.getProperty)) {
        nameOverlay.style.display = 'none'
        return
      }
      // A feature was picked, so show it's overlay content

      var name = pickedFeature.getProperty('gid')
      if (!Cesium.defined(name)) {
        name = pickedFeature.getProperty('id')
      }
      if (!Cesium.defined(name)) {
        name = pickedFeature.getProperty('ID')
      }
      if (name === '') {
        nameOverlay.style.display = 'none'
        return
      }

      nameOverlay.style.display = 'block'
      nameOverlay.style.bottom =
        viewer.canvas.clientHeight - movement.endPosition.y + 'px'
      nameOverlay.style.left = movement.endPosition.x + 'px'

      nameOverlay.textContent = name

      // Highlight the feature if it's not already selected.
      if (pickedFeature !== selected.feature) {
        highlighted.feature = pickedFeature
        Cesium.Color.clone(pickedFeature.color, highlighted.originalColor)
        pickedFeature.color = self.colorHighlight
      }
    }

    var self = this
    this.onLeftClick = function(movement) {
      // If a feature was previously selected, undo the highlight
      if (Cesium.defined(selected.feature)) {
        try {
          selected.feature.color = selected.originalColor
        } catch (ex) {
          console.log(ex)
        }
        selected.feature = undefined
      }

      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.position)
      if (!Cesium.defined(pickedFeature)) {
        self.orginClickHandler(movement)
        return
      }

      // Select the feature if it's not already selected
      if (selected.feature === pickedFeature) {
        return
      }

      if (!Cesium.defined(pickedFeature.getProperty)) return

      selected.feature = pickedFeature

      // Save the selected feature's original color
      if (pickedFeature === highlighted.feature) {
        Cesium.Color.clone(highlighted.originalColor, selected.originalColor)
        highlighted.feature = undefined
      } else {
        Cesium.Color.clone(pickedFeature.color, selected.originalColor)
      }

      // Highlight newly selected feature
      pickedFeature.color = self.colorSelected

      // Set feature infobox description

      var featureName = pickedFeature.getProperty('gid')
      selectedEntity.name = featureName
      selectedEntity.description =
        'Loading <div class="cesium-infoBox-loading"></div>'
      viewer.selectedEntity = selectedEntity

      var names = pickedFeature._content.batchTable.getPropertyNames(
        pickedFeature._batchId
      )

      // 普通3dtiles 获取属性表格
      var html = get3dTilesHtml(pickedFeature)

      if (!html) {
        html = '<table class="cesium-infoBox-defaultTable"><tbody>'

        for (var i = 0; i < names.length; i++) {
          var n = names[i]
          html +=
            '<tr><th>' +
            n +
            '</th><td>' +
            pickedFeature.getProperty(n) +
            '</td></tr>'
        }
        html += '</tbody></table>'
      }

      selectedEntity.description = html
    }

    this.setMouseOver(true)
    this.setMouseClick(true)
  }
}

// 若3dTiles模型的 pickedFeature 具有"file"属性，获取selectedEntity的描述Html
function get3dTilesHtml(pickedFeature) {
  if (
    !pickedFeature.tileset.properties ||
    !pickedFeature.tileset.properties.length
  ) {
    return false
  }

  var fileParams

  // 如果有文件名，那么依据文件名
  if (pickedFeature.hasProperty('file')) {
    var file = pickedFeature.getProperty('file')

    for (var i = 0; i < pickedFeature.tileset.properties.length; i++) {
      var params = pickedFeature.tileset.properties[i]
      if (params.file === file) {
        fileParams = params.params
      }
    }
  } else {
    fileParams = pickedFeature.tileset.properties[0].params
  }

  if (!fileParams) return false

  // 名称和 id
  var html = '<table class="cesium-infoBox-defaultTable"><tbody>'
  html +=
    '<tr><th>名称(name)</th><td>' +
    pickedFeature.getProperty('name') +
    '</td></tr>'

  html +=
    '<tr><th>楼层(LevelName)</th><td>' +
    pickedFeature.getProperty('LevelName') +
    '</td></tr>'

  html +=
    '<tr><th>分类(CategoryName)</th><td>' +
    pickedFeature.getProperty('CategoryName') +
    '</td></tr>'

  html +=
    '<tr><th>族(FamilyName)</th><td>' +
    pickedFeature.getProperty('FamilyName') +
    '</td></tr>'

  html +=
    '<tr><th>族类型(FamilySymbolName)</th><td>' +
    pickedFeature.getProperty('FamilySymbolName') +
    '</td></tr>'

  html +=
    '<tr><th>ID(id)</th><td>' + pickedFeature.getProperty('id') + '</td></tr>'

  // 依据group分类
  var groups = {}

  function getValue(value, defp) {
    if (defp.type === 'YesNo') return value === 1 ? '是' : '否'
    if (defp.type === 'Length') return (value * 0.3048).toFixed(2) + 'm'
    if (defp.type === 'Area') return (value * 0.3048 * 0.3048).toFixed(2) + '㎡'
    if (defp.type === 'Volume') {
      return (value * 0.3048 * 0.3048 * 0.3048).toFixed(2) + 'm³'
    }

    return value
  }

  function addGroup(name, value) {
    var defp

    for (let i = 0; i < fileParams.length; i++) {
      var fp = fileParams[i]
      if (name === fp.name) {
        defp = fp
        break
      }
    }
    if (!defp) return

    var rows = groups[defp.group]

    if (!rows) {
      rows = []
    }
    var row =
      '<tr><th>' +
      defp.name +
      '</th><td>' +
      getValue(value, defp) +
      '</td></tr>'
    rows.push(row)
    groups[defp.group] = rows
  }

  function groupName(group) {
    if (group === 'PG_IDENTITY_DATA') return '标识数据'
    if (group === 'PG_GEOMETRY') return '尺寸标注'
    if (group === 'PG_PHASING') return '阶段化'
    if (group === 'PG_CONSTRAINTS') return '约束'
    if (group === 'INVALID') return '其他'
    if (group === 'PG_MATERIALS') return '材质和装饰'
    if (group === 'PG_CONSTRUCTION') return '构造'

    return group
  }

  var names = pickedFeature._content.batchTable.getPropertyNames(
    pickedFeature._batchId
  )
  for (let i = 0; i < names.length; i++) {
    var n = names[i]

    addGroup(n, pickedFeature.getProperty(n))
  }

  for (const group in groups) {
    html += '<tr><th colspan="2">' + groupName(group) + '</th></tr>'

    var rows = groups[group]
    for (let i = 0; i < rows.length; i++) {
      html += rows[i]
    }
  }

  return html
}

// 加载 3dTiles 模型及模型的单体化
function add3dTiles(viewer) {
  featureViewer.install(viewer)
  var tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      // url: 'http://202.114.148.160/Tilesets/osgb/tileset.json',
      // url: 'http://202.114.148.160/sogbTo3dtiles/DongJiaCun/tileset.json',
      // url:'http://202.114.148.160/sogbTo3dtiles/GuanBaHe/tileset.json',
      // url: 'http://202.114.148.160/Tilesets/BatchedSHY/tileset.json',
      url: 'http://202.114.148.160/saxc/tileset.json',
      show: true,
      modelMatrix: Cesium.Matrix4.IDENTITY
    })
  )
  var classificationTileset = new Cesium.Cesium3DTileset({
    url: 'http://202.114.148.160:6080/saxc-dth/tileset.json',
    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
  })
  classificationTileset.style = new Cesium.Cesium3DTileStyle({
    color: 'rgba(255,255,255,0.01)'
  })

  viewer.scene.primitives.add(classificationTileset)

  return tileset
}

// 加载3dTiles模型
function change3dTiles(viewer, modelUrl) {
  viewer.scene.primitives.removeAll()
  var tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: modelUrl,
      show: true,
      modelMatrix: Cesium.Matrix4.IDENTITY
    })
  )
  return tileset
}

// 计算3dTiles模型经纬度、高程的增量
function adjust3dTilesPosition(
  tileset,
  initCartographic,
  lastCartographic,
  longitude,
  latitude,
  height
) {
  if (!tileset.root) {
    return
  }
  var degreeToCartographic = Cesium.Cartographic.fromDegrees(
    longitude,
    latitude,
    height
  )
  var long = initCartographic.longitude + degreeToCartographic.longitude
  var lat = initCartographic.latitude + degreeToCartographic.latitude
  var h = initCartographic.height + degreeToCartographic.height

  var arr = Object.keys(lastCartographic)
  if (arr.length !== 0) {
    long = lastCartographic.longitude + degreeToCartographic.longitude
    lat = lastCartographic.latitude + degreeToCartographic.latitude
    h = lastCartographic.height + degreeToCartographic.height
  }

  change3dTilesPositon(tileset, initCartographic, long, lat, h)
}
// 平移调整 3dtiles模型的位置
function change3dTilesPositon(tileset, initCartographic, long, lat, h) {
  var surface = Cesium.Cartesian3.fromRadians(
    initCartographic.longitude,
    initCartographic.latitude,
    initCartographic.height
  )
  var offset = Cesium.Cartesian3.fromRadians(long, lat, h)
  var translation = Cesium.Cartesian3.subtract(
    offset,
    surface,
    new Cesium.Cartesian3()
  )
  tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
}

// headingPitchRoll,旋转3dTiles模型;更改 3dTiles模型
function rotationAndScale(
  tileset,
  tranformMatrix4,
  heading,
  pitch,
  roll,
  scale
) {
  if (!tileset.root) {
    return
  }
  var a = tranformMatrix4
  var s = Cesium.Matrix4.getTranslation(a, new Cesium.Cartesian3())
  var _s = Cesium.Transforms.eastNorthUpToFixedFrame(s)
  var angle = Cesium.Matrix3.fromHeadingPitchRoll(
    Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, roll)
  )
  var rModelMatrix = Cesium.Matrix4.multiplyByMatrix3(
    _s,
    angle,
    new Cesium.Matrix4()
  )
  var modelMatrix = Cesium.Matrix4.multiplyByUniformScale(
    rModelMatrix,
    scale,
    new Cesium.Matrix4()
  )
  tileset.root.transform = modelMatrix
}

// 加载json数据并修改其属性样式
function addJsonLayer(viewer, jsonData, colorMaker, EntityColor) {
  viewer.dataSources.removeAll()
  var geojsonOptions = {
    clampToGround: true
  }

  var dataSourcePromise = Cesium.GeoJsonDataSource.load(
    jsonData,
    geojsonOptions
  )

  dataSourcePromise.then(function(dataSource) {
    // Add the new data as entities to the viewer
    viewer.dataSources.add(dataSource)

    // Get the array of entities
    var entityArray = dataSource.entities.values
    for (var i = 0; i < entityArray.length; i++) {
      var entity = entityArray[i]

      if (Cesium.defined(entity.polygon)) {
        // Use geojson properties value as entity name
        entity.name = entity.properties.grid_name

        if (colorMaker) {
          jsonColor(entity, EntityColor)
        }

        // Generate Polygon position
        var polyPositions = entity.polygon.hierarchy.getValue(
          Cesium.JulianDate.now()
        ).positions
        var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center
        polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter)
        entity.position = polyCenter

        // Generate labels
        entity.label = {
          text: entity.name,
          showBackground: true,
          scale: 0.5,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            100.0,
            2000000.0
          ),
          disableDepthTestDistance: 10000.0
        }
      }
    }
    viewer.zoomTo(dataSource)
  })
}

function jsonColor(entity, alpha) {
  // Set the polygon material to a color.
  entity.polygon.material = Cesium.Color.fromAlpha(Cesium.Color.SKYBLUE, alpha)
}

// 添加kml模型
function addKmlLayer(viewer) {
  var kmlOptions = {
    camera: viewer.scene.camera,
    canvas: viewer.scene.canvas,
    clampToGround: true
  }

  var geocachePromise = Cesium.KmlDataSource.load(
    '../../../public/partyBuilding.kml',
    kmlOptions
  )

  // Add entities to scene and style them
  geocachePromise.then(function(dataSource) {
    // Add the new data as entities to the viewer
    viewer.dataSources.add(dataSource)

    // Get the array of entities
    var geocacheEntities = dataSource.entities.values
    var kmlEntitys = geocacheEntities[0]
    var entitys = kmlEntitys._children
    for (var i = 0; i < entitys.length; i++) {
      var entity = entitys[i]._children[0]
      if (Cesium.defined(entity.polygon)) {
        // Entity styling code here
        // Generate labels
        // entity.name = 'ee'

        // Generate Polygon position
        var polyPositions = entity.polygon.hierarchy.getValue(
          Cesium.JulianDate.now()
        ).positions
        var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center
        polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter)
        entity.position = polyCenter

        entity.label = {
          text: entity.name,
          showBackground: true,
          scale: 0.5,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
            100.0,
            2000000.0
          ),
          disableDepthTestDistance: 10000.0
        }
      }
    }
    viewer.zoomTo(dataSource)
  })
}

export {
  Init,
  addJsonLayer,
  addKmlLayer,
  add3dTiles,
  change3dTiles,
  adjust3dTilesPosition,
  rotationAndScale,
  change3dTilesPositon
}
