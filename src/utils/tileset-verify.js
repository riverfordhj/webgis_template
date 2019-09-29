/*
 * @Descripttion: 
 * @version: 
 * @Author: KanMing
 * @Date: 2019-09-29 17:41:00
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-29 17:54:49
 */
import Cesium from 'cesium/Cesium'
// import $ from "jquery";
// import tokml from "tokml";
// import GeoJSON from "geojson";
import axios from 'axios'

function verifyYesOrNo(name, g_data, currtVerify) {
  // for (let i = 0, leng = g_data.length; i < leng; i++) {
  //   if (g_data[i].layName == name) {
  //     if (g_data[i].offsetId == currtVerify) {
  //       return true
  //     } else {
  //       g_data[i].offsetId = currtVerify
  //       return false
  //     }
  //   }
  // }
  // return false
  return false
}

function getCurrtVerify(verifynumber) {
  return (
    verifynumber.Latitude +
    verifynumber.Longitude +
    verifynumber.OffsetHeight +
    verifynumber.OffsetLatitude +
    verifynumber.OffsetLongitude +
    verifynumber.RotateX +
    verifynumber.RotateY +
    verifynumber.RotateZ +
    verifynumber.Scale
  )
}

function verifyStart(tileset, data, g_data) {
  var tmpdata = {
    Height: parseFloat(data.Height),
    Id: parseFloat(data.Id),
    Latitude: parseFloat(data.Latitude),
    LayerName: data.LayerName,
    Longitude: parseFloat(data.Longitude),
    OffsetHeight: parseFloat(data.OffsetHeight),
    OffsetLatitude: parseFloat(data.OffsetLatitude),
    OffsetLongitude: parseFloat(data.OffsetLongitude),
    RotateX: parseFloat(data.RotateX),
    RotateY: parseFloat(data.RotateY),
    RotateZ: parseFloat(data.RotateZ),
    Scale: parseFloat(data.Scale)
  }

  if (verifyYesOrNo(tmpdata.LayerName, g_data, getCurrtVerify(tmpdata))) {
    return
  }

  var initCartographic = Cesium.Cartographic.fromCartesian(
    tileset.boundingSphere.center
  )
  // console.log(
  // 1

  var hudu = Cesium.Cartographic.fromDegrees(
    tmpdata.Longitude,
    tmpdata.Latitude,
    tmpdata.Height
  )
  change3dTilesPositon(
    tileset,
    initCartographic,
    hudu.longitude,
    hudu.latitude,
    hudu.height
  )
  // console.log('change3dTilesPositon----------end')
  var lastCartographic = Cesium.Cartographic.fromCartesian(
    tileset.boundingSphere.center
  )

  adjust3dTilesPosition(
    tileset,
    initCartographic,
    lastCartographic,
    tmpdata.OffsetLongitude,
    tmpdata.OffsetLatitude,
    tmpdata.OffsetHeight
  )

  let modelMatrix = Cesium.Matrix4.fromArray(tileset.root.transform)

  rotationAndScale(
    tileset,
    modelMatrix,
    tmpdata.RotateZ,
    tmpdata.RotateY,
    tmpdata.RotateX,
    tmpdata.Scale
  )
}

// 获取三维调整的表格  三个变量：name 图层名， tileset是自由， g_layarArry 数组
export function getHttpVerify(name, tileset, g_layerArry) {
  debugger
  var api =
    'http://172.16.7.55/yn_webapi/api/spatialdata/GetModelPosition?layerName=' +
    name
  // 获取tileset坐标

  axios
    .get(api)
    .then(Response => {
      // console.log(Response)
      verifyStart(tileset, Response.data, g_layerArry)
      //g_layerArry
    })
    .catch(error => {
      console.log('获取校验接口数据错误')
    })
}

// 2 计算3dTiles模型经纬度、高程的增量
function adjust3dTilesPosition(
  tileset,
  initCartographic,
  lastCartographic,
  offLongitude,
  offLatitude,
  offHeight
) {
  if (!tileset.root) {
    return
  }
  var degreeToCartographic = Cesium.Cartographic.fromDegrees(
    offLongitude,
    offLatitude,
    offHeight
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
// 1 平移调整 3dtiles模型的位置
/**
 * initCartographic = Cesium.Cartographic.fromCartesian(
  tileset.boundingSphere.center
)
 * */
export function change3dTilesPositon(
  tileset,
  initCartographic,
  longs,
  lats,
  hs
) {
  // var hudu = new Cesium.Cartographic(longs, lats, hs);

  var surface = Cesium.Cartesian3.fromRadians(
    initCartographic.longitude,
    initCartographic.latitude,
    initCartographic.height
  )
  var offset = Cesium.Cartesian3.fromRadians(longs, lats, hs)
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
