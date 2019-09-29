<!--
 * @Descripttion: 
 * @version: 
 * @Author: KanMing
 * @Date: 2019-09-26 15:33:26
 * @LastEditors: KanMing
 * @LastEditTime: 2019-09-29 10:26:50
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tooltip class="item" effect="dark" content="填写表单添加数据" placement="top">
        <el-button
          v-permission="['spatialDataManager']"
          type="primary"
          size="small"
          @click="handleAdd"
        >添加数据</el-button>
      </el-tooltip>
      <el-tooltip
        v-permission="['spatialDataManager']"
        class="item"
        effect="dark"
        content="删除选中数据"
        placement="top"
      >
        <!-- <el-button type="danger" size="small" @click="handleDelete">删除数据</el-button> -->
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="添加选中数据到地图" placement="top">
        <el-button type="primary" size="small" @click="addDataToStore">加载到地图</el-button>
      </el-tooltip>
      <el-input
        v-model="search"
        style="width: 200px;float:right;"
        size="small"
        placeholder="请输入需查询字段"
      />
    </div>
    <div style="width:100%">
      <el-table
        v-loading="listLoading"
        :data="datas"
        border
        style="width:100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed="left" prop="layerName" width="150" label="名称" align="center"></el-table-column>
        <el-table-column prop="irrigationName" width="100" label="工程名" align="center"></el-table-column>
        <el-table-column prop="elementData" width="100" label="元数据" align="center"></el-table-column>
        <el-table-column prop="type" width="200" label="类型" align="center"></el-table-column>
        <el-table-column prop="format" width="100" label="格式" align="center"></el-table-column>
        <el-table-column prop="data" width="200" label="日期" align="center"></el-table-column>
        <el-table-column prop="aliasesName" width="200" label="别名" align="center"></el-table-column>
        <el-table-column prop="height" width="100" label="水深高度" align="center"></el-table-column>
        <el-table-column prop="load" width="100" label="加载" align="center"></el-table-column>
        <el-table-column prop="status" width="100" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '有效' ? 'success' : scope.row.status === '过期' ? 'primary' : 'danger'"
              disable-transitions
            >{{scope.row.status}}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="download" label="下载">
          <template slot-scope="scope">
            <el-dropdown @command="showPicture(scope.row)" >
              <span class="el-dropdown-link">
              download<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">word</el-dropdown-item>
                <el-dropdown-item command="b">PDF</el-dropdown-item>
                <el-dropdown-item command="c">Excel</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>-->
        <el-table-column prop="position" width="150" label="地理位置" align="center"></el-table-column>
        <el-table-column prop="url" width="500" label="服务地址 / id" align="center"></el-table-column>
        <el-table-column prop="person" width="100" label="保存人员" align="center"></el-table-column>
        <el-table-column prop="phone" width="150" label="电话" align="center"></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="120"
          fixed="right"
          class-name="small-padding fixed-width"
          v-if="dataManager"
        >
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="openModifyPanel(row)">编辑</el-button>
            <el-button type="text" size="mini" @click="openWarningPanel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
        size="medium"
      >
        <el-form-item label="名称" prop="layerName">
          <el-input v-model="temp.layerName" placeholder="请输入数据名称" />
        </el-form-item>
        <el-form-item label="工程名" prop="irrigationName">
          <el-input v-model="temp.irrigationName" placeholder="请输入工程名" />
        </el-form-item>
        <el-form-item label="元信息" prop="elementData">
          <el-input v-model="temp.elementData" placeholder="请输入元信息" />
        </el-form-item>
        <el-form-item label="类型" prop="type" placeholder="请选择数据类型">
          <el-select v-model="temp.type" style="width:100%">
            <el-option
              v-for="item in DataType"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="格式" prop="format">
          <el-input v-model="temp.format" placeholder="请输入数据格式" />
        </el-form-item>
        <el-form-item label="日期" prop="data">
          <el-date-picker
            v-model="temp.data"
            style="width:100%"
            type="datetime"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="加载" prop="load">
          <el-input v-model="temp.load" placeholder="请确认是否第一次加载" />
        </el-form-item>
        <el-form-item v-show="temp.type === '矢量'? true : false" label="别名" prop="aliasesName">
          <el-input v-model="temp.aliasesName" placeholder="请输入数据别名" />
        </el-form-item>
        <el-form-item v-show="temp.type === '特效'? true : false" label="高度" prop="height">
          <el-input v-model="temp.height" placeholder="请输入高度" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="temp.status" placeholder="请输入数据状态" />
        </el-form-item>
        <el-form-item label="服务地址" prop="url">
          <el-input v-model="temp.url" placeholder="请输入服务地址" />
        </el-form-item>
        <el-form-item label="保存人员" prop="person">
          <el-input v-model="temp.person" placeholder="请输入保存人员" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="项目Id" prop="projectId">
          <el-input v-model="temp.projectId" placeholder="请输入项目Id" />
        </el-form-item>
        <el-form-item label="创建时间" prop="CreateTime">
          <el-input v-model="temp.CreateTime" placeholder="请输入创建时间" />
        </el-form-item>
        <el-form-item label="创建人" prop="CreateUser">
          <el-input v-model="temp.CreateUser" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="删除标记" prop="DeleteMark">
          <el-input v-model="temp.DeleteMark" placeholder="是否有删除标记" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="warnDialogVisible" width="30%">
      <span>确定删除这行数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warnDialogVisible = false">取 消</el-button>
        <el-button type="warning" @click="confirmDelete">确认删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "../../../../../store";
import axios from 'axios'
import permission from "@/directive/permission/index.js";

export default {
  name: '',
  data() {
    return {
      // tableData: null,
      listLoading: false,
      multipleSelection: [],
      dialogVisible: false,
      search: "",
      DataType: [
        {
          key: "矢量",
          display_name: "矢量"
        },
        {
          key: "三维模型",
          display_name: "三维模型"
        },
        {
          key: "特效",
          display_name: "特效"
        },
        {
          key: "BIM",
          display_name: "BIM"
        },
        {
          key: "点云",
          display_name: "点云"
        },
        {
          key: "自动单体化",
          display_name: "自动单体化"
        },
        {
          key: "手工建模",
          display_name: "手工建模"
        },
        {
          key: "JSON",
          display_name: "JSON"
        }
      ],
      temp: {
        layerName: "test",
        irrigationName: this.procjectName,
        url: "www.baidu.com",
        type: "json",
        elementData: " ",
        load: "是",
        aliasesName: "",
        height: "",
        format: "",
        data: "",
        status: "",
        person: "",
        phone: "",
        projectId: "",
        CreateTime: "",
        CreateUser: "",
        DeleteMark: ""
      },
      rules: {
        name: [{ required: true, message: "请输入数据名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        serverAddress: [
          { required: true, message: "请输入服务地址", trigger: "blur" }
        ]
      },
      title: '添加数据',
      dataManager: store.getters.roles.indexOf('spatialDataManager') != -1,
      tableData: [],
      warnDialogVisible: false,
      rowToDelete: {}
      // aliasesName: this.temp.type === "矢量" ? true : false,
      // height: this.temp.type === "特效" ? true : false
    }
  },
  props: {
    spatialData: Array,
    procjectName: String
  },
  directives: {
    permission
  },
  watch: {
    // spatialData: (val) => {
    //   // console.log(val)
    //   debugger
    //   this.tableData = val
    // }
    spatialData: function (val) {
      // console.log(val)
      this.tableData = val
    }
  },
  computed: {
    datas: function () {
      const search = this.search;
      if (search) {
        return this.tableData.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return String(dataNews[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      // console.log(this.tableData);
      // console.log(store.getters.roles);
      return this.tableData
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addDataToStore() {
      // var m = new Map()
      // m.set(this.procjectName, this.spatialData);
      // console.log(m)
      // let set = new Set([[this.procjectName, this.spatialData]])
      store.dispatch("AddCesiumData", { key: this.procjectName, value: this.multipleSelection });
    },
    handleAdd() {
      this.resetTemp();
      this.title = '添加数据';
      this.dialogVisible = true;
      // this.tableData = []
    },
    handleDelete() {

    },
    resetTemp() {
      this.temp = {
        layerName: "test",
        irrigationName: this.procjectName,
        url: "www.baidu.com",
        type: "json",
        elementData: " ",
        load: "是",
        aliasesName: "",
        height: "",
        format: "",
        data: "2019-10-27",
        status: "",
        person: "",
        phone: "",
        projectId: "",
        CreateTime: "",
        CreateUser: "",
        DeleteMark: ""
      }
    },
    confirm() {
      if (this.title === "修改数据") {
        this.confirmChange()
      } else {
        this.confirmToAdd()
      }
    },
    confirmChange() {
      this.updateOrAddLayer()
    },
    confirmToAdd() {
      this.updateOrAddLayer()
    },
    updateOrAddLayer() {
      var _this = this
      axios.post('http://172.16.7.50:8888/api/updateLayer',
        this.temp
      ).then(res => {
        if (res.status !== 200) {
          alert('修改失败')
        } else {
          _this.$message({
            message: '操作成功',
            type: 'success'
          });
          _this.dialogVisible = false
          _this.getlayers()
        }
      }).catch((error) => {
        alert(error)
      });
    },
    openModifyPanel(row) {
      this.title = '修改数据';
      this.temp = row
      this.dialogVisible = true;
    },
    openWarningPanel(row) {
      this.rowToDelete = row
      this.warnDialogVisible = true
    },
    confirmDelete() {
      var _this = this
      axios.post('http://172.16.7.50:8888/api/deleteLayer',
        {
          layerName: this.rowToDelete.layerName
        }
      ).then(res => {
        if (res.status !== 200) {
          alert('修改失败')
        } else {
          _this.$message({
            message: '操作成功',
            type: 'success'
          });
          _this.warnDialogVisible = false
          _this.getlayers()
        }
      }).catch((error) => {
        alert(error)
      });
    },
    getlayers() {
      var _this = this
      axios.get('http://172.16.7.50:8888/api/getLayer', {
        params: {
          Pname: _this.procjectName,
          Ptype: ''
        }      }).then(res => {
        _this.tableData = res.data.data
      }).catch((error) => {
        alert(error)
      });
    }
  }
}
</script>

<style lang="" scoped>
</style>