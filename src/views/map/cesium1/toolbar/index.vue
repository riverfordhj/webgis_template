<template>
  <div class="toolbar">
    <hsc-menu-style-white>
      <hsc-menu-bar style="border-radius: 0 0 4pt 0;">
        <hsc-menu-bar-item label="基础">
          <hsc-menu-item label="图层管理" @click="openLayerTreePanel" />
        </hsc-menu-bar-item>
        <hsc-menu-bar-item label="绘制">
          <!-- <hsc-menu-separator/> -->
          <hsc-menu-item label="绘制点" @click="drawPointEvent" />
          <hsc-menu-item label="绘制线" @click="drawPolylineEvent" />
          <hsc-menu-item label="绘制面" @click="drawPolygonEvent" />
          <hsc-menu-item label="移除绘制" @click="removeEntities(dataSource)" />
        </hsc-menu-bar-item>
        <hsc-menu-bar-item label="测量">
          <hsc-menu-item label="测量长度" @click="measurePolylineEvent" />
          <hsc-menu-item label="测量面积" @click="measurePolygonEvent" />
          <hsc-menu-item label="测量高度" @click="measureHeightEvent" />
          <hsc-menu-item label="移除测量" @click="removeEntities(dataSource)" />
        </hsc-menu-bar-item>
      </hsc-menu-bar>    
    </hsc-menu-style-white>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import $ from "jquery";

export default {
  name: "",
  data() {
    return {
      dataSource: new Map(),
      dataSource1: new Cesium.DataSourceCollection(),
      drawHandler: null,
      radiansPerDegree: Math.PI / 180.0,
      degreesPerRadian: 180.0 / Math.PI,
      tooltip: null
    };
  },
  props: ["viewer"],
  mounted() {
  },
  methods: {
    openLayerTreePanel() {
      this.$emit("openLayerTreePanel", true);
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
    drawPoint() {
      this.clearHandler();
      var _this = this;
      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      this.drawHandler.setInputAction(function(event) {
        var pickedObject = _this.viewer.scene.pick(event.position);
        //获取地形或模型对应的cartesian3
        var cartesian = _this.viewer.scene.pickPosition(event.position);
        if (Cesium.defined(cartesian)) {
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
        _this.viewer.entities.add(label);
        _this.dataSource.set(label.id, label);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.drawHandler.setInputAction(function(event) {
        _this.showTooltip(event.endPosition, `左键单击画点，右键单击停止`)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      this.drawHandler.setInputAction(function(event) {
        _this.drawHandler.destroy()
        _this.drawHandler = null
        _this.hideTooltip()
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    },
    drawPolyline() {
      this.clearHandler();
      var _this = this;    
      var PolyLinePrimitive = (function() {
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

        _.prototype._init = function() {
          var _self = this;
          var _update = function() {
            return _self.positions;
          };
          //实时更新polyline.positions
          this.options.polyline.positions = new Cesium.CallbackProperty(
            _update,
            false
          );
          _this.viewer.entities.add(this.options);
          _this.dataSource.set(this.options.id, this.options);
        };
        return _;
      })();

      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        _this.viewer.scene.canvas
      );
      var positions = [];
      var poly = undefined;
      //鼠标左键单击画点
      this.drawHandler.setInputAction(function(event) {
        var cartesian = _this.viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //鼠标移动
      this.drawHandler.setInputAction(function(event) {
        var cartesian = _this.viewer.scene.pickPosition(event.endPosition);
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
      this.drawHandler.setInputAction(function(event) {
        _this.drawHandler.destroy();
        _this.drawHandler = null;
        // tooltip[0].style.display = "none"
        _this.hideTooltip()
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    drawPolygon() {
      this.clearHandler();
      var _this = this;  
      var PolygonPrimitive = (function() {
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

        _.prototype._init = function() {
          var _self = this;
          var _update = function() {
            return _self.hierarchy;
          };
          //实时更新polygon.hierarchy
          this.options.polygon.hierarchy = new Cesium.CallbackProperty(
            _update,
            false
          );
          _this.viewer.entities.add(this.options);
          // _this.dataSource.push(this.options)
          _this.dataSource.set(this.options.id, this.options);
        };
        return _;
      })();

      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        _this.viewer.scene.canvas
      );
      var positions = [];
      var poly = undefined;

      //鼠标单击画点
      this.drawHandler.setInputAction(function(event) {
        // var cartesian = _this.viewer.scene.camera.pickEllipsoid(
        //   event.position,
        //   _this.viewer.scene.globe.ellipsoid
        // );
        var cartesian = _this.viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //鼠标移动
      this.drawHandler.setInputAction(function(event) {
        var cartesian = _this.viewer.scene.pickPosition(event.endPosition);
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
      this.drawHandler.setInputAction(function(event) {
        _this.drawHandler.destroy();
        _this.drawHandler = null;
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
      var PolyLinePrimitive = (function() {
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

        _.prototype._init = function() {
          var _self = this;
          var _update = function() {
            return _self.positions;
          };
          //实时更新polyline.positions
          this.options.polyline.positions = new Cesium.CallbackProperty(
            _update,
            false
          );
          _this.viewer.entities.add(this.options);
          _this.dataSource.set(this.options.id, this.options);
          _this.dataSource1.add(this.options);
        };
        return _;
      })();

      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
      this.drawHandler.setInputAction(event => {
        var cartesian = _this.viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }

        var distance = this.getSpaceDistance(positions);
        _this.showTooltip(event.position, `${distance}米`)

        positions.push(cartesian);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      this.drawHandler.setInputAction(event => {
        var cartesian = _this.viewer.scene.pickPosition(event.endPosition);
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
    measurePolygon() {
      this.clearHandler();
      var _this = this;
      var tooltip = $("#tooltip")
      var PolygonPrimitive = (function() {
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

        _.prototype._init = function() {
          var _self = this;
          var _update = function() {
            return _self.hierarchy;
          };
          //实时更新polygon.hierarchy
          this.options.polygon.hierarchy = new Cesium.CallbackProperty(
            _update,
            false
          );
          _this.viewer.entities.add(this.options);
          // _this.dataSource.push(this.options)
          _this.dataSource.set(this.options.id, this.options);
        };
        return _;
      })();

      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        _this.viewer.scene.canvas
      );
      var positions = [];
      var poly = undefined;

      //鼠标单击画点
      this.drawHandler.setInputAction(function(event) {
        var cartesian = _this.viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        var textArea = _this.getArea(positions) + "平方公里";
        console.log(textArea);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //鼠标移动
      this.drawHandler.setInputAction(function(event) {
        var cartesian = _this.viewer.scene.pickPosition(event.endPosition);
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
      this.drawHandler.setInputAction(function(event) {
        _this.drawHandler.destroy();
        _this.drawHandler = null;
        _this.hideTooltip()
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
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
    measureHeight() {
      var _this = this
      this.clearHandler()
      var tooltip = $("#tooltip")
      var PolyLinePrimitive = (function() {
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

        _.prototype._init = function() {
          var _self = this;
          var _update = function() {
            return _self.positions;
          };
          //实时更新polyline.positions
          this.options.polyline.positions = new Cesium.CallbackProperty(
            _update,
            false
          );
          _this.viewer.entities.add(this.options);
          _this.dataSource.set(this.options.id, this.options);
          _this.dataSource1.add(this.options);
        };
        return _;
      })();
      this.drawHandler = new Cesium.ScreenSpaceEventHandler(
        _this.viewer.scene.canvas
      )
      var positions = [];
      var poly = undefined
      var startingPt = null
      //鼠标左键单击画点
      // debugger
      this.drawHandler.setInputAction(function(event) {
        var cartesian = _this.viewer.scene.pickPosition(event.position);
        if (positions.length == 0) {
          positions.push(cartesian.clone());
          startingPt = cartesian
        }
        positions.push(cartesian);
        if(positions.length > 2){
          positions.pop()
          _this.drawHandler.destroy()
          _this.drawHandler = null
          _this.hideTooltip()
        }    
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.drawHandler.setInputAction(function(event) {
        var cartesian = _this.viewer.scene.pickPosition(event.endPosition);
        if (positions.length >= 2) {
          if (!Cesium.defined(poly)) {
            poly = new PolyLinePrimitive(positions);
          } else {
            if (cartesian != undefined) {
              positions.pop();
              var cartographic = _this.viewer.scene.globe.ellipsoid.cartesianToCartographic(startingPt)
              var lat=Cesium.Math.toDegrees(cartographic.latitude)
              var lng=Cesium.Math.toDegrees(cartographic.longitude)
              var cartographic1 = _this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
              var newPoint = Cesium.Cartesian3.fromDegrees(lng,lat, cartographic1.height)
              positions.push(newPoint);
              var distance = _this.getSpaceDistance(positions);
              _this.showTooltip(event.endPosition, `${distance}米`)
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    clearHandler() {
      if (this.drawHandler) {
        this.drawHandler.destroy();
        this.drawHandler = null;
      }
    },
    removeEntities(dataSource) {
      for (let [key, value] of dataSource) {
        this.viewer.entities.removeById(key);
      }
    },
    showTooltip(position, text) {
      if(!tooltip){
        this.tooltip = $("#tooltip")[0]
      }
      tooltip.style.left = position.x + 10 + "px";
      tooltip.style.top = position.y + 20 + "px";
      tooltip.style.display = "block";
      tooltip.style.position = "absolute";
      tooltip.innerText = text;
    },
    hideTooltip() {
      if(!tooltip){
        this.tooltip = $("#tooltip")[0]
      }
      tooltip.style.display = "none";
    }
  }
};
</script>

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
</style>