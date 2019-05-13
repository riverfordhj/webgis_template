import PointDrawer from "./PointDrawer"

export class Traker {
  constructor(viewer) {
    this.viwer = viewer
    this.ctrArr = []
    this.pointDrawer = null
    this.polylineDrawer = null
    this.polygonDrawer = null
    this.circleDrawer = null
    this.rectDrawer = null
    this.posMeasure = null
    this.disMeasure = null
    this.areaMeasure = null

    this.pointDrawer = new PointDrawer(this.viewer)
    this.ctrArr.push(this.pointDrawer)
  }
  clear() {
    for (var i = 0; i < this.ctrArr.length; i++) {
        try {
            var ctr = this.ctrArr[i];
            if (ctr.clear) {
                ctr.clear();
            }
        } catch (err) {
            console.log("发生未知出错：GlobeTracker.clear");
        }
    }
  }
  trackPoint (okHandler, cancelHandler) {
    this.clear();
    if (this.pointDrawer == null) {
        this.pointDrawer = new PointDrawer(this.viewer);
        this.ctrArr.push(this.pointDrawer);
    }
    this.pointDrawer.startDrawPoint(okHandler, cancelHandler);
  }
}
