<!--
 * @Descripttion: 1
 * @version: 1
 * @Author: KanMing
 * @Date: 2019-09-26 14:39:22
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-29 15:57:22
 -->
<template>
  <div>
    <el-container class="container">
      <el-aside class="aside" width="250px">
        <el-scrollbar class="name-container">
          <div style="padding:20px">
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              :render-content="renderContent"
              @node-click="nodeClick"
            ></el-tree>
          </div>
        </el-scrollbar>
      </el-aside>
      <el-main class="main" v-loading="mainLoading">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="空间数据" name="first">
            <Spatial-Data :spatialData="spatialData" :procjectName="procjectName" />
          </el-tab-pane>
          <el-tab-pane label="文本数据" name="second">
            <Text-Data :procjectName="procjectName" />
          </el-tab-pane>
          <!-- <el-tab-pane label="原始数据" name="third">原始数据</el-tab-pane> -->
          <el-tab-pane label="项目描述" name="fourth">
            <Project-Msg :projectMessage="projectMessage" />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'
import store from "@/store"
import SpatialData from "./components/SpatialData/index.vue";
import ProjectMsg from "./components/ProjectMsg/index.vue";
import TextData from "./components/TextData/index1.vue";

export default {
  name: '',
  components: {
    SpatialData,
    TextData,
    ProjectMsg
  },
  data() {
    return {
      roles: [],
      activeName: 'first',
      mainLoading: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      spatialData: [],
      procjectName: '',
      projectMessage: {},
      allPrjMsg: []
    }
  },
  mounted() {
    this.roles = store.getters.roles
    this.getProject()
  },
  methods: {
    getProject() {
      var _this = this
      axios.get('http://172.16.7.50:8888/api/irrigationInfor', {
        params: {
          userId: '省',
          name: '云南'
        }
      }).then(res => {
        _this.initTreeData(res.data.data)
        _this.allPrjMsg = res.data.data
      }).catch((error) => {
        alert(error)
      });
    },
    initTreeData(data) {
      // console.log(data)
      var cityArr = []
      data.map(project => {
        // debugger
        if (cityArr.indexOf(project.city) === -1) {
          cityArr.push(project.city)
          this.treeData.push({
            label: project.city,
            children: []
          })
        }
      })
      this.treeData.map(fatherLeaf => {
        data.map(project => {
          if (project.city === fatherLeaf.label) {
            fatherLeaf.children.push({
              label: project.irrigationName,
            })
          }
        })
      })

      console.log(this.treeData)
    },
    renderContent(h, { node, data }) {
      if (node.level === 1) {
        return (
          <span class="custom-tree-node">
            <span>
              <svg-icon style="margin-right:8px" icon-class="city" />
              <span>{node.label}</span>
            </span>
          </span>
        )
      }
      if (this.roles.includes("admin") || this.roles.includes("spatialDataManager")) {
        if (node.level === 2) {
          return (
            <span class="custom-tree-node">
              <span>
                <svg-icon style="margin-right:8px" icon-class="project" />
                <span>{node.label}</span>
              </span>
              <span>
                <el-button size="mini" type="text" on-click={(event) => { this.remove(node, data, event) }}>删除</el-button>
              </span>
            </span>
          );
        }
      } else {
        if (node.level === 2) {
          return (
            <span class="custom-tree-node">
              <span>
                <svg-icon style="margin-right:8px" icon-class="project" />
                <span>{node.label}</span>
              </span>
            </span>
          );
        }
      }

    },
    nodeClick(data, node) {
      var _this = this
      if (node.level === 2) {
        this.mainLoading = true
        axios.get('http://172.16.7.50:8888/api/getLayer', {
          params: {
            Pname: data.label,
            Ptype: ''
          }        }).then(res => {
          _this.procjectName = data.label
          _this.spatialData = res.data.data
          _this.projectMessage = _this.allPrjMsg.filter(prj => {
            return prj.irrigationName === data.label
          })[0]
          _this.mainLoading = false

        }).catch((error) => {
          alert(error)
        });
      }
    },
    remove(node, data, event) {
      event.stopPropagation()
      var _this = this
      axios.post('http://172.16.7.50:8888/api/deletePrjName', {
        irrigationName: node.label
      }).then(res => {
        if (res.status !== 200) {
          alert('操作失败')
        } else {
          _this.$message({
            message: '操作成功',
            type: 'success'
          });
          _this.$refs["tree"].remove(node, data)
        }
      }).catch(err => {
        alert(err)
      })
      // deleteProjectByName(data.label).then(res => {
      //   // console.log(res);
      //   this.$refs["tree"].remove(node, data)
      //   this.spatialData = []
      //   this.projectMessage = {}
      // })
    }
  }
}
</script>

<style >
.el-scrollbar__wrap {
  overflow-x: hidden;
}

.container {
  width: 100%;
  height: calc(100vh - 50px);
}

.name-container {
  /* margin-top: 20px; */
  width: 100%;
  height: 100%;

  /* padding-top: 10px; */
}

.aside {
  /* background: white; */
  text-align: center;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  width: 100%;
}
</style>