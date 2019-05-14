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
        <div class="chart-wrapper">
          <map-chart :height="'634px'" @showDialog="showDialog" />          
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
    <el-dialog :visible="dialogVisible">
       <Project-Msg :projectMessage="projectMessage" />
    </el-dialog>
  </div>
</template>

<script>
  import BarChart from '../../dashboard/admin/components/BarChart.vue'
  import PieChart from '../../dashboard/admin/components/PieChart.vue'
  import RaddarChart from '../../dashboard/admin/components/RaddarChart.vue'
  import MapChart from './components/MapChart.vue'
  import PanelGroup from '../../dashboard/admin/components/PanelGroup'
  import ProjectMsg from "../../table/managerDataByDistrict/components/ProjectMsg/index.vue";

  export default {
    name: '',
    data() {
      return {
        dialogVisible: false,
        projectMessage: null
      }
    },
    components: {
      BarChart,
      PieChart,
      RaddarChart,
      MapChart,
      PanelGroup
    },
    methods:{
      showDialog(data){
        debugger
        alert("asd")
        this.dialogVisible = true
        this.projectMessage = data
      }
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

