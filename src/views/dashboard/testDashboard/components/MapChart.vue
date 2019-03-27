<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
// import "../../../../../node_modules/echarts/map/js/china.js";
import "../../../../../node_modules/echarts/map/js/province/yunnan.js";
import json from "../../../../../node_modules/echarts/map/json/province/yunnan.json";

const animationDuration = 6000;

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    // sidebarElm.addEventListener('transitionend', this.__resizeHandler)
    sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    initChart() {
      // echarts.registerMap("yunnan", json);
      this.chart = echarts.init(this.$el, "macarons");
      // this.chart.setOption({
      //   geo: {
      //     map: "yunnan",
      //     label: {
      //       emphasis: {
      //         show: true
      //       }
      //     },
      //     itemStyle: {
      //       normal: {
      //         areaColor: "#323c48",
      //         borderColor: "#111"
      //       },
      //       emphasis: {
      //         areaColor: "#2a333d"
      //       }
      //     }
      //   },
      //   series: [
      //     {
      //       type: "map",
      //       map: "yunnan"
      //     }
      //   ]
      // });

      this.chart.setOption({
        backgroundColor: "#FFFAF0",
        geo: {
          // 这个是重点配置区
          map: "云南", // 表示中国地图
          roam: true,
          label: {
            normal: {
              show: false, // 是否显示对应地名
              textStyle: {
                color: "rgba(255,255,255,1)"
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: "rgba(124, 205, 124, 0.8)",
              borderColor: "rgba(255,255,255,0.5)"
            },
            emphasis: {
              areaColor: "#CAFF70"
            }
          }
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo" // 对应上方配置
          }
        ]
      });
    }
  }
};
</script>
