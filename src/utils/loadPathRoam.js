/*
 * @Descripttion: 
 * @version: 
 * @Author: KanMing
 * @Date: 2019-09-29 18:40:56
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-29 18:40:56
 */
/*
 * @author huanglaofu
 * @飞行漫游
 * @description  data http 接口获取的数据  _this 父目录
 * @Copyright(c),xxx,xxx,xxx  ynwdi.com
 * @Date:20190906
 * @other
 */

import Cesium from 'cesium/Cesium'
import axios from 'axios'

//
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'
// axios.defaults.withCredentials = true; // 跨域允许

// import qs from 'qs'
// import { saveAs } from 'file-saver'

var transformX = 50 //距离运动点的距离（后方）
var transformZ = 10 //距离运动点的高度（上方）
var flyHeight = 30 //70

var flyPointId = 'opoopop123',
  renderListener

export function flyRoamUtil(_this) {
  console.log(
    '--------------------------///flyRoamUtil//---------------------------'
  )

  // 设置窗布参数
  setCesiumViewer(_this.viewer)
  httpsGetJson(
    'http://172.16.7.55/yn_webapi/api/FlightPath/GetFlightPath',
    _this
  )
}
// 设置漫游参数
export function setFlyRCanShu(data) {
  flyHeight = data.zjgaodu
  transformX = data.juli
  transformZ = data.hgaodu
}
// 获取漫游参数

export function getFlyRCanshu() {
  var obj = {
    zjgaodu: flyHeight,
    juli: transformX,
    hgaodu: transformZ
  }
  return obj
}

// 设置参数
function setCesiumViewer(viewer) {
  console.log('setCesiumViewer')
  console.log(viewer)
  // new Cesium.Timeline(container, clock)
  console.log(viewer.timeline)
}

function httpsGetJson(api, _this) {
  // encodeURI
  // 这个接口后期应该有个接口函数表
  var api = 'http://172.16.7.55/yn_webapi/api/FlightPath/GetFlightPath'
  console.log('get https---------->>>>get 路径2')
  console.log(_this)
  // _this.setSlFlyRoamShow();
  var that = _this

  axios
    .post(api)
    .then(Response => {
      console.log(Response.data)

      if (Response.data.length > 0) {
        that.setSlFlyRoamShow(Response.data)
      }
    })
    .catch(error => {
      console.log('获取飞行漫游路径' + error)
    })
}

//按固定线路飞行
export function flyByPolyline(viewer, road, vtimer) {
  let start = Cesium.JulianDate.fromDate(new Date(2017, 7, 11))
  // 结束时间

  let stop = Cesium.JulianDate.addSeconds(
    start,
    vtimer,
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

  // 循环执行,即为2，到达终止时间，重新从起点时间开始
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP

  // viewer.camera.flyTo({
  //     destination:Cesium.Cartesian3.fromDegrees(116.405419,32.073514,20000)
  // })
  console.log(road)
  for (let j = 0; j < road.length; j++) {
    let property = computeFlight(viewer, road[j], start)
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
        color: new Cesium.Color.fromCssColorString('#FFFF00').withAlpha(0.2),
        pixelSize: 10
      }
    })

    viewer.trackedEntity = planeModel

    var scratch = new Cesium.Matrix4()

    //////////////
    var _this = this

    renderListener = function(e) {
      var time =
        viewer.clock.currentTime.secondsOfDay -
        viewer.clock.startTime.secondsOfDay
      //viewer.camera.positionCartographic.height = 2000 + $this.limitCamera(f_property);
      // if ($this.flightEntity && $this.isFollowModel) {
      getModelMatrix(planeModel, viewer.clock.currentTime, scratch)

      viewer.scene.camera.lookAtTransform(
        scratch,
        new Cesium.Cartesian3(-transformX, 0, transformZ)
      )
      // }
    }

    viewer.scene.preRender.addEventListener(renderListener)
  }

  console.log('flyByPolyline----------end')
}

function getModelMatrix(entity, time, result) {
  var matrix3Scratch = new Cesium.Matrix3()

  var position = Cesium.Property.getValueOrUndefined(
    entity.position,
    time,
    new Cesium.Cartesian3()
  )
  if (!Cesium.defined(position)) {
    return undefined
  }
  var orientation = Cesium.Property.getValueOrUndefined(
    entity.orientation,
    time,
    new Cesium.Quaternion()
  )
  if (!Cesium.defined(orientation)) {
    result = Cesium.Transforms.eastNorthUpToFixedFrame(
      position,
      undefined,
      result
    )
  } else {
    result = Cesium.Matrix4.fromRotationTranslation(
      Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
      position,
      result
    )
  }
  return result
}
//计算飞行
function computeFlight(viewer, source, start) {
  // 取样位置 相当于一个集合
  console.log(source)

  let property = new Cesium.SampledPositionProperty()
  for (let i = 0; i < source.length; i++) {
    let time = Cesium.JulianDate.addSeconds(
      start,
      source[i].time,
      new Cesium.JulianDate()
    )
    let position = new Cesium.Cartesian3(
      source[i].x,
      source[i].y,
      source[i].z /*  */
    )
    //
    // 停止

    // console.log()

    var testPotion = setHeightcartesian3(viewer, position, flyHeight)

    // let postion2 =  Cesium.Cartographic.fromCartesian(position);
    // postion2.height = postion2.height + 500;
    // let  position3 =  Cesium.Cartesian3.fromDegrees(postion2.longitude, postion2.latitude, postion2.height);

    // 添加位置，和时间对应
    property.addSample(time, testPotion)
  }
  return property
}
//  设置世界高度
function setHeightcartesian3(viewer, position, offHeight) {
  var ellipsoid = viewer.scene.globe.ellipsoid
  // 转弧度
  var cartographic = ellipsoid.cartesianToCartographic(position)

  var lat = Cesium.Math.toDegrees(cartographic.latitude)
  var lng = Cesium.Math.toDegrees(cartographic.longitude)
  var height = cartographic.height + offHeight

  var test = Cesium.Cartesian3.fromDegrees(lng, lat, height)
  // Cesium.Cartesian3.fromRadians(lng, lat, height);

  return test
}

export function stopFly(viewer) {
  // viewer.clock = new Cesium.Clock({
  //   startTime: Cesium.JulianDate.fromIso8601("2013-12-25"),
  //   currentTime: Cesium.JulianDate.fromIso8601("2013-12-25"),
  //   stopTime: Cesium.JulianDate.fromIso8601("2013-12-26"),
  //   clockRange: Cesium.ClockRange.LOOP_STOP,
  //   clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER
  // });
  viewer.timeline.zoomTo(
    Cesium.JulianDate.fromDate(new Date(2017, 7, 11)),
    Cesium.JulianDate.fromDate(new Date(2017, 7, 12))
  )
  console.log(viewer.timeline)

  viewer.clock.clockRange = Cesium.ClockRange.CLAMPED
  // viewer.timeline.
  viewer.entities.removeById(flyPointId)
  viewer.scene.preRender.removeEventListener(renderListener)
}
