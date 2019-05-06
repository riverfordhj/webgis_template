<template>
  <div id="projectMeg" >
    <el-row>
      <el-col :span="4">
        <div class="grid-normal">项目名称</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.Name}}</div>
        </el-col>
      <el-col :span="4">
        <div class="grid-normal">项目所在地</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.Location}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-normal">项目负责人</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.ProjectManager}}</div>
        </el-col>
      <el-col :span="4">
        <div class="grid-normal">开始时间</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.StartTime}}</div>
      </el-col>    
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-normal">联系方式</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.PhoneNumber}}</div>
        </el-col>
      <el-col :span="4">
        <div class="grid-normal">完成时间</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.EndTime}}</div>
      </el-col>    
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-normal">坐标系统</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.CoordinateSystem}}</div>
        </el-col>
      <el-col :span="4">
        <div class="grid-normal">项目 ID</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.PID}}</div>
      </el-col>    
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-normal">高程基准</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.ElevationReference}}</div>
        </el-col>
      <el-col :span="4">
        <div class="grid-normal">完成情况</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.Status}}</div>
      </el-col>    
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-normal">工程规模</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.Scale}}</div>
        </el-col>
      <el-col :span="4">
        <div class="grid-normal">影像分辨率</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.ImageResolution}}</div>
      </el-col>    
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-normal">成图比例尺</div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal">{{projectMessage.MappingScale}}</div>
        </el-col>
      <el-col :span="4">
        <div class="grid-normal"></div>
        </el-col>
      <el-col :span="8">
        <div class="grid-normal"></div>
      </el-col>    
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-l">参与人员</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-l">{{projectMessage.Participants}}</div>
      </el-col>  
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-xl">项目概述</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-xl">{{projectMessage.Description}}</div>
      </el-col>  
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-xl">项目成果</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-xl">{{projectMessage.Outcome}}</div>
      </el-col>  
    </el-row>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // this.pro
    };
  },
  props: {
    projectMessage: Object
  }
};
</script>

<style scoped>
#projectMeg {
  /* border: solid black */
  font-size: 14px;
  color: #606266;
}

.grid-normal {
  min-height: 40px;
  border: 1px solid #ebeef5;
  text-align: center;
  line-height: 35px;
}

.grid-l {
  min-height: 70px;
  border: 1px solid #ebeef5;
  text-align: center;
  line-height: 65px;
}

.grid-xl {
  min-height: 160px;
  border: 1px solid #ebeef5;
  text-align: center;
  line-height: 150px;
}
</style>