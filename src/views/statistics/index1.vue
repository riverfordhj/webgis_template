<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag>当前所有项目</el-tag>
      <!-- <el-switch v-model="range" active-text="单个项目" inactive-text="所有项目"></el-switch>
      <div v-if="range" style="margin-left:10px;display:inline">
        <el-select v-model="value" placeholder="请选择" :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>-->
    </div>
    <Pivottable :pivotData="value" class="pivot-table" />
  </div>
</template>

<script>
import Pivottable from "../../components/Pivottable/index";
import axios from "axios";
import { getAllProject } from "@/api/project.js";
export default {
  name: "",
  components: {
    Pivottable
  },
  data() {
    return {
      options: [],
      value: "",
      range: true,
      loading: true
    };
  },
  watch: {
    // range(val){
    //   if(val === false){
    //     this.getProjects()
    //   }else{
    //     this.value = ""
    //   }
    // }
  },
  mounted() {
    // var self = this;
    this.getProjects();
  },
  methods: {
    getProjects() {
      var _this = this;

      axios
        .get("http://172.16.7.50:8888/api/irrigationInfor", {
          params: {
            userId: "省",
            name: "云南"
          }
        })
        .then(res => {
          let str = JSON.stringify(res.data.data);
          let enHeader = [
            'area',
            'city',
            'counties',
            'investmentAmount',
            'irrigationID',
            'irrigationName',
            'latitude',
            'longitude',
            'provinces',
            'summary',
            'townships',
            'volume'
          ];
          let cnHeader = [
            '面积',
            '城市',
            '县',
            '投资（亿）',
            'id号',
            '工程名',
            '维度',
            '经度',
            '省',
            '标签',
            '乡',
            '库容量(立方米)'
          ];
          // str = str.replace(enHeader[0],cnHeader[0])
          //   console.log(str)

          enHeader.map((en, i) => {
            // debugger
            var reg = "/"+en+"/g";
            str = str.replace(eval(reg),cnHeader[i])
            console.log(str)

          })
          // debugger
          _this.value = str;
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>

<style lang="" scoped>
</style>