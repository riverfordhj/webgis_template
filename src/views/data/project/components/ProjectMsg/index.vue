<!--
 * @Descripttion: 
 * @version: 
 * @Author: KanMing
 * @Date: 2019-09-29 10:41:27
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-29 16:52:32
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tooltip class="item" effect="dark" content="编辑工程信息" placement="top">
        <el-button
          v-permission="['spatialDataManager']"
          @click="openEditDialog"
          type="primary"
          size="small"
        >编辑</el-button>
      </el-tooltip>
    </div>
    <div class="projectMeg">
      <el-row>
        <el-col :span="4">
          <div class="grid-normal">工程名称</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.irrigationName}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-normal">工程所在地</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.city}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-normal">工程负责人</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.projectManager}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-normal">开始时间</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.startTime}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-normal">联系方式</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.phoneNumber}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-normal">完成时间</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.endTime}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-normal">坐标系统</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.coordinateSystem}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-normal">工程 ID</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.pid}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-normal">高程基准</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.elevationReference}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-normal">完成情况</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.status}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-normal">工程规模</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.scale}}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-normal">影像分辨率</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.imageResolution}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-normal">成图比例尺</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-normal">{{temp.mappingScale}}</div>
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
          <div class="grid-l">{{temp.participants}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-xl">工程概述</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-p">{{temp.summary}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-xl">工程成果</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-p">{{temp.outcome}}</div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="编辑工程信息" :visible.sync="dialogVisible" width="30%">
      <el-scrollbar :native="false" style="height:500px">
        <el-form
          ref="dataForm"
          :model="temp"
          label-position="left"
          label-width="90px"
          style="width: 400px; margin-left:50px;"
          size="medium"
        >
          <el-form-item label="工程名" prop="irrigationName">
            <el-input v-model="temp.irrigationName" placeholder="工程名称" />
          </el-form-item>
          <el-form-item label="省" prop="provinces">
            <el-input v-model="temp.provinces" placeholder="请输入省" />
          </el-form-item>
          <el-form-item label="市" prop="city">
            <el-input v-model="temp.city" placeholder="请输入市" />
          </el-form-item>
          <el-form-item label="县" prop="counties">
            <el-input v-model="temp.counties" placeholder="请输入县" />
          </el-form-item>
          <el-form-item label="镇" prop="townships">
            <el-input v-model="temp.townships" placeholder="请输入镇" />
          </el-form-item>
          <el-form-item label="面积" prop="area">
            <el-input v-model="temp.area" placeholder="请输入面积" />
          </el-form-item>
          <el-form-item label="水库容量" prop="volume">
            <el-input v-model="temp.volume" placeholder="请输入水库容量" />
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="temp.longitude" placeholder="请输入经度" />
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="temp.latitude" placeholder="请输入纬度" />
          </el-form-item>
          <el-form-item label="投资金额" prop="investmentAmount">
            <el-input v-model="temp.investmentAmount" placeholder="请输入投资金额" />
          </el-form-item>
          <el-form-item label="规模" prop="scale">
            <el-input v-model="temp.scale" placeholder="请输入规模" />
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="temp.startTime"
              style="width:100%"
              type="datetime"
              placeholder="请选择日期"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="temp.endTime"
              style="width:100%"
              type="datetime"
              placeholder="请选择日期"
            />
          </el-form-item>
          <el-form-item label="成果" prop="outcome">
            <el-input v-model="temp.outcome" placeholder="请输成果" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-input v-model="temp.status" placeholder="请输入状态" />
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="temp.createTime"
              style="width:100%"
              type="datetime"
              placeholder="请选择日期"
            />
          </el-form-item>
          <el-form-item label="创建人" prop="createUser">
            <el-input v-model="temp.createUser" placeholder="请输入创建人" />
          </el-form-item>
          <el-form-item label="地图比例尺" prop="mappingScale">
            <el-input v-model="temp.mappingScale" placeholder="请输地图比例尺" />
          </el-form-item>
          <el-form-item label="图像分辨率" prop="imageResolution">
            <el-input v-model="temp.imageResolution" placeholder="请输入图像分辨率" />
          </el-form-item>
          <el-form-item label="参与人员" prop="participants">
            <el-input v-model="temp.participants" placeholder="请输入参与人员" />
          </el-form-item>
          <el-form-item label="描述" prop="summary">
            <el-input v-model="temp.summary" placeholder="请输入描述信息" />
          </el-form-item>
          <el-form-item label="坐标系" prop="coordinateSystem">
            <el-input v-model="temp.coordinateSystem" placeholder="请输入坐标系" />
          </el-form-item>
          <el-form-item label="高程参考" prop="elevationReference">
            <el-input v-model="temp.elevationReference" placeholder="请输入高程参考" />
          </el-form-item>
          <el-form-item label="工程负责人" prop="projectManager">
            <el-input v-model="temp.projectManager" placeholder="请输入工程负责人" />
          </el-form-item>
          <el-form-item label="电话号码" prop="phoneNumber">
            <el-input v-model="temp.phoneNumber" placeholder="请输入电话号码" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import permission from "@/directive/permission/index.js";
import axios from 'axios'

export default {
  name: "",
  data() {
    return {
      temp: {
        irrigationName: null,
        irrigationID: null,
        provinces: null,
        city: null,
        counties: null,
        townships: null,
        area: null,
        volume: null,
        longitude: null,
        latitude: null,
        investmentAmount: null,
        id: null,
        scale: null,
        endTime: null,
        startTime: null,
        outcome: null,
        status: null,
        createTime: null,
        createUser: null,
        deleteMark: null,
        mappingScale: null,
        pid: null,
        participants: null,
        phoneNumber: null,
        summary: null,
        coordinateSystem: null,
        elevationReference: null,
        projectManager: null,
        imageResolution: null
      },
      dialogVisible: false
    };
  },
  directives: {
    permission
  },
  props: {
    projectMessage: Object
  },
  watch: {
    projectMessage(newVal) {
      this.temp = Object.assign(this.temp, newVal)
    }
  },
  methods: {
    openEditDialog() {
      this.dialogVisible = true
    },
    confirm() {
      var _this = this
      axios.post('http://172.16.7.50:8888/api/updatePrjName',
        this.temp
      ).then(res => {
        if (res.status !== 200) {
          alert('上传失败')
        } else {
          _this.$message({
            message: '上传成功',
            type: 'success'
          });
          _this.refresh()
        }
      }).catch((error) => {
        alert(error)
      });
    },
    refresh() {
      var _this = this
      axios.get('http://172.16.7.50:8888/api/irrigationInfor', {
        params: {
          userId: '省',
          name: '云南'
        }
      }).then(res => {
        var allPrjMsg = res.data.data
        _this.temp = allPrjMsg.filter(prj => {
          return prj.irrigationName === _this.temp.irrigationName
        })[0]
      }).catch((error) => {
        alert(error)
      });
    },
  }
};
</script>

<style scoped>
.projectMeg {
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
  min-height: 170px;
  border: 1px solid #ebeef5;
  text-align: center;
  line-height: 150px;
}

.grid-p {
  text-indent: 2em;
  padding: 1em;
  line-height: 2;
  border: 1px solid #ebeef5;
  min-height: 170px;
}
</style>