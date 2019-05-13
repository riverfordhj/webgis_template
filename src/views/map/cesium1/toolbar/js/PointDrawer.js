import Cesium from "cesium/Cesium";

export class PointDraw {
  constructor(viewer) {
    this.viewer = viewer
    this.scene = viewer.scene
    this.clock = viewer.clock
    this.canvas = viewer.scene.canvas
    this.camera = viewer.scene.camera
    this.drawHandler = null
    // this.modifyHandler = null
    this.okHandler = null
    this.cancelHandler = null
    this.position = null
    this.entity = null
  }
  clear() {
    if (this.drawHandler) {
      this.drawHandler.destroy()
      this.drawHandler = null
    }
  }
  startDrawPoint (okHandler, cancelHandler) {
    this.okHandler = okHandler
    this.cancelHandler = cancelHandler
    this.drawHandler = new Cesium.ScreenSpaceEventHandler(this.canvas)

    this.drawHandler.setInputAction( event => {
      var wp = event.position
      // if (!Cesium.defined(wp)) {
      //   return;
      // }
      // if (this.position == null) {
      //     this.tooltip.showAt(wp, "<p>选择位置</p>");
      // }
      if (this.scene.mode !== Cesium.SceneMode.MORPHING) {
        //获取地形或模型对应的cartesian3
        var cartesian = this.scene.pickPosition(wp);
        if (!Cesium.defined(cartesian)) {
          return
        }
        this.position = cartesian
        this.entity.position.setValue(cartesian)
        
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.drawHandler.setInputAction( event => {
      var wp = event.endPosition;
      if (!Cesium.defined(wp)) {
        return;
      }
      if (this.scene.mode !== Cesium.SceneMode.MORPHING) {
        //获取地形或模型对应的cartesian3
        var cartesian = this.scene.pickPosition(wp);
        if (!Cesium.defined(cartesian)) {
          return
        }
        this.position = cartesian;
        if (this.entity == null) {
          this._createPoint();
        } else {
            this.entity.position.setValue(cartesian);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
  _creatPoint() {
    this.entity = new Cesium.Entity({
      position : this.position,
      name : 'point',
      point:{
        color: Cesium.Color.RED,
        pixelSize: 10,
        outlineColor: Cesium.Color.BLACK,
      }
    });
    this.viewer.entities.add(this.entity);
  }
}