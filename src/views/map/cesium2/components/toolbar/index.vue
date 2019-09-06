<template>
  <div class="toolbar">
    <hsc-menu-style-white>
      <hsc-menu-bar style="border-radius: 0 0 4pt 0;">
        <hsc-menu-bar-item label="基础">
          <!-- <hsc-menu-item label="图层管理" @click="openLayerTreePanel" /> -->
        </hsc-menu-bar-item>
        <hsc-menu-bar-item label="绘制">
          <!-- <hsc-menu-separator/> -->
          <!-- <hsc-menu-item label="绘制点" @click="drawPointEvent" />
          <hsc-menu-item label="绘制线" @click="drawPolylineEvent" />
          <hsc-menu-item label="绘制面" @click="drawPolygonEvent" />
          <hsc-menu-item label="移除绘制" @click="removeEntities(dataSource)" />
          <hsc-menu-item label="保存">
            <hsc-menu-item label="geoJson" @click="saveAsJson" />
            <hsc-menu-item label="kml" @click="saveAsKml" />
          </hsc-menu-item>-->
        </hsc-menu-bar-item>
        <hsc-menu-bar-item label="测量">
          <hsc-menu-item label="测量长度" @click="test" />
          <!-- <hsc-menu-item label="测量长度" @click="measurePolylineEvent" /> -->
          <!-- <hsc-menu-item label="测量面积" @click="measurePolygonEvent" />
          <hsc-menu-item label="测量高度" @click="measureHeightEvent" />
          <hsc-menu-item label="移除测量" @click="removeEntities(measureSource)" />-->
        </hsc-menu-bar-item>
      </hsc-menu-bar>
    </hsc-menu-style-white>
    <!-- <property-dialog @setProperty="setProperty" :visible="propertyDialogVisible" /> -->
  </div>
</template>

<script>
import viewer from '../../cesium'
export default {
  name: '',
  data() {
    return {

    }
  },
  mounted() {
    console.log(viewer)
  },
  methods: {
    test() {
      console.log(viewer)

    }
  }
}
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