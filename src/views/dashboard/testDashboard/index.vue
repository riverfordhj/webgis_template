<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32"  style="height:700px">
      <el-col :xs="0" :sm="6" :md="6" :lg="6" style="height:100%">
        <div class="chart-wrapper" style="height:100%">
          <bar-chart :height="'50%'"/>   
          <Pie-chart :height="'50%'"/>       
        </div> 
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" style="height:100%">
        <div class="chart-wrapper" style="height:100%">
          <map-chart @showDialog="showDialog"/>          
        </div>
      </el-col>
      <el-col :xs="0" :sm="6" :md="6" :lg="6" style="height:100%">
        <div class="chart-wrapper" style="height:100%">
          <Raddar-chart :height="'50%'"/>      
          <bar-chart :height="'50%'"/>      
        </div>  
      </el-col>
    </el-row>
    <panel-group />
    <el-dialog :visible.sync = "dialogVisible">
       <Project-Msg :projectMessage="projectMessage" />
    </el-dialog>
  </div>
</template>

<script>
import BarChart from "../../dashboard/admin/components/BarChart.vue";
import PieChart from "../../dashboard/admin/components/PieChart.vue";
import RaddarChart from "../../dashboard/admin/components/RaddarChart.vue";
import MapChart from "./components/MapChart.vue";
import PanelGroup from "../../dashboard/admin/components/PanelGroup";
import ProjectMsg from "../../table/managerDataByDistrict/components/ProjectMsg/index.vue";


export default {
  name: "",
  data() {
    return {
      dialogVisible: false,
      projectMessage: null
    };
  },
  components: {
    BarChart,
    PieChart,
    RaddarChart,
    MapChart,
    PanelGroup,
    ProjectMsg
  },
  methods:{
    showDialog(data){
      this.dialogVisible = true
      this.projectMessage = data
    }
  }
};
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

