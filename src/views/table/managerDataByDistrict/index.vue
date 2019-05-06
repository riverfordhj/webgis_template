<template>
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
          </transition-group>
        </el-scrollbar >  
                 
      </el-aside>

      <el-main class="main">
        <el-tabs type="border-card">
          <el-tab-pane label="空间数据" name="first">
            <Spatial-Data />
          </el-tab-pane>
          <el-tab-pane label="文本数据" name="second">
            <Text-Data />
          </el-tab-pane>
          <el-tab-pane label="原始数据" name="third">原始数据</el-tab-pane>
          <el-tab-pane label="项目描述" name="fourth">
            <Project-Msg />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
</template>

<script>
import ProjectMsg from "./components/ProjectMsg/index.vue";
import SpatialData from "./components/SpatialData/index.vue";
import TextData from "./components/TextData/index.vue";

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
      num: null
    };
  },
  components: {
    ProjectMsg,
    SpatialData,
    TextData
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>