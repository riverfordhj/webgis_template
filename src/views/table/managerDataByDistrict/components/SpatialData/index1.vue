<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tooltip class="item" effect="dark" content="填写表单添加数据" placement="top">
        <el-button
          v-permission="['spatialDataManager']"
          type="primary"
          size="small"
          @click="handleCreate"
        >添加数据</el-button>
      </el-tooltip>
      <el-tooltip
        v-permission="['spatialDataManager']"
        class="item"
        effect="dark"
        content="删除选中数据"
        placement="top"
      >
        <el-button type="danger" size="small" @click="handleDelete">删除数据</el-button>
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
        <el-table-column prop="name" width="150" label="名称" align="center"></el-table-column>
        <el-table-column prop="xzq" width="100" label="行政区" align="center"></el-table-column>
        <el-table-column prop="type" width="200" label="类型" align="center"></el-table-column>
        <el-table-column prop="format" width="100" label="格式" align="center"></el-table-column>
        <el-table-column prop="date" width="200" label="日期" align="center"></el-table-column>
        <el-table-column prop="size" width="100" label="大小" align="center"></el-table-column>
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
        <el-table-column prop="serverAddress" width="500" label="服务地址 / id" align="center"></el-table-column>
        <el-table-column prop="person" width="100" label="保存人员" align="center"></el-table-column>
        <el-table-column prop="phone" width="150" label="电话" align="center"></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100"
          fixed="right"
          class-name="small-padding fixed-width"
          v-if="dataManager"
        >
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="openModifyPanel(row)">编辑</el-button>
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
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入数据名称" />
        </el-form-item>
        <el-form-item label="行政区" prop="xzq">
          <el-input v-model="temp.xzq" placeholder="请输入行政区" />
        </el-form-item>
        <el-form-item label="类型" prop="type" placeholder="请选择数据类型">
          <el-select v-model="temp.type">
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
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="temp.date" type="datetime" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item label="大小" prop="size">
          <el-input v-model="temp.size" placeholder="请输入数据大小" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="temp.status" placeholder="请输入数据状态" />
        </el-form-item>
        <el-form-item label="服务地址" prop="serverAddress">
          <el-input v-model="temp.serverAddress" placeholder="请输入服务地址" />
        </el-form-item>
        <el-form-item label="保存人员" prop="person">
          <el-input v-model="temp.person" placeholder="请输入保存人员" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入电话号码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "../../../../../store";
import permission from "@/directive/permission/index.js";

export default {
  name: '',
  data() {
    return {
      tableData: null,
      listLoading: false,
      multipleSelection: [],
      dialogVisible: false,
      search: "",
      DataType: [
        {
          key: "二维矢量",
          display_name: "二维矢量"
        },
        {
          key: "三维倾斜测量",
          display_name: "三维倾斜测量"
        }
      ],
      temp: {
        name: "",
        xzq: "",
        type: "",
        format: "",
        date: new Date(),
        size: "",
        status: "",
        serverAddress: "",
        person: "",
        phone: ""
      },
      rules: {
        name: [{ required: true, message: "请输入数据名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        serverAddress: [
          { required: true, message: "请输入服务地址", trigger: "blur" }
        ]
      },
      title: '添加数据',
      dataManager: store.getters.roles.indexOf('spatialDataManager') != -1
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
    spatialData: val => {
      // console.log(val)
    }
  },
  computed: {
    datas: function () {
      const search = this.search;
      if (search) {
        return this.spatialData.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return String(dataNews[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      // console.log(this.tableData);
      // console.log(store.getters.roles);
      return this.spatialData
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
    handleCreate() {
      this.resetTemp();
      this.title = '添加数据';
      this.dialogVisible = true;
    },
    handleDelete() {

    },
    resetTemp() {
      this.temp = {
        name: "",
        xzq: "",
        type: "",
        format: "",
        date: new Date(),
        size: "",
        status: "",
        serverAddress: "",
        person: "",
        phone: ""
      };
    },
    confirm() {

    },
    openModifyPanel(row) {
      this.title = '修改数据';
      this.temp = row
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="" scoped>
</style>