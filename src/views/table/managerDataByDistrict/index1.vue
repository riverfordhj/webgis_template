<template>
  <div>
    <el-container class="container">
      <el-aside class="aside"  width="250px">        
        <el-scrollbar class="name-container">
          <div style="padding:20px">         
            <el-tree 
              ref="tree"
              :data="treeData" 
              :props="defaultProps"
              :load="loadNode" 
              lazy=""
              @node-click="nodeClick"
              :render-content="renderContent"
              >
              <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
                <template v-if="node.level == true">
                  <span>
                    <svg-icon style="margin-right:8px" icon-class="city" />
                    <span>{{node.label}}</span>
                  </span>
                </template>
                <template v-else>
                  <span>
                    <svg-icon style="margin-right:8px" icon-class="project" />
                    <span>{{node.label}}</span>
                  </span>           
                  <span>
                    <el-button
                    type="text"
                    size="mini"
                    @click.stop="() => remove(node, data)">
                    删除
                  </el-button>
                  </span>
                </template>     
              </span> -->
            </el-tree>       
          </div>
        </el-scrollbar >            
      </el-aside>
      <el-main class="main" v-loading="mainLoading">
        <el-tabs type="border-card">
          <el-tab-pane label="空间数据" name="first">
            <Spatial-Data :spatialData="spatialData" :procjectName="procjectName" />
          </el-tab-pane>
          <el-tab-pane label="文本数据" name="second">
            <Text-Data />
          </el-tab-pane>
          <el-tab-pane label="原始数据" name="third">原始数据</el-tab-pane>
          <el-tab-pane label="项目描述" name="fourth">
            <Project-Msg :projectMessage="projectMessage" />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>    
  </div>   
</template>

<script>
import { getAllProject, GetProjectByName, getRelatedDataByName, deleteProjectByName } from "@/api/project.js"
import ProjectMsg from "./components/ProjectMsg/index.vue";
import SpatialData from "./components/SpatialData/index1.vue";
import TextData from "./components/TextData/index.vue";

export default {
  name: "",
  data() {
    return {
      projectMessage: {},
      spatialData: [],
      procjectName: "",
      mainLoading: false,
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: 'leaf'
      },
      treeData: [
        {
          label: "昆明市",
          className: "city",
        },
        {
          label: "楚雄市",
          className: "city",
        },
        {
          label: "昭通市",
          className: "city",
        },
        {
          label: "曲靖市",
          className: "city",
        },
        {
          label: "玉溪市",
          className: "city",
        },
        {
          label: "大理市",
          className: "city",
        },
        {
          label: "丽江市",
          className: "city",
        },
        {
          label: "保山市",
          className: "city",
        },
        {
          label: "临沧市",
          className: "city",
        },
        {
          label: "普洱市",
          className: "city",
        },
        {
          label: "迪庆州",
          className: "city",
        },
        {
          label: "怒江州",
          className: "city",
        },
        {
          label: "德宏州",
          className: "city",
        },
        {
          label: "红河州",
          className: "city",
        },
        {
          label: "文山州",
          className: "city",
        },
        {
          label: "西双版纳",
          className: "city",
        },
      ]
    };
  },
  components: {
    ProjectMsg,
    SpatialData,
    TextData
  },
  created(){
    
  },
  methods: {
    renderContent(h, { node, data, store }) {
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
      if (node.level === 2) {
        return (
          <span class="custom-tree-node">
            <span>
              <svg-icon style="margin-right:8px" icon-class="project" />
              <span>{node.label}</span>
            </span>           
            <span>
              <el-button size="mini" type="text" on-click={ (event) => {this.remove(node, data, event)}}>删除</el-button>
            </span>
          </span>         
        );        
      }   
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData)
      }

      if (node.level > 1) return resolve([])

      if(node.level === 1) { // 二级节点
        this.getChildrenNode(node,resolve)
      }
    },
    getChildrenNode(node, resolve) {
      GetProjectByName(node.data.label).then(res => {
        // console.log(res.data)
        resolve(res.data)

      })
    },
    nodeClick(data, node, component) {
      if (node.level === 2) {
        this.mainLoading = true
        getRelatedDataByName(node.data.label).then(res => {
          // console.log(res.data)
          this.projectMessage = res.data
          this.spatialData = res.data.SpatialData
          this.procjectName = res.data.Name       
          this.mainLoading = false
          
        })
      }
    },
    remove(node, data, event) {
      event.stopPropagation()  
      deleteProjectByName(data.label).then(res => {
        // console.log(res);
        this.$refs["tree"].remove(node, data)
        this.spatialData = []
        this.projectMessage = {}
      })
    }
  }
};
</script>

<style>
/* .tree-icon {
  display: inline-block;
}
.child-class {
}
.group-class {
} */
/* .svg-icon{
  margin-right: 8px
} */

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
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  
}

.main {
  /* background: whitesmoke */
}

.custom-tree-node {
  flex: 1;
  display: flex; 
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  width: 100%
}
</style>