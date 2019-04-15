<template>
  <!-- <div class="app-container"> -->
    <el-container class="container">
      <el-aside class="aside">
        <div style="margin-bottom:20px">
          <el-select style="margin-top:20px;width:80%" v-model="value" placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </div>
        
        
          <el-scrollbar :native="false" class="name-container">
            <transition-group name="fade">
            <template v-for="item in num">
              <el-button @click="confirmName(item)" class="name" :key="item" type="primary" style="width:80%" plain>项目名称{{item}}</el-button>
            </template>
            <!-- <el-button class="name" type="primary" style="width:80%">test</el-button> -->
            </transition-group>
          </el-scrollbar >  
        
         
      </el-aside>
      <el-main class="main">
        <el-tabs type="border-card">
        <el-tab-pane label="空间数据" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="文本数据" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="原始数据" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="项目描述" name="fourth">
          <div id="projectMeg">
            <el-row>
              <el-col :span="4">
                <div class="grid-normal">项目名称</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
                </el-col>
              <el-col :span="4">
                <div class="grid-normal">项目所在地</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="grid-normal">项目负责人</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
                </el-col>
              <el-col :span="4">
                <div class="grid-normal">开始时间</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
              </el-col>    
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="grid-normal">联系方式</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
                </el-col>
              <el-col :span="4">
                <div class="grid-normal">完成时间</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
              </el-col>    
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="grid-normal">坐标系统</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
                </el-col>
              <el-col :span="4">
                <div class="grid-normal">项目 ID</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
              </el-col>    
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="grid-normal">高程基准</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
                </el-col>
              <el-col :span="4">
                <div class="grid-normal">完成情况</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
              </el-col>    
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="grid-normal">工程规模</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
                </el-col>
              <el-col :span="4">
                <div class="grid-normal">影像分辨率</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
              </el-col>    
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="grid-normal">成图比例尺</div>
                </el-col>
              <el-col :span="8">
                <div class="grid-normal"></div>
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
                <div class="grid-l"></div>
              </el-col>  
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="grid-xl">项目概述</div>
              </el-col>
              <el-col :span="20">
                <div class="grid-xl"></div>
              </el-col>  
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="grid-xl">项目成果</div>
              </el-col>
              <el-col :span="20">
                <div class="grid-xl"></div>
              </el-col>  
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
      </el-main>
    </el-container>
  <!-- </div> -->
</template>

<script>
export default {
  name: "",
  data() {
    return {
      options: [
        {
          value: "1",
          label: "昆明市"
        },
        {
          value: "2",
          label: "玉溪市"
        },
        {
          value: "25",
          label: "雄楚市"
        }
      ],
      value: "",
      num: 5
    };
  },
  watch: {
    value(val) {
      this.num = +val;
    }
  },
  methods: {
    confirmName(name) {
      console.log(name);
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 50px);
}

.aside {
  background: whitesmoke;
  text-align: center;
  overflow: hidden;
}

.main {
  /* background: whitesmoke */
}

.name-container {
  /* margin-top: 20px; */
  width: 100%;
  height: 100%;
  padding-top: 10px;
}
.name {
  width: 80%;
  height: 40px;
  margin-bottom: 8px;
  margin-top: 4px;
  box-shadow: 0 0 5px gray;
  margin-left: auto;
  margin-right: auto;
  /* line-height: 40px */
}

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>