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
import yunnan_pt from "@/assets/json/yunnan_pt.json";
import tonghai from "@/assets/json/tonghai.json";

import { getRelatedDataByName } from "@/api/project.js"

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
      default: "100%"
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

    const sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    // sidebarElm.addEventListener('transitionend', this.__resizeHandler)
    sidebarElm.addEventListener("transitionend", this.sidebarResizeHandler);
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
      if (e.propertyName === "width") {
        this.__resizeHandler();
      }
    },
    initChart() {
      console.log(yunnan_pt);
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
        title: {
          text: "云南市地图",
          left: "center",
          textStyle: {
            fontWeight: "bold",
            fontSize: 25,
            color: "black"
          }
        },
        // backgroundColor: "#87CEEB",
        geo: {
          // 这个是重点配置区
          map: "云南", // 表示中国地图
          roam: true,
          // label: {
          //   normal: {
          //     show: true, // 是否显示对应地名
          //     textStyle: {
          //       // color: "rgba(255,255,255,1)"
          //       color: "#333", //文字颜色
          //       fontStyle: "normal", //italic斜体  oblique倾斜
          //       fontWeight: "normal", //文字粗细bold   bolder   lighter  100 | 200 | 300 | 400...
          //       fontFamily: "sans-serif", //字体系列
          //       fontSize: 18 //字体大小
          //     }
          //   }
          // },
          itemStyle: {
            normal: {
              // color: "#BFEFFF", //颜色
              borderColor: "#000", //边框颜色
              borderWidth: 0, //柱条的描边宽度，默认不描边。
              // borderType:"solid",         //柱条的描边类型，默认为实线，支持 'dashed', 'dotted'。
              barBorderRadius: 25, //柱形边框圆角半径，单位px，支持传入数组分别指定柱形4个圆角半径。
              shadowBlur: 3, //图形阴影的模糊大小。
              shadowColor: "#000", //阴影颜色
              // shadowOffsetX:0,            //阴影水平方向上的偏移距离。
              // shadowOffsetY:0,            //阴影垂直方向上的偏移距离。
              opacity: 1
            }
            // emphasis: {
            // color: "#ADFF2F", //颜色
            // borderColor: "#000", //边框颜色
            // borderWidth: 0, //柱条的描边宽度，默认不描边。
            // borderType: "solid", //柱条的描边类型，默认为实线，支持 'dashed', 'dotted'。
            // barBorderRadius: 0, //柱形边框圆角半径，单位px，支持传入数组分别指定柱形4个圆角半径。
            // shadowBlur: 10, //图形阴影的模糊大小。
            // shadowColor: "#000", //阴影颜色
            // shadowOffsetX: 0, //阴影水平方向上的偏移距离。
            // shadowOffsetY: 0, //阴影垂直方向上的偏移距离。
            // opacity: 1
            // }
          },
          emphasis: {
            label: {
              show: false
            }
          }
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo",
            data: this.covertData(tonghai),
            symbolSize: function(val) {
              return val[2] * 2;
            },
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: "#6495ED",
                shadowBlur: 10,
                shadowColor: "#333"
              }
            }
          }
        ]
      });

      var self = this;
      this.chart.on("click", function(params) {
        if(params.componentType === "series"){
          // self.$notify({
          //   title: "响应",
          //   message: `值为${params.data.name}`,
          //   type: "success",
          //   duration: 2000
          // });
          getRelatedDataByName(params.data.name).then(res => {
            self.$emit("showDialog", res.data)
          })
        }      
      });

    },
    covertData(json) {
      let res = [];
      json.features.map(data => {
        res.push({
          name: data.properties.name,
          value: data.geometry.coordinates.concat(data.properties.test)
        });
      });
      return res;
    }
  }
};
</script>
