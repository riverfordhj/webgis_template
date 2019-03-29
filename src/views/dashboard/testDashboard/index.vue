<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="0" :sm="6" :md="6" :lg="6">
        <div class="chart-wrapper">
          <bar-chart />          
        </div>
        <br>
        <div class="chart-wrapper">
          <Pie-chart />          
        </div>    
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12">
        <div style="background-color:#87CEEB" class="chart-wrapper">
          <map-chart :height="'634px'" />          
        </div>
      </el-col>
      <el-col :xs="0" :sm="6" :md="6" :lg="6">
        <div class="chart-wrapper">
          <Raddar-chart />          
        </div> 
        <br>
        <div class="chart-wrapper">
          <bar-chart />          
        </div>   
      </el-col>
    </el-row>
    <panel-group />
  </div>
</template>

<script>
  import BarChart from '../../dashboard/admin/components/BarChart.vue'
  import PieChart from '../../dashboard/admin/components/PieChart.vue'
  import RaddarChart from '../../dashboard/admin/components/RaddarChart.vue'
  import MapChart from './components/MapChart.vue'
  import PanelGroup from '../../dashboard/admin/components/PanelGroup'

  export default {
    name: '',
    data() {
      return {
        
      }
    },
    components: {
      BarChart,
      PieChart,
      RaddarChart,
      MapChart,
      PanelGroup
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    // background-color: rgb(10, 38, 80);
    .chart-wrapper {
      background: #fff;
      // background: rgb(6, 2, 48);
      padding: 16px 16px 0;
      // margin-bottom: 32px;
    }
  }
</style>

<style scoped>
 .grid-a-contentWidth {    
    background-color: rgb(44, 143, 121);
    border-radius: 4px;
    min-height: 300px;
  }
  .grid-a-content-a-Width {    
    background-color: rgb(44, 143, 121);
    border-radius: 4px;
    min-height: 620px;
  }
</style>

