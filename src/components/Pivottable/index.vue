<template>
  <div>
    <div id="area" ></div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import jqueryui from 'jqueryui'
  import pivottable from 'pivottable';
  import "pivottable/dist/pivot.min.css";
  import "pivottable/dist/plotly_renderers.min.js"
  import "pivottable/dist/pivot.zh.js"

  export default {
    name: '',
    props: {
      pivotData: {
        type: String,
        default: ''
      } 
    },
    watch: {
      pivotData(newVal) {
        var dataArr = JSON.parse(newVal)
        if(dataArr.length) {
          this.initPivot(dataArr)
        }
      }
    },
    data() {
      return {
        
      }
    },
    methods: {
      initPivot(val) {
        var derivers = $.pivotUtilities.derivers;
        var renderers = $.extend($.pivotUtilities.renderers,
            $.pivotUtilities.plotly_renderers);
        $("#area").pivotUI(     
          val,{
            cols:['type'],
            // vals:this.ploty_params.vals,
            // rows:this.ploty_params.rows,
            rendererName:'柱形图',
            renderers: $.pivotUtilities.locales.zh.renderers,
            aggregators:$.pivotUtilities.locales.zh.aggregators,
            aggregatorName:"频数",
            localeStrings:$.pivotUtilities.locales.zh.localeStrings,
            unusedAttrsVertical:false
          }
        );
      }
    }
  }
</script>

<style scoped>
  
</style>